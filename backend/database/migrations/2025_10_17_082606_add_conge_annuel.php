<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conge_annuels', function (Blueprint $table) {
            $table->id();
            $table->integer('IM');
            $table->smallInteger('NBR_CONGE')->nullable();
            $table->string('ANNEE', 128)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conge_annuels');
    }
};
