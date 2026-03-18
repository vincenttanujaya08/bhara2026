<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Daftar Pendaftaran</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        th {
            background: #f8fafc;
        }

        .badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
        }

        .pending {
            background: #fef3c7;
            color: #d97706;
        }

        .approved {
            background: #d1fae5;
            color: #059669;
        }

        .rejected {
            background: #fee2e2;
            color: #dc2626;
        }
    </style>
</head>

<body>
    <div style="padding: 40px;">
        <h2>Semua Pendaftaran</h2>
        @if(session('success')) <div style="color: green;">{{ session('success') }}</div> @endif
        <table>
            <thead>
                <tr>
                    <th>Nama Ketua</th>
                    <th>Lomba</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                @foreach($registrations as $reg)
                <tr>
                    <td>{{ $reg->user->name }}</td>
                    <td>{{ $reg->competition->name }}</td>
                    <td><span class="badge {{ $reg->payment_status }}">{{ strtoupper($reg->payment_status) }}</span></td>
                    <td><a href="/admin/registrations/{{ $reg->id }}">Detail/Verifikasi</a></td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>

</html>