<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Administration', 'code' => 'ADM'],
            ['name' => 'Finance', 'code' => 'FIN'],
            ['name' => 'Information Technology', 'code' => 'IT'],
            ['name' => 'Human Resources', 'code' => 'HR'],
            ['name' => 'Facilities Management', 'code' => 'FAC'],
        ];

        foreach ($departments as $d) {
            Department::create($d);
        }
    }
}
