<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Bharatika 2026</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    @viteReactRefresh
    @routes
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>

<body style="margin:0;padding:0;">
    @inertia
</body>



</html>