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
    public $timestamps = true;
    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'IM', 'IM');
    }
    public function decision()
    {
        return $this->hasMany(decision::class, 'id_conge_absence', 'id');
    }
}
