<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conge_annuels extends Model
{
    protected $table = 'conge_annuels';
    protected $primaryKey = 'id';
    protected $fillable = [
        'IM',
        'NBR_CONGE',
        'NBR_Auto',
        'ANNEE'
    ];
    public $timestamps = true;
    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'IM', 'IM');
    }
    
}
