<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationSuccess extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public $registration) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Selamat! Pendaftaran ' . $this->registration->competition->name . ' Berhasil Diverifikasi',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verified',
        );
    }
}
