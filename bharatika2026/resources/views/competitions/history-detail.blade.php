<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail Pendaftaran</title>

    <style>
        * {
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f3f4f6;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            margin: 0;
        }

        .container {
            max-width: 700px;
            margin: 20px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }

        .header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        h2 {
            margin: 0 0 10px 0;
            color: #111827;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-pending {
            background-color: #fef3c7;
            color: #d97706;
        }

        .status-approved {
            background-color: #d1fae5;
            color: #059669;
        }

        .status-rejected {
            background-color: #fee2e2;
            color: #dc2626;
        }

        .alert-box {
            background-color: #fef2f2;
            border: 1px solid #f87171;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            color: #991b1b;
        }

        .success-box {
            background-color: #f0fdf4;
            border: 1px solid #4ade80;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            color: #166534;
        }

        .error-box {
            background-color: #fef2f2;
            border: 1px solid #f87171;
            color: #991b1b;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }

        .section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #e5e7eb;
        }

        .section h3 {
            margin-top: 0;
            font-size: 1.1rem;
            color: #374151;
            margin-bottom: 15px;
        }

        .data-row {
            display: flex;
            margin-bottom: 10px;
            font-size: 0.95rem;
        }

        .data-label {
            font-weight: 600;
            width: 150px;
            color: #4b5563;
        }

        .data-value {
            color: #111827;
            flex: 1;
        }

        .img-preview {
            max-width: 200px;
            border-radius: 6px;
            border: 1px solid #d1d5db;
            margin-top: 10px;
            display: block;
        }

        input[type="file"] {
            margin-top: 10px;
            width: 100%;
            padding: 8px;
            border: 1px dashed #d1d5db;
            background: #ffffff;
            border-radius: 6px;
        }

        .btn {
            background-color: #111827;
            color: #ffffff;
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            font-size: 1rem;
            margin-top: 10px;
        }

        .btn:hover {
            background-color: #374151;
        }

        .back {
            text-decoration: none;
            color: #6b7280;
            margin-bottom: 20px;
            display: inline-block;
        }
    </style>
</head>

