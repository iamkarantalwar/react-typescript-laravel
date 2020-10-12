<?php

namespace App\Http\Controllers\ApiController;

use App\Http\Requests\Api\SectionRequest;
use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $sections = Section::where('project_floor_id', $request->post('floor_id'))->get();
        return response()->json($sections, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SectionRequest $request)
    {
        try {
            //code...
            $sections = [];

            for($i=$request->post('from'); $i<=$request->post('to'); $i++)
            {
                $section = Section::create([
                    'project_floor_id' => $request->post('floor_id'),
                    'section_name' => $request->post('section_name').($i),
                    'locked' => true,
                ]);

                array_push($sections, $section);
            }
            return response()->json($sections, 200);
        } catch (\Throwable $th) {
            throw $th;
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Section  $section
     * @return \Illuminate\Http\Response
     */
    public function show(Section $section)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Section  $section
     * @return \Illuminate\Http\Response
     */
    public function edit(Section $section)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Section  $section
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Section $section)
    {
        $update = $section->update([
            'section_name' => $request->section_name,
            'locked' => $request->locked ? $request->locked : true
        ]);

        if($update) {
            return response()->json($section, 200);
        } else {
            return response()->json([
                'message' => 'Something went wrong.'
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Section  $section
     * @return \Illuminate\Http\Response
     */
    public function destroy(Section $section)
    {
        $delete = $section->delete();
        if($delete) {
            return response()->json([
                'message' => 'Section deleted successfully.'
            ], 200);
        } else {
            return response()->json([
                'message' => 'Something went wrong. Try again later.'
            ], 400);
        }
    }
}
