<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Pendaftaran Berhasil Diverifikasi</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #e1e1e1;
            border-radius: 10px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #f4f4f4;
            padding-bottom: 20px;
        }

        .content {
            padding: 20px 0;
        }

        .participant-card {
            background-color: #f9f9f9;
            border: 2px dashed #1e293b;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 8px;
        }

        .code {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            letter-spacing: 2px;
        }

        .footer {
            font-size: 12px;
            color: #777;
            text-align: center;
            border-top: 1px solid #f4f4f4;
            padding-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #1e293b;">Selamat!</h1>
        </div>

        <div class="content">
            <p>Halo, <strong>{{ $registration->user->name }}</strong>,</p>

            <p>Kami informasikan bahwa pembayaran dan pendaftaranmu untuk kategori lomba <strong>{{ $registration->competition->name }}</strong> telah berhasil diverifikasi oleh panitia.</p>

            <p>Sekarang kamu telah resmi terdaftar sebagai peserta Bharatika 2026. Berikut adalah Kode Unik Pesertamu:</p>

            <div class="participant-card">
                <p style="margin: 0; font-size: 14px;">KODE PESERTA</p>
                <div class="code">{{ $registration->participant_code ?? 'BHR-TEMP' }}</div>
            </div>

            <p>Simpan kode ini baik-baik karena akan digunakan untuk proses pengumpulan karya (submission) dan identitas selama perlombaan berlangsung.</p>

            <p>Tunjukkan karya terbaikmu dan sampai jumpa di tahap selanjutnya!</p>
        </div>

        <div class="footer">
            <p>Email ini dikirim secara otomatis oleh sistem Bharatika 2026.<br>
                Petra Christian University, Surabaya.</p>
        </div>
    </div>
</body>

</html>