<body>

    <div class="container">
        <a href="/history" class="back">← Kembali ke Riwayat</a>

        @if(session('success'))
        <div class="success-box">
            {{ session('success') }}
        </div>
        @endif

        @if ($errors->any())
        <div class="error-box">
            <ul style="margin: 0; padding-left: 20px;">
                @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        <div class="header">
            <h2>{{ $registration->competition->name }}</h2>

            @if($registration->payment_status == 'pending')
            <span class="status-badge status-pending">Menunggu Validasi</span>
            @elseif($registration->payment_status == 'approved')
            <span class="status-badge status-approved">Valid / Lunas</span>
            @elseif($registration->payment_status == 'rejected')
            <span class="status-badge status-rejected">Ditolak</span>
            @endif

            @if($registration->participant_code)
            <div style="margin-top: 15px; font-weight: bold; font-size: 1.1rem; color: #059669;">
                ID Peserta: {{ $registration->participant_code }}
            </div>
            @endif
        </div>

        @if($registration->payment_status == 'rejected')
        <div class="alert-box">
            <strong>Pendaftaran Ditolak!</strong><br>
            Alasan: {{ $registration->logs->where('status', 'rejected')->first()->notes ?? 'Terdapat data yang tidak valid. Silakan periksa kembali lampiran Anda.' }}<br>
            <small>Silakan upload ulang file yang salah pada form di bawah ini dan simpan perubahan.</small>
        </div>
        @endif

        <form action="/history/{{ $registration->id }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="section">
                <h3>Tim & Anggota</h3>

                @foreach($registration->members as $index => $member)
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
                    <div class="data-row">
                        <span class="data-label">Nama Anggota {{ $index + 1 }}</span>
                        <span class="data-value">{{ $member->name }} @if($index == 0) (Ketua) @endif</span>
                    </div>

                    <div class="data-row">
                        <span class="data-label">File KTM Saat Ini</span>
                        <span class="data-value">
                            <a href="{{ asset('storage/' . $member->ktm_file) }}" target="_blank" style="color: #3b82f6;">Lihat KTM</a>
                        </span>
                    </div>

                    @if($registration->payment_status == 'rejected')
                    <div>
                        <label style="font-size: 0.85rem; color: #dc2626; font-weight: 600;">Upload KTM Baru (Opsional, jika ini yang salah)</label>
                        <input type="file" name="members[{{ $member->id }}][ktm]" accept="image/png, image/jpeg, image/jpg">
                    </div>
                    @endif
                </div>
                @endforeach
            </div>

            <div class="section">
                <h3>Administrasi</h3>

                <div class="data-row">
                    <span class="data-label">Bukti Bayar Saat Ini</span>
                    <span class="data-value">
                        <a href="{{ asset('storage/' . $registration->payment_proof) }}" target="_blank" style="color: #3b82f6;">Lihat Bukti Pembayaran</a>
                    </span>
                </div>

                @if($registration->payment_status == 'rejected')
                <div style="margin-top: 15px;">
                    <label style="font-size: 0.85rem; color: #dc2626; font-weight: 600;">Upload Bukti Bayar Baru (Opsional, jika ini yang salah)</label>
                    <input type="file" name="payment" accept="image/png, image/jpeg, image/jpg">
                </div>
                @endif
            </div>

            @if($registration->payment_status == 'rejected')
            <button type="submit" class="btn">Simpan & Ajukan Ulang Validasi</button>
            @endif
        </form>

        @if($registration->payment_status == 'approved')
        <div class="section" style="border-color: #3b82f6; background-color: #eff6ff;">
            <h3 style="color: #1d4ed8;">Pengumpulan Karya</h3>

            @if($registration->submission_file)
            <div class="success-box" style="margin-bottom: 15px;">
                Karya Anda telah berhasil dikumpulkan!
            </div>
            <div class="data-row">
                <span class="data-label">Judul Karya</span>
                <span class="data-value">{{ $registration->submission_title }}</span>
            </div>
            <div class="data-row" style="display: block; margin-bottom: 15px;">
                <span class="data-label" style="display: block; margin-bottom: 5px;">Deskripsi</span>
                <div class="data-value" style="background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #d1d5db;">
                    {{ $registration->submission_description }}
                </div>
            </div>
            <div class="data-row">
                <span class="data-label">File Karya</span>
                <span class="data-value">
                    <a href="{{ asset('storage/' . $registration->submission_file) }}" target="_blank" style="color: #3b82f6; font-weight: bold;">Download File ZIP</a>
                </span>
            </div>
            @else
            <p style="font-size: 0.9rem; margin-bottom: 20px;">Silakan unggah karya tim Anda di sini. Pastikan file dalam format <strong>.ZIP</strong> atau <strong>.RAR</strong> (Maksimal 20MB).</p>

            <form action="/history/{{ $registration->id }}/submit-work" method="POST" enctype="multipart/form-data">
                @csrf

                <div style="margin-bottom: 15px;">
                    <label style="font-weight: 600; display:block; margin-bottom: 5px; font-size: 0.9rem;">Judul Karya</label>
                    <input type="text" name="submission_title" required placeholder="Masukkan judul karya..." style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #d1d5db;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="font-weight: 600; display:block; margin-bottom: 5px; font-size: 0.9rem;">Deskripsi Karya (Maks 100 Kata)</label>
                    <textarea name="submission_description" required rows="4" placeholder="Jelaskan secara singkat mengenai karya Anda..." style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #d1d5db; resize: vertical;"></textarea>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="font-weight: 600; display:block; margin-bottom: 5px; font-size: 0.9rem;">Upload File (ZIP/RAR)</label>
                    <input type="file" name="submission_file" accept=".zip,.rar" required>
                </div>

                <button type="submit" class="btn" style="background-color: #2563eb;">Unggah Karya Sekarang</button>
            </form>
            @endif
        </div>
        @endif

        <div class="section">
            <h3>Log Status Pendaftaran</h3>
            <div style="background: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden;">
                @foreach($registration->logs as $log)
                <div style="padding: 15px; border-bottom: 1px solid #e5e7eb; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-weight: 600; font-size: 0.95rem; text-transform: uppercase;">
                            @if($log->status == 'pending')
                            <span style="color: #d97706;">{{ $log->status }}</span>
                            @elseif($log->status == 'approved')
                            <span style="color: #059669;">{{ $log->status }}</span>
                            @elseif($log->status == 'rejected')
                            <span style="color: #dc2626;">{{ $log->status }}</span>
                            @endif
                        </span>
                        <span style="font-size: 0.85rem; color: #6b7280;">{{ $log->created_at->format('d M Y H:i') }}</span>
                    </div>
                    <div style="font-size: 0.9rem; color: #374151;">
                        {{ $log->notes ?? '-' }}
                    </div>
                </div>
                @endforeach
            </div>
        </div>

    </div>

</body>

</html>