<?php

use App\Enums\ProjectSettingStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ProjectSettingField;

class CreateProjectSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('project_id');
            $table->enum('field_name', array_values(ProjectSettingField::FIELDS));
            $table->string('field_wirkzeit');
            $table->string('field_spulzeit');
            $table->enum('aktiv', [ProjectSettingStatus::ACTIVE, ProjectSettingStatus::INACTIVE]);
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
        Schema::dropIfExists('project_settings');
    }
}
