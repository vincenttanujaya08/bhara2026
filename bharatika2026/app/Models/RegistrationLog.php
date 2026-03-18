<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationLog extends Model
{
    protected $fillable = [
        'registration_id',
        'status',
        'notes'
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
}
