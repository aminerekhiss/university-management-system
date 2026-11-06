<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['Income', 'Expense']);
            $table->string('description'); // Title in frontend
            $table->decimal('amount', 12, 2);
            $table->date('transaction_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_transactions');
    }
};
