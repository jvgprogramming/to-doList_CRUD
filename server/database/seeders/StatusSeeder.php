<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['status' => 'Pending'],
            ['status' => 'In Progress'],
            ['status' => 'Completed'],
        ];

        foreach ($statuses as $status) {
            Status::create($status);
        }
    }
}
