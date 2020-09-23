<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTapTimersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tap_timers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('tap_id');
            $table->boolean('wirkzeit_status');
            $table->boolean('spulzeit_status');
            $table->string('wirkzeit_pending_timer')->nullable();
            $table->string('spulzeit_pending_timer')->nullable();
            $table->timestamp('wirkzeit_timer_started')->nullable();
            $table->date('wirkzeit_timer_started_date')->nullable();
            $table->time('wirkzeit_timer_started_time')->nullable();
            $table->timestamp('spulzeit_timer_started')->nullable();
            $table->date('spulzeit_timer_started_date')->nullable();
            $table->time('spulzeit_timer_started_time')->nullable();
            $table->bigInteger('wirkzeit_timer_started_user_id')->nullable();
            $table->bigInteger('spulzeit_timer_started_user_id')->nullable();
            $table->bigInteger('project_setting_id');
            $table->boolean('completed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tap_rounds');
    }
}
