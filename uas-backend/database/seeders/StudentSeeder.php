<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            'Computer Science',
            'Business Administration',
            'Art & Design'
        ];

        $levels = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];

        $studentUsers = User::where('role', 'student')->get();

        foreach ($studentUsers as $index => $user) {
            Student::create([
                'user_id' => $user->id,
                'student_code' => 'STU2025-00' . ($index + 1),
                'program' => $programs[array_rand($programs)],
                'level' => $levels[array_rand($levels)],
            ]);
        }
    }
}
