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
        Schema::create('demande', function (Blueprint $table) {
            $table->id();
            $table->integer('Ref');
            $table->integer('IM')->foreign()->references('IM')->on('personnel')->onDelete('cascade');
            $table->string('Categorie');
            $table->string('Type');
            $table->string('Motif');
            $table->date('DateDebut');
            $table->date('DateFin');
            $table->string('Lieu');
            $table->string('ValidDiv');
            $table->string('ValidChef');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demande');
    }
};
