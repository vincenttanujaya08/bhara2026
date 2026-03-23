<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pendaftaran Diverifikasi</title>
    <style>
        /* Standar reset untuk email */
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                padding: 15px !important;
            }

            .header-title {
                font-size: 24px !important;
            }

            .code-box h1 {
                font-size: 32px !important;
            }

            .btn {
                display: block !important;
                padding: 15px 10px !important;
            }
        }
    </style>
</head>

<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">

    <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 1px solid #eeeeee; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

        <h2 class="header-title" style="color: #8B1A1A; margin-top: 0; font-size: 28px; letter-spacing: -0.5px;">
            Halo, {{ $registration->user->name }}!
        </h2>

        <p style="font-size: 16px; color: #555;">
            Selamat! Pendaftaran kamu untuk kompetisi <strong style="color: #333;">{{ $registration->competition->name }}</strong> telah berhasil diverifikasi oleh tim admin Bharatika.
        </p>

        <div class="code-box" style="background-color: #FDFBF4; padding: 30px 15px; border: 2px dashed #C8A84B; border-radius: 8px; text-align: center; margin: 30px 0;">
            <p style="margin: 0; font-size: 13px; color: #8B1A1A; font-weight: bold; letter-spacing: 3px; text-transform: uppercase;">
                Kode Peserta Kamu
            </p>
            <h1 style="margin: 10px 0 0; color: #C8A84B; font-size: 48px; letter-spacing: 5px; font-weight: 800;">
                {{ $registration->participant_code }}
            </h1>
        </div>

        <p style="font-size: 15px; color: #555;">
            Gunakan kode di atas untuk melakukan pengumpulan karya melalui dashboard pendaftaran kamu. Pastikan kamu memperhatikan tenggat waktu pengumpulan ya!
        </p>

        <div style="text-align: center; margin: 40px 0;">
            <a href="{{ url('/history/' . $registration->id) }}" class="btn"
                style="background-color: #8B1A1A; color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; letter-spacing: 1px; display: inline-block; transition: background 0.3s ease;">
                LIHAT DASHBOARD PENDAFTARAN
            </a>
        </div>

        <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
            Jika tombol di atas tidak berfungsi, silakan salin tautan berikut ke browser kamu:<br>
            <a href="{{ url('/history/' . $registration->id) }}" style="color: #8B1A1A;">{{ url('/history/' . $registration->id) }}</a>
        </p>

        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">

        <p style="font-size: 11px; color: #bbbbbb; text-align: center; letter-spacing: 1px; text-transform: uppercase;">
            © Bharatika Creative Design Festival 2026<br>
            Petra Christian University, Surabaya
        </p>
    </div>

</body>

</html>