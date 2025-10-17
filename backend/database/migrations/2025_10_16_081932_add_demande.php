<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conge_absence', function (Blueprint $table) {
            $table->id();
            $table->integer('Ref')->unique();
            $table->integer('IM');
            $table->string('CATEGORIE', 128)->nullable();
            $table->string('TYPE', 128)->nullable();
            $table->string('MOTIF', 128)->nullable();
            $table->date('DATEDEBUT')->nullable();
            $table->date('DATEFIN')->nullable();
            $table->string('VALIDDIV', 15)->nullable();
            $table->string('VALIDCHEF', 15)->nullable();
            $table->string('LIEU', 128)->nullable();
            $table->string('INTERIM', 128)->nullable();
            $table->string('ABSENCE', 60)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conge_absence');
    }
};
