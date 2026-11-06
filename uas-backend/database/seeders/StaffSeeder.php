<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Staff;
use App\Models\Department;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $departments = Department::pluck('id')->toArray();
        $staffUsers = User::where('role', 'staff')->get();

        foreach ($staffUsers as $user) {
            Staff::create([
                'user_id' => $user->id,
                'department_id' => $departments[array_rand($departments)],
                'base_salary' => rand(12000, 25000),
            ]);
        }
    }
}
