<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = [
            // Wakil Ketua Bidang Acara
            ['name' => 'Staurisa Evangelista', 'email' => 'h14240041@john.petra.ac.id'],

            // Sekretaris
            ['name' => 'Lindsay Theone Imago', 'email' => 'h14240051@john.petra.ac.id'],

            // Ketua
            ['name' => 'Marcelino Thionardo', 'email' => 'h14240119@john.petra.ac.id'],

            // Bendahara
            ['name' => 'Princesia Angel Wijaya', 'email' => 'h11230006@john.petra.ac.id'],
            ['name' => 'Elaine Gracia Nitisastro', 'email' => 'd11230063@john.petra.ac.id'],

            // KWK & Anggota Divisi Lomba
            ['name' => 'Angelica Feliciona Theritno', 'email' => 'h11240006@john.petra.ac.id'],
            ['name' => 'Elizabeth Nadia Dewi', 'email' => 'h14240112@john.petra.ac.id'],
            ['name' => 'Gabriella Maria Gosyanto', 'email' => 'h14240186@john.petra.ac.id'],
            ['name' => 'Olivia Agatha', 'email' => 'h14250052@john.petra.ac.id'],
            ['name' => 'Veronica Alexandra Wang', 'email' => 'h14250006@john.petra.ac.id'],
            ['name' => 'Shienny Veyran Ongko', 'email' => 'h14250074@john.petra.ac.id'],
            ['name' => 'Tirte Aurellia Ketricia', 'email' => 'h14250036@john.petra.ac.id'],

            // KWK Divisi Sekkonkes
            ['name' => 'Ilona Arleen Mochtar', 'email' => 'h14240124@john.petra.ac.id'],
            ['name' => 'Airin Vylia Lauwinata', 'email' => 'h14240008@john.petra.ac.id'],

            // IT
            ['name' => 'Vincentius Tanujaya', 'email' => 'admin1@g.com'],
            ['name' => 'Bryan Chandra', 'email' => 'admin2@g.com'],
        ];

        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name'     => $admin['name'],
                    'password' => Hash::make('password'), // Password default untuk semua admin
                    'role'     => 'admin', // Mengatur semua user sebagai admin
                    'instansi' => 'Panitia Bharatika 2026',
                    'whatsapp' => '081234567890',
                    'line_id'  => 'admin.bharatika',
                ]
            );
        }
    }
}
