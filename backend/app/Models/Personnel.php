<?php


namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
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

    // Relations auto-référentielles
    public function chef()
    {
        return $this->belongsTo(Personnel::class, 'IM_Chef', 'IM');
    }

    public function subordonnes()
    {
        return $this->hasMany(Personnel::class, 'IM_Chef', 'IM');
    }
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // Indique à Laravel quel champ utiliser pour le mot de passe
    public function getAuthPassword()
    {
        return $this->MDP;
    }

    // Définir le champ utilisé pour l'identifiant unique
    public function getAuthIdentifierName()
    {
        return 'IM';
    }

    public function getAuthIdentifier()
    {
        return $this->IM;
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
