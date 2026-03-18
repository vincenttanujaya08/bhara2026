<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Bharatika 2026</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #f4f7f6;
            margin: 0;
            display: flex;
        }

        .sidebar {
            width: 250px;
            background: #1e293b;
            color: white;
            min-height: 100vh;
            padding: 20px;
        }

        .main-content {
            flex: 1;
            padding: 40px;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .card h3 {
            margin: 0;
            color: #64748b;
            font-size: 0.9rem;
        }

        .card p {
            font-size: 2rem;
            font-weight: bold;
            margin: 10px 0;
            color: #1e293b;
        }

        .nav-link {
            display: block;
            color: #cbd5e1;
            text-decoration: none;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
        }

        .nav-link:hover {
            background: #334155;
        }
    </style>
</head>

<body>
    <div class="sidebar">
        <h2>Admin Panel</h2>
        <a href="/admin/dashboard" class="nav-link">Dashboard</a>
        <a href="/admin/registrations" class="nav-link">Pendaftaran</a>
        <form action="/logout" method="POST">
            @csrf
            <button type="submit" style="background:none; border:none; color:red; cursor:pointer; padding:10px;">Logout</button>
        </form>
    </div>
    <div class="main-content">
        <h1>Dashboard Overview</h1>
        <div class="card-grid">
            <div class="card">
                <h3>Total</h3>
                <p>{{ $stats['total'] }}</p>
            </div>
            <div class="card">
                <h3>Pending</h3>
                <p style="color: #d97706;">{{ $stats['pending'] }}</p>
            </div>
            <div class="card">
                <h3>Approved</h3>
                <p style="color: #059669;">{{ $stats['approved'] }}</p>
            </div>
            <div class="card">
                <h3>Rejected</h3>
                <p style="color: #dc2626;">{{ $stats['rejected'] }}</p>
            </div>
        </div>
    </div>
</body>

</html>