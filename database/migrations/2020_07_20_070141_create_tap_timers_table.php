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
            $table->string('tap_id');
            $table->boolean('wirkzeit_status');
            $table->boolean('spulzeit_status');
            $table->string('project_setting_id');
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
