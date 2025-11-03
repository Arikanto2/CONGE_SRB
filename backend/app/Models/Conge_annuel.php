<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conge_annuel extends Model
{
    protected $table = 'conge_annuels';
    protected $primaryKey = 'id';
    protected $fillable = [
        'IM',
        'NBR_CONGE',
        'ANNEE',
    ];
}
