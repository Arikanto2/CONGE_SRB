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
        Schema::table('personnel', function (Blueprint $table) {
            // Renommer les colonnes pour correspondre au modèle
            $table->renameColumn('PRENOMS', 'PRENOM');
            $table->renameColumn('TEL', 'CONTACT');
            $table->renameColumn('PDP', 'PHOTO_PROFIL');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personnel', function (Blueprint $table) {
            // Remettre les anciens noms
            $table->renameColumn('PRENOM', 'PRENOMS');
            $table->renameColumn('CONTACT', 'TEL');
            $table->renameColumn('PHOTO_PROFIL', 'PDP');
        });
    }
};
