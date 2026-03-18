<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\RegistrationLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationSuccess;

class AdminController extends Controller
{
    public function index()
    {
        $stats = [
            'total' => Registration::count(),
            'pending' => Registration::where('payment_status', 'pending')->count(),
            'approved' => Registration::where('payment_status', 'approved')->count(),
            'rejected' => Registration::where('payment_status', 'rejected')->count(),
        ];
        return view('admin.dashboard', compact('stats'));
    }

    public function registrations()
    {
        $registrations = Registration::with(['competition', 'user'])->latest()->get();
        return view('admin.registrations.index', compact('registrations'));
    }

    public function showRegistration($id)
    {
        $registration = Registration::with(['competition', 'user', 'members', 'logs'])->findOrFail($id);
        return view('admin.registrations.show', compact('registration'));
    }

    public function verify(Request $request, $id)
    {
        $registration = Registration::with(['user', 'competition'])->findOrFail($id);

        $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $registration) {
            $registration->payment_status = $request->status;

            if ($request->status === 'approved') {
                $competitionCode = $registration->competition->code;

                $orderNumber = Registration::where('competition_id', $registration->competition_id)
                    ->where('payment_status', 'approved')
                    ->count() + 1;

                $registration->participant_code = $competitionCode . str_pad($orderNumber, 3, '0', STR_PAD_LEFT);

                // Mail::to($registration->user->email)->send(new VerificationSuccess($registration));
            }

            $registration->save();

            RegistrationLog::create([
                'registration_id' => $registration->id,
                'status' => $request->status,
                'notes' => $request->notes ?? ($request->status === 'approved' ? 'Pembayaran valid dan kode peserta telah diterbitkan.' : 'Data tidak sesuai.')
            ]);
        });

        return redirect()->route('admin.registrations.index')->with('success', 'Status diperbarui. Kode Peserta: ' . $registration->participant_code);
    }
}
