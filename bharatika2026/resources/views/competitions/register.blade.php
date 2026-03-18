<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Lomba</title>

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
            max-width: 650px;
            margin: 20px auto;
            background: #ffffff;
            padding: 35px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }

        .header-info {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        h2 {
            color: #111827;
            margin: 0 0 5px 0;
            font-size: 1.8rem;
        }

        .subtitle {
            color: #6b7280;
            font-size: 0.95rem;
            margin: 0;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
            color: #374151;
            font-size: 0.9rem;
        }

        input[type="text"],
        input[type="email"],
        input[type="file"] {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            background-color: #f9fafb;
        }

        input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
            background-color: #ffffff;
        }

        .section {
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border: 1px solid #e5e7eb;
        }

        .section h3 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 1.15rem;
            color: #1f2937;
        }

        .leader-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .leader-name {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
        }

        .leader-detail {
            display: flex;
            margin-bottom: 8px;
            font-size: 0.95rem;
            color: #475569;
        }

        .leader-detail:last-child {
            margin-bottom: 0;
        }

        .leader-detail span.label {
            font-weight: 600;
            width: 120px;
            flex-shrink: 0;
            color: #334155;
        }

        .member-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .member-box h4 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #374151;
            font-size: 1rem;
        }

        .btn {
            display: inline-block;
            font-weight: 600;
            text-align: center;
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
            font-size: 0.95rem;
        }

        .btn-primary {
            background-color: #111827;
            color: #ffffff;
            width: 100%;
            font-size: 1.1rem;
            padding: 14px;
            margin-top: 10px;
        }

        .btn-primary:hover {
            background-color: #374151;
        }

        .btn-add {
            background-color: #eff6ff;
            color: #2563eb;
            border: 1px dashed #93c5fd;
            width: 100%;
            padding: 12px;
        }

        .btn-add:hover {
            background-color: #dbeafe;
        }

        .btn-danger {
            background-color: #fee2e2;
            color: #dc2626;
            padding: 8px 14px;
            font-size: 0.85rem;
            margin-top: 5px;
        }

        .btn-danger:hover {
            background-color: #fecaca;
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

        .error-box {
            background-color: #fef2f2;
            border: 1px solid #f87171;
            color: #991b1b;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 25px;
        }

        .error-box div {
            margin-bottom: 5px;
        }

        .file-hint {
            display: block;
            font-size: 0.8rem;
            color: #6b7280;
            margin-top: 4px;
        }
    </style>
</head>

<body>

    <div class="container">

        <a href="/competitions" class="back">← Kembali ke Daftar Lomba</a>

        <div class="header-info">
            <h2>{{ $competition->name }}</h2>

            @php
            $min = $competition->min_participants;
            $max = $competition->max_participants;
            @endphp

            <p class="subtitle">
                Kapasitas Tim:
                @if($min == $max)
                <strong>{{ $min }} orang</strong>
                @else
                <strong>{{ $min }} - {{ $max }} orang</strong>
                @endif
            </p>
        </div>

        @if ($errors->any())
        <div class="error-box">
            @foreach ($errors->all() as $error)
            <div>• {{ $error }}</div>
            @endforeach
        </div>
        @endif

        <form method="POST" enctype="multipart/form-data">
            @csrf

            <div class="section">
                <h3>Ketua Tim (Anggota 1)</h3>

                <div class="leader-card">
                    <div class="leader-name">{{ auth()->user()->name }}</div>

                    <div class="leader-detail">
                        <span class="label">Email</span>
                        <span>: {{ auth()->user()->email }}</span>
                    </div>

                    <div class="leader-detail">
                        <span class="label">WhatsApp</span>
                        <span>: {{ auth()->user()->whatsapp }}</span>
                    </div>

                    <div class="leader-detail">
                        <span class="label">ID Line</span>
                        <span>: {{ auth()->user()->line_id }}</span>
                    </div>

                    <div class="leader-detail">
                        <span class="label">Instansi</span>
                        <span>: {{ auth()->user()->instansi }}</span>
                    </div>
                </div>

                <input type="hidden" name="leader_name" value="{{ auth()->user()->name }}">
                <input type="hidden" name="leader_email" value="{{ auth()->user()->email }}">
                <input type="hidden" name="leader_whatsapp" value="{{ auth()->user()->whatsapp }}">
                <input type="hidden" name="leader_line" value="{{ auth()->user()->line_id }}">
                <input type="hidden" name="leader_instansi" value="{{ auth()->user()->instansi }}">

                <div class="form-group">
                    <label>Upload KTM Ketua</label>
                    <input type="file" name="leader_ktm" accept="image/png, image/jpeg, image/jpg" required>
                    <span class="file-hint">Format yang diizinkan: JPG, JPEG, PNG (Maks 2MB).</span>
                </div>
            </div>

            @if($max > 1)
            <div class="section">
                <h3>Anggota Tambahan</h3>
                <div id="members-container"></div>
                <button type="button" class="btn btn-add" onclick="addMember()">+ Tambah Anggota</button>
            </div>
            @endif

            <div class="section">
                <h3>Administrasi</h3>
                <div class="form-group">
                    <label>Bukti Pembayaran</label>
                    <input type="file" name="payment" accept="image/png, image/jpeg, image/jpg" required>
                    <span class="file-hint">Format yang diizinkan: JPG, JPEG, PNG (Maks 2MB).</span>
                </div>
            </div>

            <button type="submit" class="btn btn-primary">Konfirmasi & Daftar Lomba</button>

        </form>

    </div>

    <script>
        let maxMembers = parseInt("{{ $max }}") - 1;
        let minMembers = parseInt("{{ $min }}") - 1;
        let currentMembersCount = 0;
        let memberIndex = 0;

        function addMember() {
            if (currentMembersCount >= maxMembers) {
                alert("Maksimal anggota tim telah tercapai.");
                return;
            }

            const container = document.getElementById('members-container');
            if (!container) return;

            currentMembersCount++;
            memberIndex++;

            const div = document.createElement('div');

            div.classList.add('member-box');
            div.id = 'member-' + memberIndex;

            div.innerHTML = `
                <h4>Anggota Tambahan</h4>
                
                <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" name="members[${memberIndex}][name]" placeholder="Masukkan nama anggota" required>
                </div>

                <div class="form-group">
                    <label>Upload KTM</label>
                    <input type="file" name="members[${memberIndex}][ktm]" accept="image/png, image/jpeg, image/jpg" required>
                    <span class="file-hint">Format yang diizinkan: JPG, JPEG, PNG (Maks 2MB).</span>
                </div>

                <button type="button" class="btn btn-danger" onclick="removeMember(${memberIndex})">Hapus Anggota</button>
            `;

            container.appendChild(div);
            updateRemoveButtons();
        }

        function removeMember(id) {
            if (currentMembersCount <= minMembers) {
                alert("Tidak dapat menghapus, minimal anggota harus terpenuhi.");
                return;
            }

            const el = document.getElementById('member-' + id);
            if (el) {
                el.remove();
                currentMembersCount--;
                updateRemoveButtons();
            }
        }

        function updateRemoveButtons() {
            const removeBtns = document.querySelectorAll('.member-box .btn-danger');
            if (currentMembersCount <= minMembers) {
                removeBtns.forEach(btn => btn.style.display = 'none');
            } else {
                removeBtns.forEach(btn => btn.style.display = 'inline-block');
            }
        }

        window.onload = function() {
            for (let i = 0; i < minMembers; i++) {
                addMember();
            }
        };
    </script>

</body>

</html>