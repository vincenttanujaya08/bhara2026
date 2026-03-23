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
        $this->call([
            CategorySeeder::class,
        ]);

        $this->call([
            CompetitionSeeder::class,
        ]);

        User::factory()->create([
            'name'     => 'Admin Bharatika',
            'email'    => 'admin@bharatika.com',
            'password' => bcrypt('admin123'),
            'role'     => 'admin',
            'instansi' => 'Panitia Bharatika 2026',
            'whatsapp' => '081234567890',
            'line_id'  => 'admin.bharatika',
        ]);
    }
}
