<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Memanggil seeder pendukung secara berurutan
        $this->call([
            CategorySeeder::class,    // Harus pertama karena Competition butuh category_id
            CompetitionSeeder::class, // Mengisi data lomba
            AdminSeeder::class,       // Mengisi daftar admin yang baru Anda buat
        ]);

        // Opsional: Tetap mempertahankan satu super admin utama jika diperlukan
        User::updateOrCreate(
            ['email' => 'admin@bharatika.com'],
            [
                'name'     => 'Admin Bharatika',
                'password' => bcrypt('admin123'),
                'role'     => 'admin',
                'instansi' => 'Panitia Bharatika 2026',
                'whatsapp' => '081234567890',
                'line_id'  => 'admin.bharatika',
            ]
        );
    }
}
