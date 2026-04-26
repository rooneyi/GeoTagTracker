<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AdminSeeder::class);

        User::factory()->create([
            'name' => 'Tech User',
            'email' => 'technician@example.com',
            'role' => 'technician',
            'is_active' => true,
        ]);
    }
}
