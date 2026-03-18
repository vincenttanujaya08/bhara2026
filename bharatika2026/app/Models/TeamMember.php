<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'registration_id',
        'name',
        'ktm_file'
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
}
