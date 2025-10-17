<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personnel', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->integer('IM')->unique();
            $table->string('Nom');
            $table->string('Prenoms');
            $table->string('email')->unique();
            $table->string('Corps');
            $table->string('Grade');
            $table->string('Fonction');
            $table->string('Tel');
            $table->string('Division');
            $table->binary('PDP')->nullable();
            $table->string('password');
            $table->timestamps();
            $table->integer('IMChef')->foreign()->references('IM')->on('personnel')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel');
    }
};
