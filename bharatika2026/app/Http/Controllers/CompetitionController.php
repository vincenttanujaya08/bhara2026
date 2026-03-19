<?php

namespace App\Http\Controllers;

use App\Models\Competition;
use App\Models\Registration;
use App\Models\TeamMember;
use App\Models\RegistrationLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CompetitionController extends Controller
{
    public function index()
    {
        $categories = \App\Models\Category::with('competitions')->get();
        return Inertia::render('Competitions/Index', compact('categories'));
    }

    public function show($id)
    {
        $competition = Competition::findOrFail($id);
        return Inertia::render('Competitions/Register', [
            'competition' => $competition,
        ]);
    }

    public function store(Request $request, $id)
    {
        $competition = Competition::findOrFail($id);

        $request->validate([
            'leader_ktm' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'payment'    => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'members.*.ktm' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $filledMembers = collect($request->members)->filter(fn($m) => !empty($m['name']))->count();
        $totalParticipants = 1 + $filledMembers;

        if ($totalParticipants < $competition->min_participants) {
            return back()->withErrors('Jumlah peserta kurang dari minimum.');
        }
        if ($totalParticipants > $competition->max_participants) {
            return back()->withErrors('Jumlah peserta melebihi maksimum.');
        }

        return DB::transaction(function () use ($request, $competition) {
            $paymentPath = $request->file('payment')->store('payments', 'public');

            $registration = Registration::create([
                'user_id'        => Auth::id(),
                'competition_id' => $competition->id,
                'payment_proof'  => $paymentPath,
                'payment_status' => 'pending',
            ]);

            RegistrationLog::create([
                'registration_id' => $registration->id,
                'status'          => 'pending',
                'notes'           => 'Pendaftaran pertama kali disubmit oleh peserta.',
            ]);

            $leaderKtmPath = $request->file('leader_ktm')->store('ktm', 'public');
            TeamMember::create([
                'registration_id' => $registration->id,
                'name'            => Auth::user()->name,
                'ktm_file'        => $leaderKtmPath,
            ]);

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

            return redirect('/history')->with('success', 'Berhasil daftar! Silakan tunggu validasi.');
        });
    }

    public function history()
    {
        $registrations = Registration::where('user_id', Auth::id())
            ->with(['competition.category'])
            ->latest()
            ->get();
        return Inertia::render('Competitions/History', compact('registrations'));
    }

    public function showHistory($id)
    {
        $registration = Registration::where('id', $id)
            ->where('user_id', Auth::id())
            ->with(['competition', 'members', 'logs'])
            ->firstOrFail();
        return Inertia::render('Competitions/HistoryDetail', compact('registration'));
    }

    public function updateHistory(Request $request, $id)
    {
        $registration = Registration::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($registration->payment_status !== 'rejected') {
            return back()->withErrors('Hanya pendaftaran yang ditolak yang bisa diedit.');
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
                'notes'           => 'Peserta memperbarui dokumen dan mengajukan ulang validasi.',
            ]);
        });

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function submitWork(Request $request, $id)
    {
        $registration = Registration::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('payment_status', 'approved')
            ->firstOrFail();

        $request->validate([
            'submission_title'       => 'required|string|max:255',
            'submission_description' => 'required|string',
            'submission_file'        => 'required|file|mimes:zip,rar|max:20480',
        ]);

        if (str_word_count($request->submission_description) > 100) {
            return back()->withErrors('Deskripsi karya tidak boleh lebih dari 100 kata.');
        }

        $registration->update([
            'submission_title'       => $request->submission_title,
            'submission_description' => $request->submission_description,
            'submission_file'        => $request->file('submission_file')->store('submissions', 'public'),
        ]);

        return back()->with('success', 'Karya berhasil diunggah!');
    }
}
