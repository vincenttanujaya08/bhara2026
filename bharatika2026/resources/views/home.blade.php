<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Bharatika 2026</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=FamiljenGrotesk:wght@400;700&display=swap">

    <style>
        @font-face {
            font-family: 'CSSalient';
            src: url('/fonts/CSSalient-Regular.ttf') format('truetype');
        }

        @font-face {
            font-family: 'Nord';
            src: url('/fonts/NORD-Bold.ttf') format('truetype');
        }
    </style>
</head>

<body style="margin:0;padding:0;">
    @inertia
</body>

</html>