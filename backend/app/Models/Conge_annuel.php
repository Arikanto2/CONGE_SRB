<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conge_annuel extends Model
{
    protected $table = 'conge_annuel';
    protected $primaryKey = 'id';
    protected $fillable = [
        'IDCONGE',
        'IM',
        'NBR_CONGE',
        'ANNEE',
    ];
}
