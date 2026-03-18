<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Riwayat Pendaftaran</title>

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
            max-width: 800px;
            margin: 20px auto;
        }

        .back {
            text-decoration: none;
            color: #6b7280;
            font-size: 0.95rem;
            display: inline-block;
            margin-bottom: 20px;
            transition: color 0.2s;
        }

        .back:hover {
            color: #111827;
        }

        .page-title {
            color: #111827;
            font-size: 2.2rem;
            margin-top: 0;
            margin-bottom: 30px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 15px;
        }

        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }

        .card {
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .comp-name {
            font-size: 1.25rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
        }

        .comp-date {
            color: #6b7280;
            font-size: 0.85rem;
            margin-bottom: 15px;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-pending {
            background-color: #fef3c7;
            color: #d97706;
            border: 1px solid #fde68a;
        }

        .status-approved {
            background-color: #d1fae5;
            color: #059669;
            border: 1px solid #a7f3d0;
        }

        .status-rejected {
            background-color: #fee2e2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            background: #ffffff;
            border-radius: 10px;
            border: 1px dashed #d1d5db;
            color: #6b7280;
        }
    </style>
</head>

<body>

    <div class="container">

        <a href="/" class="back">← Kembali ke Beranda</a>

        <h1 class="page-title">Riwayat Pendaftaran Saya</h1>

        @if($registrations->isEmpty())
        <div class="empty-state">
            <p>Anda belum mendaftar lomba apapun.</p>
            <a href="/competitions" style="color: #3b82f6; text-decoration: none; font-weight: 600;">Lihat Daftar Lomba</a>
        </div>
        @else
        <div class="grid-container">
            @foreach($registrations as $reg)
            <a href="/history/{{ $reg->id }}" style="text-decoration: none; color: inherit;">
                <div class="card">
                    <div class="comp-name">{{ $reg->competition->name }}</div>
                    <div class="comp-date">Tanggal Daftar: {{ $reg->created_at->format('d M Y H:i') }}</div>

                    <div>
                        @if($reg->payment_status == 'pending')
                        <span class="status-badge status-pending">Menunggu Validasi</span>
                        @elseif($reg->payment_status == 'approved')
                        <span class="status-badge status-approved">Valid / Lunas</span>
                        @elseif($reg->payment_status == 'rejected')
                        <span class="status-badge status-rejected">Ditolak</span>
                        @else
                        <span class="status-badge">{{ $reg->payment_status }}</span>
                        @endif
                    </div>
                </div>
            </a>
            @endforeach
        </div>
        @endif

    </div>

</body>

</html>