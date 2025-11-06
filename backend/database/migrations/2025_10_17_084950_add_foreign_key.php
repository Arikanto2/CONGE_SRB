<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // FK sur personnel.IM_DIRIGER
        Schema::table('personnel', function (Blueprint $table) {
            $table->foreign('IM_Chef')
                  ->references('IM')
                  ->on('personnel')
                  ->onDelete('set null');
        });

        // FK sur conge_absence.IM
        Schema::table('conge_absence', function (Blueprint $table) {
            $table->foreign('IM')
                  ->references('IM')
                  ->on('personnel')
                  ->onDelete('cascade');
        });

        // FK sur conge_annuels.IM
        Schema::table('conge_annuels', function (Blueprint $table) {
            $table->foreign('IM')
                  ->references('IM')
                  ->on('personnel')
                  ->onDelete('cascade');
        });
        
    }

    public function down(): void
    {
        Schema::table('personnel', function (Blueprint $table) {
            $table->dropForeign(['IM_DIRIGER']);
        });

        Schema::table('conge_absence', function (Blueprint $table) {
            $table->dropForeign(['IM']);
        });

        Schema::table('conge_annuels', function (Blueprint $table) {
            $table->dropForeign(['IM']);
        });
    }
};
