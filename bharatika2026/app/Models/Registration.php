<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
        'user_id',
        'competition_id',
        'payment_proof',
        'payment_status',
        'participant_code',
        'submission_title',
        'submission_description',
        'submission_file'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function competition()
    {
        return $this->belongsTo(Competition::class);
    }

    public function members()
    {
        return $this->hasMany(TeamMember::class);
    }
    public function logs()
    {
        return $this->hasMany(RegistrationLog::class)->orderBy('created_at', 'desc');
    }
}
