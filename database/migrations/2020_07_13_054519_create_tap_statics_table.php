<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTapStaticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tap_statics', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('taps_id');
            $table->string('project_setting_id');
            $table->string('date_time')->nullable();
            $table->string('user_id');
            $table->boolean('detected');
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
        Schema::dropIfExists('tap_statics');
    }
}
