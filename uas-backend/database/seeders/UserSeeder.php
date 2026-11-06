<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ---- STUDENTS ----
        $students = [
            ['fullname' => 'Sarah Ahmed',    'username' => 'sarah.ahmed',    'email' => 'sarah.ahmed@uas.com'],
            ['fullname' => 'Omar Khaled',    'username' => 'omar.khaled',    'email' => 'omar.khaled@uas.com'],
            ['fullname' => 'Laila Hassan',   'username' => 'laila.hassan',   'email' => 'laila.hassan@uas.com'],
            ['fullname' => 'Youssef Samir',  'username' => 'youssef.samir',  'email' => 'youssef.samir@uas.com'],
            ['fullname' => 'Mariam Adel',    'username' => 'mariam.adel',    'email' => 'mariam.adel@uas.com'],
            ['fullname' => 'Karim Tarek',    'username' => 'karim.tarek',    'email' => 'karim.tarek@uas.com'],
        ];

        foreach ($students as $s) {
            User::create([
                'fullname' => $s['fullname'],
                'username' => $s['username'],
                'email'    => $s['email'],
                'password' => bcrypt('password123'),
                'role'     => 'student',
                'university_id' => strtoupper('UAS-' . rand(10000, 99999)),
            ]);
        }

        // ---- STAFF ----
        $staff = [
            ['fullname' => 'Dr. Hassan Ali',     'username' => 'hassan.ali',     'email' => 'hassan.ali@uas.com'],
            ['fullname' => 'Eng. Salma Fathy',   'username' => 'salma.fathy',    'email' => 'salma.fathy@uas.com'],
            ['fullname' => 'Mr. Ahmed Youssef',  'username' => 'ahmed.youssef',  'email' => 'ahmed.youssef@uas.com'],
        ];

        foreach ($staff as $st) {
            User::create([
                'fullname' => $st['fullname'],
                'username' => $st['username'],
                'email'    => $st['email'],
                'password' => bcrypt('password123'),
                'role'     => 'staff',
                'staff_id' => strtoupper('STF-' . rand(100, 999)),
            ]);
        }

        User::create([
            'fullname' => 'System Administrator',
            'username' => 'admin',
            'email' => 'admin@uas.com',
            'role' => 'admin',
            'password' => bcrypt('admin123'), 
        ]);

    }
}
