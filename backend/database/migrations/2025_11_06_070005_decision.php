<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        
        Schema::create('decision', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_conge_absence')->nullable();
            $table->smallInteger('congeDebite')->nullable();
            $table->smallInteger('an')->nullable();
            $table->integer('soldeApres')->nullable();
            $table->timestamps();

            $table->foreign('id_conge_absence')
                ->references('id')
                ->on('conge_absence')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('decision');
    }
};
