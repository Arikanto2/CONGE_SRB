<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    protected $table = 'conge_absence';
    protected $primaryKey = 'id';
    protected $fillable = [
        'Ref',
        'IM',
        'CATEGORIE',
        'TYPE',
        'MOTIF',
        'DATEDEBUT',
        'DATEFIN',
        'VALIDDIV',
        'VALIDCHEF',
        'LIEU',
        'INTERIM',
        'ABSENCE',
    ];
}
