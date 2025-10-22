<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    protected $table = 'conge_absence';
    protected $primaryKey = 'id';
    protected $fillable = [
        'ref',
        'IM',
        'CATEGORIE',
        'TYPE',
        'MOTIF',
        'DATE_DEBUT',
        'DATE_FIN',
        'VALID_DIV',
        'VALID_CHEF',
        'LIEU',
        'INTERIM',
        'ABSENCE',
    ];
}
