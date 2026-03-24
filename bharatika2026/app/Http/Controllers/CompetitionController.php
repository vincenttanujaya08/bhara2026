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
use App\Services\GoogleDriveService;
use Illuminate\Support\Facades\Log;

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

        // Validasi diperketat agar sesuai dengan input React
        $request->validate([
            'payment'        => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'members'        => 'nullable|array',
            'members.*.name' => 'required|string|max:255',
            'members.*.ktm'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        DB::transaction(function () use ($request, $registration) {
            // 1. Update Bukti Pembayaran (Jika ada file baru)
            if ($request->hasFile('payment')) {
                $registration->payment_proof = $request->file('payment')->store('payments', 'public');
            }

            // 2. Update Data Anggota (Nama & KTM)
            if ($request->members) {
                foreach ($request->members as $memberId => $memberData) {
                    $member = TeamMember::where('id', $memberId)
                        ->where('registration_id', $registration->id)
                        ->first();

                    if ($member) {
                        // Selalu update nama karena user mungkin menggantinya di input text
                        $member->name = $memberData['name'];

                        // Update KTM hanya jika ada file baru yang diunggah
                        if ($request->hasFile("members.$memberId.ktm")) {
                            $member->ktm_file = $request->file("members.$memberId.ktm")->store('ktm', 'public');
                        }

                        $member->save();
                    }
                }
            }

            // 3. Kembalikan status ke Pending & catat Log
            $registration->payment_status = 'pending';
            $registration->save();

            RegistrationLog::create([
                'registration_id' => $registration->id,
                'status'          => 'pending',
                'notes'           => 'Peserta telah memperbaiki data dan mengajukan validasi ulang.',
            ]);
        });

        return back()->with('success', 'Perubahan berhasil disimpan. Silakan tunggu verifikasi ulang.');
    }

    /**
     * Mengunggah karya untuk pendaftaran yang sudah approved.
     */
    public function submitWork(Request $request, $id)
    {
        $registration = Registration::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('payment_status', 'approved')
            ->with(['competition.category', 'user']) // Load relasi untuk info upload Drive
            ->firstOrFail();

        $request->validate([
            'submission_title'       => 'required|string|max:255',
            'submission_description' => 'required|string',
            'submission_file'        => 'required|file|mimes:zip,rar|max:102400', // 100MB
        ]);

        // Tambahan validasi 100 kata sesuai permintaanmu
        if (str_word_count($request->submission_description) > 100) {
            return back()->withErrors(['submission_description' => 'Deskripsi karya tidak boleh lebih dari 100 kata.']);
        }

        if ($request->hasFile('submission_file')) {
            $file = $request->file('submission_file');

            // 1. Logika Penamaan File: nopeserta.extension
            $extension = $file->getClientOriginalExtension();
            $safeParticipantCode = str_replace(['/', '\\', ' '], '-', $registration->participant_code);
            $fileName = $safeParticipantCode . '.' . $extension;

            // 2. Simpan ke folder lokal (submissions) dengan nama kustom
            $path = $file->storeAs('submissions', $fileName, 'public');

            // 3. Update database dengan path lokal
            $registration->update([
                'submission_title'       => $request->submission_title,
                'submission_description' => $request->submission_description,
                'submission_file'        => $path,
            ]);

            // // 4. Upload ke Google Drive via Service
            // try {
            //     $driveService = new GoogleDriveService();

            //     // Mengirim file yang baru saja disimpan ke Drive
            //     // Parameter: (path_fisik, nama_file_di_drive, folder_kategori, folder_lomba)
            //     $driveService->uploadFile(
            //         storage_path('app/public/' . $path),
            //         $fileName, // Nama di drive tetap menggunakan nopeserta.zip agar rapi
            //         $registration->competition->category->name,
            //         $registration->competition->name
            //     );
            // } catch (\Exception $e) {
            //     // Jika upload drive gagal, file lokal tetap aman dan user tidak terhambat
            //     Log::error('Google Drive upload failed for ' . $fileName . ': ' . $e->getMessage());
            // }

            return back()->with('success', 'Karya Anda berhasil dikirim dengan nama: ' . $fileName);
        }

        return back()->withErrors('Gagal mengunggah file.');
    }
}
