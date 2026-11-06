<?php

namespace Database\Seeders;

use App\Models\TuitionInvoice;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TuitionInvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::all();

        foreach ($students as $s) {
            TuitionInvoice::create([
                'student_id' => $s->id,
                'name' => 'Tuition Fee',
                'amount' => 10000,
                'due_date' => Carbon::now()->addDays(10),
                'status' => 'pending',
            ]);

            TuitionInvoice::create([
                'student_id' => $s->id,
                'name' => 'Library Fee',
                'amount' => 750,
                'due_date' => Carbon::now()->addDays(5),
                'status' => 'pending',
            ]);

            TuitionInvoice::create([
                'student_id' => $s->id,
                'name' => 'Exam Fee',
                'amount' => 900,
                'due_date' => Carbon::now()->subDays(1), // overdue
                'status' => 'overdue',
            ]);
        }
    }
}
