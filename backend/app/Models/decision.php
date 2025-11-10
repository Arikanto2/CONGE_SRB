<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class decision extends Model
{
    protected $table = 'decision';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;
    protected $fillable = [
        'id_conge_absence',
        'congeDebite',
        'an',
    ];  
    public function congeAbsence()
    {
        return $this->belongsTo(Demande::class, 'id_conge_absence', 'id');
    }
}
