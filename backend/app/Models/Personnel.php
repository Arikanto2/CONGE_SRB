<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Personnel extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'personnel';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'IM',
        'IM_Chef',
        'NOM',
        'PRENOM',
        'EMAIL',
        'CORPS',
        'GRADE',
        'FONCTION',
        'CONTACT',
        'DIVISION',
        'PHOTO_PROFIL',
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

    public function chef()
    {
        return $this->belongsTo(Personnel::class, 'IM_Chef', 'IM');
    }

    public function subordonnes()
    {
        return $this->hasMany(Personnel::class, 'IM_Chef', 'IM');
    }
    public function congesAnnuels()
    {
        return $this->hasMany(Conge_annuels::class, 'IM', 'IM');
    }
    public function demandes()
    {
        return $this->hasMany(Demande::class, 'IM', 'IM');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey(); 
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function getAuthPassword()
    {
        return $this->MDP;
    }

    public function getAuthIdentifierName()
    {
        return 'id'; // Utilise 'id' au lieu de 'IM' pour l'authentification
    }

    public function getAuthIdentifier()
    {
        return $this->getKey(); // Utilise l'ID au lieu de l'IM
    }

    /**
     * Retourne les données du personnel pour l'API (sans données sensibles)
     */
    public function toApiArray()
    {
        return [
            'id' => $this->id,
            'IM' => $this->IM,
            'IM_Chef' => $this->IM_Chef,
            'NOM' => $this->NOM,
            'PRENOM' => $this->PRENOM,
            'EMAIL' => $this->EMAIL,
            'CORPS' => $this->CORPS,
            'GRADE' => $this->GRADE,
            'FONCTION' => $this->FONCTION,
            'CONTACT' => $this->CONTACT,
            'DIVISION' => $this->DIVISION,
            'PHOTO_PROFIL' => $this->PHOTO_PROFIL,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
