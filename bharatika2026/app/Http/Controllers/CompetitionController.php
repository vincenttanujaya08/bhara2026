<?php

namespace App\Http\Controllers;

use App\Models\Competition;
use App\Models\Registration;
use App\Models\TeamMember;
use App\Models\RegistrationLog;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CompetitionController extends Controller
{
    /**
     * Menampilkan daftar semua kategori dan lomba.
     */
    public function index()
    {
        $userId = Auth::id();

        // Mengambil kategori beserta kompetisinya dan status pendaftaran user yang login
        $categories = Category::with(['competitions' => function ($query) use ($userId) {
            $query->with(['registrations' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
        }])->get();

        return Inertia::render('Competitions/Index', compact('categories'));
    }

    /**
     * Menampilkan form pendaftaran lomba.
     */
    public function show($id)
    {
        $userId = Auth::id();
        $competition = Competition::with('category')->findOrFail($id);

        // Cek apakah user sudah memiliki pendaftaran aktif (Pending atau Approved)
        $existingRegistration = Registration::where('user_id', $userId)
            ->where('competition_id', $id)
            ->whereIn('payment_status', ['pending', 'approved'])
            ->exists();

        // Jika sudah terdaftar, jangan tampilkan form, langsung ke halaman Verifying
        if ($existingRegistration) {
            return Inertia::render('Competitions/Success');
        }

        return Inertia::render('Competitions/Register', [
            'competition' => $competition,
        ]);
    }

    /**
     * Menyimpan data pendaftaran lomba baru.
     */
    public function store(Request $request, $id)
    {
        $competition = Competition::findOrFail($id);
        $userId = Auth::id();

        // Validasi ganda di sisi backend
        $alreadyRegistered = Registration::where('user_id', $userId)
            ->where('competition_id', $id)
            ->whereIn('payment_status', ['pending', 'approved'])
            ->exists();

        if ($alreadyRegistered) {
            return Inertia::render('Competitions/Success');
        }

        // Validasi input file dan anggota
        $request->validate([
            'leader_ktm' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'payment'    => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'members.*.ktm' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Hitung jumlah peserta (Ketua + Anggota yang namanya diisi)
        $filledMembers = collect($request->members)->filter(fn($m) => !empty($m['name']))->count();
        $totalParticipants = 1 + $filledMembers;

        // Validasi jumlah minimal dan maksimal peserta sesuai database
        if ($totalParticipants < $competition->min_participants) {
            return back()->withErrors(['members' => 'Jumlah peserta kurang dari minimum yang ditentukan.']);
        }
        if ($totalParticipants > $competition->max_participants) {
            return back()->withErrors(['members' => 'Jumlah peserta melebihi batas maksimum.']);
        }

        return DB::transaction(function () use ($request, $competition, $userId) {
            // 1. Simpan Bukti Pembayaran
            $paymentPath = $request->file('payment')->store('payments', 'public');

            // 2. Buat Data Registrasi Utama
            $registration = Registration::create([
                'user_id'        => $userId,
                'competition_id' => $competition->id,
                'payment_proof'  => $paymentPath,
                'payment_status' => 'pending',
            ]);

            // 3. Catat Log Pendaftaran
            RegistrationLog::create([
                'registration_id' => $registration->id,
                'status'          => 'pending',
                'notes'           => 'Pendaftaran baru dikirimkan dan menunggu verifikasi admin.',
            ]);

            // 4. Simpan Data Ketua Tim (TeamMember pertama)
            $leaderKtmPath = $request->file('leader_ktm')->store('ktm', 'public');
            TeamMember::create([
                'registration_id' => $registration->id,
                'name'            => Auth::user()->name,
                'ktm_file'        => $leaderKtmPath,
            ]);

            // 5. Simpan Data Anggota Tambahan (jika ada)
            foreach ($request->members ?? [] as $member) {
                if (!empty($member['name'])) {
                    $ktmPath = isset($member['ktm']) ? $member['ktm']->store('ktm', 'public') : null;
                    TeamMember::create([
                        'registration_id' => $registration->id,
                        'name'            => $member['name'],
                        'ktm_file'        => $ktmPath,
                    ]);
                }
            }

            // Arahkan ke halaman Sukses/Verifying
            return Inertia::render('Competitions/Success');
        });
    }

    /**
     * Menampilkan riwayat pendaftaran milik user.
     */
    public function history()
    {
        $registrations = Registration::where('user_id', Auth::id())
            ->with(['competition.category', 'members'])
            ->latest()
            ->get();
        return Inertia::render('Competitions/History', compact('registrations'));
    }

    /**
     * Menampilkan detail dari satu pendaftaran.
     */
    public function showHistory($id)
    {
        $registration = Registration::where('id', $id)
            ->where('user_id', Auth::id())
            ->with(['competition.category', 'members', 'logs'])
            ->firstOrFail();
        return Inertia::render('Competitions/HistoryDetail', compact('registration'));
    }

    /**
     * Mengupdate data pendaftaran jika ditolak oleh admin.
     */
    public function updateHistory(Request $request, $id)
    {
        $registration = Registration::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($registration->payment_status !== 'rejected') {
            return back()->withErrors('Hanya pendaftaran yang ditolak yang dapat diperbarui.');
        }

        $request->validate([
            'payment'        => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'members.*.ktm'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        DB::transaction(function () use ($request, $registration) {
            if ($request->hasFile('payment')) {
                $registration->payment_proof = $request->file('payment')->store('payments', 'public');
            }

            if ($request->members) {
                foreach ($request->members as $memberId => $memberData) {
                    if (isset($memberData['ktm'])) {
                        $member = TeamMember::where('id', $memberId)
                            ->where('registration_id', $registration->id)
                            ->first();
                        if ($member) {
                            $member->ktm_file = $memberData['ktm']->store('ktm', 'public');
                            $member->save();
                        }
                    }
                }
            }

            $registration->payment_status = 'pending';
            $registration->save();

            RegistrationLog::create([
                'registration_id' => $registration->id,
                'status'          => 'pending',
                'notes'           => 'Peserta telah mengunggah ulang dokumen untuk validasi ulang.',
            ]);
        });

        return back()->with('success', 'Pendaftaran berhasil diajukan kembali.');
    }

    /**
     * Mengunggah karya untuk pendaftaran yang sudah approved.
     */
    public function submitWork(Request $request, $id)
    {
        $registration = Registration::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('payment_status', 'approved')
            ->firstOrFail();

        $request->validate([
            'submission_title'       => 'required|string|max:255',
            'submission_description' => 'required|string',
            'submission_file'        => 'required|file|mimes:zip,rar|max:20480', // Maks 20MB
        ]);

        $registration->update([
            'submission_title'       => $request->submission_title,
            'submission_description' => $request->submission_description,
            'submission_file'        => $request->file('submission_file')->store('submissions', 'public'),
        ]);

        return back()->with('success', 'Karya Anda berhasil dikirim!');
    }
}
