<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registrations', function (Blueprint $blueprint) {

            $blueprint->string('submission_title')->nullable()->after('payment_status');
            $blueprint->text('submission_description')->nullable()->after('submission_title');
            $blueprint->string('submission_file')->nullable()->after('submission_description');
        });
    }

    public function down(): void
    {
        Schema::table('registrations', function (Blueprint $blueprint) {
            $blueprint->dropColumn([

                'submission_title',
                'submission_description',
                'submission_file'
            ]);
        });
    }
};
