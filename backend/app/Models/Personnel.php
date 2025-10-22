<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;
    protected $fillable = [

        'IM',
        'IM_Chef',
        'NOM',
        'PRENOMS',
        'EMAIL',
        'CORPS',
        'GRADE',
        'FONCTION',
        'TEL',
        'DIVISION',
        'PDP',
        'MDP',
    ];

    protected $hidden = [
        'MDP',
    ];
    protected function hashes(): array
    {
        return [
            'MDP' => 'hashed',
        ];
    }

    public $timestamps = true;

    // Relations auto-référentielles
    public function chef()
    {
        return $this->belongsTo(Personnel::class, 'IM_Chef', 'IM');
    }

    public function subordonnes()
    {
        return $this->hasMany(Personnel::class, 'IM_Chef', 'IM');
    }

    // Relations avec congés
    /*public function congesAbsence()
    {
        return $this->hasMany(CongeAbsence::class, 'IM', 'IM');
    }

    public function congesAnnuels()
    {
        return $this->hasMany(CongeAnnuel::class, 'IM', 'IM');
    }*/
}
