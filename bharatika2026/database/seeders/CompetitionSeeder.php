<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Competition;
use App\Models\Category;

class CompetitionSeeder extends Seeder
{
    public function run(): void
    {
        $buana = Category::where('name', 'BUANA')->first();
        $tirta = Category::where('name', 'TIRTA')->first();
        $bayu  = Category::where('name', 'BAYU')->first();
        $agni  = Category::where('name', 'AGNI')->first();

        if (!$buana || !$tirta || !$bayu || !$agni) {
            $this->command->error('Kategori tidak ditemukan! Pastikan CategorySeeder sudah dijalankan.');
            return;
        }

        $data = [
            // TIRTA
            ['category_id' => $tirta->id, 'code' => '101', 'name' => 'Digital Campaign', 'min_participants' => 3, 'max_participants' => 3],
            ['category_id' => $tirta->id, 'code' => '102', 'name' => 'Character Design', 'min_participants' => 1, 'max_participants' => 2],
            ['category_id' => $tirta->id, 'code' => '103', 'name' => 'Nail Art Design', 'min_participants' => 1, 'max_participants' => 1],

            // AGNI
            ['category_id' => $agni->id, 'code' => '201', 'name' => 'Public Seating Design', 'min_participants' => 1, 'max_participants' => 1],
            ['category_id' => $agni->id, 'code' => '202', 'name' => 'Children Room Design', 'min_participants' => 1, 'max_participants' => 2],


            // BAYU
            ['category_id' => $bayu->id, 'code' => '301', 'name' => 'Film Making', 'min_participants' => 3, 'max_participants' => 3],

            // BUANA
            ['category_id' => $buana->id, 'code' => '401', 'name' => 'Comic Strip', 'min_participants' => 1, 'max_participants' => 2],
            ['category_id' => $buana->id, 'code' => '402', 'name' => 'Game Character Design', 'min_participants' => 1, 'max_participants' => 1],
            ['category_id' => $buana->id, 'code' => '403', 'name' => 'Fashion Illustration', 'min_participants' => 1, 'max_participants' => 1],
            ['category_id' => $buana->id, 'code' => '404', 'name' => 'Content Creating', 'min_participants' => 2, 'max_participants' => 2],
            ['category_id' => $buana->id, 'code' => '405', 'name' => 'Private Space Design', 'min_participants' => 1, 'max_participants' => 2],
            ['category_id' => $buana->id, 'code' => '406', 'name' => 'English Public Speaking', 'min_participants' => 3, 'max_participants' => 3],
            ['category_id' => $buana->id, 'code' => '407', 'name' => 'Chinese Tourism Pamphlet Design', 'min_participants' => 1, 'max_participants' => 2],
        ];

        foreach ($data as $item) {
            Competition::updateOrCreate(
                ['code' => $item['code']],
                $item
            );
        }
    }
}
