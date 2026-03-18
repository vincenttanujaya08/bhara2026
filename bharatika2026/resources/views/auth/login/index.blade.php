<!DOCTYPE html>
<html>

<head>
    <title>Login</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
        }

        .container {
            width: 400px;
            margin: 40px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        h2 {
            margin-bottom: 20px;
        }

        input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
        }

        button {
            width: 100%;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }

        button:hover {
            background: #0056b3;
        }

        .error {
            color: red;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .footer {
            margin-top: 15px;
            font-size: 14px;
            text-align: center;
        }

        .footer a {
            color: #007bff;
            text-decoration: none;
        }

        .back {
            text-align: center;
            margin-top: 20px;
        }

        .back a {
            text-decoration: none;
            color: #007bff;
        }
    </style>
</head>

<body>

    <!-- BACK TO HOME -->
    <div class="back">
        <a href="/">← Back to Home</a>
    </div>

    <div class="container">

        <h2>Welcome Back 👋</h2>

        @if ($errors->any())
        <div class="error">
            <ul>
                @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        <form method="POST" action="/login">
            @csrf

            <input name="email" placeholder="Email" value="{{ old('email') }}">
            <input type="password" name="password" placeholder="Password">

            <button type="submit">Login</button>
        </form>

        <div class="footer">
            Belum punya akun?
            <a href="/register">Sign Up</a>
        </div>

    </div>

</body>

</html>