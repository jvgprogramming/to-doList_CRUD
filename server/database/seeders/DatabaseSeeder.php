<?php

namespace Database\Seeders;

use App\Models\Status;
use App\Models\Task;
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
        $this->call(StatusSeeder::class);

        // Get status IDs
        $pendingId = Status::where('status', 'Pending')->first()->status_id;
        $inProgressId = Status::where('status', 'In Progress')->first()->status_id;
        $completedId = Status::where('status', 'Completed')->first()->status_id;

        // Demo Account 1
        $john = User::create([
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        Task::create([
            'user_id' => $john->user_id,
            'title' => 'Finish React Assignment',
            'description' => 'Complete the React component library assignment for the frontend course.',
            'status_id' => $completedId,
        ]);

        Task::create([
            'user_id' => $john->user_id,
            'title' => 'Study for Midterm Exam',
            'description' => 'Review chapters 5-9 for the midterm exam next week.',
            'status_id' => $inProgressId,
        ]);

        Task::create([
            'user_id' => $john->user_id,
            'title' => 'Prepare Project Proposal',
            'description' => 'Draft the project proposal for the capstone project.',
            'status_id' => $pendingId,
        ]);

        // Demo Account 2
        $jane = User::create([
            'full_name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        Task::create([
            'user_id' => $jane->user_id,
            'title' => 'Buy Groceries',
            'description' => 'Milk, eggs, bread, vegetables, and fruits.',
            'status_id' => $pendingId,
        ]);

        Task::create([
            'user_id' => $jane->user_id,
            'title' => 'Submit Research Paper',
            'description' => 'Finalize and submit the AI research paper to the journal.',
            'status_id' => $inProgressId,
        ]);

        Task::create([
            'user_id' => $jane->user_id,
            'title' => 'Practice Next.js',
            'description' => 'Build a small project to practice Next.js 15 features.',
            'status_id' => $completedId,
        ]);
    }
}
