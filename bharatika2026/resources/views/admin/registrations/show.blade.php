<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Verifikasi Pendaftaran</title>
    <style>
        .container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .section {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }

        img {
            max-width: 100%;
            border-radius: 8px;
            border: 1px solid #ddd;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }

        select,
        input,
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .btn-submit {
            background: #1e293b;
            color: white;
            padding: 12px;
            border: none;
            width: 100%;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <a href="/admin/registrations">← Kembali</a>
        <h2>Verifikasi: {{ $registration->competition->name }}</h2>

        <div class="section">
            <h3>Informasi Tim</h3>
            <p><strong>Ketua:</strong> {{ $registration->user->name }}</p>
            <p><strong>Instansi:</strong> {{ $registration->user->instansi }}</p>
            <h4>Anggota:</h4>
            <ul>
                @foreach($registration->members as $member)
                <li>{{ $member->name }} (<a href="{{ asset('storage/' . $member->ktm_file) }}" target="_blank">Lihat KTM</a>)</li>
                @endforeach
            </ul>
        </div>

        <div class="section">
            <h3>Bukti Pembayaran</h3>
            <img src="{{ asset('storage/' . $registration->payment_proof) }}" alt="Bukti Bayar">
        </div>

        <div class="section">
            <h3>Form Verifikasi</h3>
            <form action="/admin/registrations/{{ $registration->id }}/verify" method="POST">
                @csrf
                <div class="form-group">
                    <label>Status</label>
                    <select name="status" required>
                        <option value="approved" {{ $registration->payment_status == 'approved' ? 'selected' : '' }}>Approve (Lunas/Valid)</option>
                        <option value="rejected" {{ $registration->payment_status == 'rejected' ? 'selected' : '' }}>Reject (Tolak)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Catatan/Alasan (Akan dilihat peserta)</label>
                    <textarea name="notes" rows="3" placeholder="Berikan alasan jika ditolak atau info tambahan jika diterima..."></textarea>
                </div>
                <button type="submit" class="btn-submit">Update Status & Catat Log</button>
            </form>
        </div>

        <div class="section">
            <h3>Riwayat Log Status</h3>
            @foreach($registration->logs as $log)
            <div style="font-size: 0.9rem; margin-bottom: 10px; padding: 10px; background: #f9fafb;">
                <strong>{{ strtoupper($log->status) }}</strong> - {{ $log->created_at->format('d M Y H:i') }}
                <p style="margin: 5px 0 0 0; color: #4b5563;">{{ $log->notes }}</p>
            </div>
            @endforeach
        </div>
    </div>
</body>

</html>