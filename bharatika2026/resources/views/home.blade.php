<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bharatika 2026</title>

    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #111827, #374151);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            padding: 20px 50px;
            align-items: center;
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #ffffff;
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .nav-links a {
            text-decoration: none;
            color: #e5e7eb;
            font-weight: 500;
            transition: color 0.2s;
        }

        .nav-links a:hover {
            color: #60a5fa;
        }

        .nav-links form {
            display: inline;
            margin: 0;
        }

        .btn-logout {
            background: rgba(220, 38, 38, 0.1);
            border: 1px solid #ef4444;
            color: #fca5a5;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
        }

        .btn-logout:hover {
            background: #ef4444;
            color: white;
        }

        .user-greeting {
            color: #93c5fd;
            font-weight: 600;
            padding-right: 15px;
            border-right: 1px solid #4b5563;
        }

        .hero {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0 20px;
        }

        .hero h1 {
            font-size: 72px;
            margin: 0;
            background: linear-gradient(to right, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            margin-top: 15px;
            font-size: 20px;
            color: #d1d5db;
            max-width: 600px;
            line-height: 1.6;
        }

        .buttons {
            margin-top: 40px;
            display: flex;
            gap: 15px;
        }

        .btn-main {
            padding: 14px 28px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: background 0.2s;
        }

        .btn-main:hover {
            background: #2563eb;
        }

        .btn-secondary {
            padding: 14px 28px;
            background: transparent;
            border: 2px solid #6b7280;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.2s;
        }

        .btn-secondary:hover {
            border-color: #9ca3af;
            background: rgba(255, 255, 255, 0.1);
        }
    </style>
</head>

<body>

    <div class="navbar">
        <a href="/" class="logo">BHARATIKA 2026</a>

        <div class="nav-links">
            @auth
            <a href="/competitions">Daftar Lomba</a>
            <a href="/history">Riwayat Pendaftaran</a>

            <span class="user-greeting">Halo, {{ auth()->user()->name }}</span>

            <form method="POST" action="/logout">
                @csrf
                <button type="submit" class="btn-logout">Logout</button>
            </form>
            @else
            <a href="/login">Login</a>
            <a href="/register">Sign Up</a>
            @endauth
        </div>
    </div>

    <div class="hero">
        <h1>Creative Festival</h1>
        <p>Wujudkan ide kreatifmu dan bersainglah dengan talenta terbaik di seluruh Indonesia. Daftar sekarang dan jadilah bagian dari sejarah Bharatika 2026!</p>

        <div class="buttons">
            @auth
            <a href="/competitions" class="btn-main">Jelajahi Lomba</a>
            <a href="/history" class="btn-secondary">Lihat Riwayat Saya</a>
            @else
            <a href="/register" class="btn-main">Daftar Sekarang</a>
            <a href="/login" class="btn-secondary">Masuk ke Akun</a>
            @endauth
        </div>
    </div>

</body>

</html>