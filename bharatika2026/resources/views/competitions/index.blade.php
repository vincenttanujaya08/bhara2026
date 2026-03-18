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

        .category {
            margin-bottom: 40px;
        }

        .category-title {
            color: #374151;
            font-size: 1.5rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }

        .category-title::before {
            content: "";
            display: inline-block;
            width: 4px;
            height: 24px;
            background-color: #3b82f6;
            margin-right: 10px;
            border-radius: 2px;
        }

        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
        }

        .card {
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
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

        .comp-meta {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .comp-meta svg {
            width: 18px;
            height: 18px;
            margin-right: 6px;
            fill: currentColor;
        }

        .btn {
            display: block;
            text-align: center;
            padding: 10px 16px;
            background-color: #111827;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.95rem;
            transition: background-color 0.2s;
        }

        .btn:hover {
            background-color: #374151;
        }
    </style>
</head>

<body>

    <div class="container">

        <a href="/" class="back">← Kembali ke Beranda</a>

        <h1 class="page-title">Daftar Kompetisi</h1>

        @foreach ($categories as $category)
        <div class="category">
            <h2 class="category-title">{{ $category->name }}</h2>

            <div class="grid-container">
                @foreach ($category->competitions as $comp)
                <div class="card">
                    <div>
                        <div class="comp-name">{{ $comp->name }}</div>
                        <div class="comp-meta">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            @if ($comp->min_participants == $comp->max_participants)
                            Peserta: {{ $comp->min_participants }} orang
                            @else
                            Peserta: {{ $comp->min_participants }} - {{ $comp->max_participants }} orang
                            @endif
                        </div>
                    </div>

                    <a href="/competitions/{{ $comp->id }}/register" class="btn">Daftar Sekarang</a>
                </div>
                @endforeach
            </div>
        </div>
        @endforeach

    </div>

</body>

</html>