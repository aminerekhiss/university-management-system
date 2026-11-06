<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->year('fiscal_year');
            $table->decimal('allocated_amount', 12, 2);
            $table->decimal('spent_amount', 12, 2)->default(0);
            $table->string('status')->default('open');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
