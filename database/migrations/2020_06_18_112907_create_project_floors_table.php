<?php

use App\Enums\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectFloorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_floors', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger("project_id");
            $table->string("floor_name");
            $table->enum("status", [Status::PENDING, Status::INPROGRESS, Status::FINISHED]);
            $table->softDeletes();
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
        Schema::dropIfExists('project_floors');
    }
}
