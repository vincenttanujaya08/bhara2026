<!DOCTYPE html>
<html>

<head>
    <title>Register</title>

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

        .steps {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .step {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #ddd;
            text-align: center;
            line-height: 30px;
        }

        .step.active {
            background: #007bff;
            color: white;
        }

        input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
        }

        button {
            padding: 10px 15px;
        }

        .actions {
            display: flex;
            justify-content: space-between;
        }

        .error {
            color: red;
            font-size: 14px;
        }

        .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 14px;
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

        <h2>Create an Account</h2>

        <!-- STEP INDICATOR -->
        <div class="steps">
            <div class="step active" id="indicator-1">1</div>
            <div class="step" id="indicator-2">2</div>
            <div class="step" id="indicator-3">3</div>
        </div>

        @if ($errors->any())
        <div class="error">
            <ul>
                @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        <form method="POST" action="/register">
            @csrf

            <!-- STEP 1 -->
            <div id="step-1">
                <input name="name" placeholder="Nama Lengkap" value="{{ old('name') }}">
                <input name="email" placeholder="Email" value="{{ old('email') }}">
                <input name="instansi" placeholder="Asal Instansi" value="{{ old('instansi') }}">

                <div class="actions">
                    <span></span>
                    <button type="button" onclick="nextStep(2)">Next →</button>
                </div>
            </div>

            <!-- STEP 2 -->
            <div id="step-2" style="display:none;">
                <input name="whatsapp" placeholder="Nomor Telepon" value="{{ old('whatsapp') }}">
                <input name="line_id" placeholder="ID Line" value="{{ old('line_id') }}">

                <div class="actions">
                    <button type="button" onclick="nextStep(1)">← Back</button>
                    <button type="button" onclick="nextStep(3)">Next →</button>
                </div>
            </div>

            <!-- STEP 3 -->
            <div id="step-3" style="display:none;">
                <input type="password" name="password" placeholder="Password">
                <input type="password" name="password_confirmation" placeholder="Confirm Password">

                <div class="actions">
                    <button type="button" onclick="nextStep(2)">← Back</button>
                    <button type="submit">Create Account</button>
                </div>
            </div>

        </form>

        <!-- SWITCH KE LOGIN -->
        <div class="footer">
            Sudah punya akun?
            <a href="/login">Login</a>
        </div>

    </div>

    <script>
        function nextStep(step) {
            document.querySelectorAll('[id^="step-"]').forEach(el => {
                el.style.display = 'none';
            });

            document.getElementById('step-' + step).style.display = 'block';

            document.querySelectorAll('.step').forEach(el => {
                el.classList.remove('active');
            });

            document.getElementById('indicator-' + step).classList.add('active');
        }
    </script>

</body>

</html>