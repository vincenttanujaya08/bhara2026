<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::create(['name' => 'BUANA', 'code' => 'BN']);
        Category::create(['name' => 'TIRTA', 'code' => 'TR']);
        Category::create(['name' => 'BAYU', 'code' => 'BY']);
        Category::create(['name' => 'AGNI', 'code' => 'AG']);
    }
}
