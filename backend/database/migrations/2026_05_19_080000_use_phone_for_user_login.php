<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['email']);
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->string('email')->nullable()->change();
        });

        $usersWithoutPhone = DB::table('users')
            ->where(function ($query): void {
                $query->whereNull('phone')->orWhere('phone', '');
            })
            ->orderBy('id')
            ->get(['id']);

        foreach ($usersWithoutPhone as $user) {
            DB::table('users')
                ->where('id', $user->id)
                ->update(['phone' => 'legacy-'.$user->id]);
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone')->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['phone']);
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone')->nullable()->change();
            $table->string('email')->nullable(false)->unique()->change();
        });
    }
};
