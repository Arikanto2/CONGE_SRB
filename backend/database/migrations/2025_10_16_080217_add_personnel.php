<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personnel', function (Blueprint $table) {
            $table->id();
            $table->integer('IM')->unique();
            $table->integer('IM_Chef')->nullable();
            $table->char('NOM', 32)->nullable();
            $table->string('PRENOMS', 128)->nullable();
            $table->string('EMAIL', 128)->unique()->nullable();
            $table->string('CORPS', 128)->nullable();
            $table->string('GRADE', 128)->nullable();
            $table->char('FONCTION', 32)->nullable();
            $table->string('TEL', 128)->nullable();
            $table->string('DIVISION', 128)->nullable();
            $table->string('PDP', 128)->nullable();
            $table->string('MDP', 60)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personnel');
    }
};
