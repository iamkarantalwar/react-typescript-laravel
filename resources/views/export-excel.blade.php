<table>
    <thead>
        <tr>
            <th colspan="{{$totalNumberOfColumns}}">{{$project->project_name}}</th>
        </tr>
        <tr>
            <th colspan="{{$totalNumberOfColumns}}">{{$project->description}}</th>
        </tr>
        <tr>
            <th colspan="{{$totalNumberOfColumns}}"></th>
        </tr>
        <tr>
            <th>Etage </th>
            <th>Section</th>
            <th>Raum-nummer</th>
            <th>Bezeichnung</th>
            @foreach($tapsAssigned as $tap)
            <th>
                {{$tap->room_type}}
            </th>
            <th>
                Check 1
            </th>
            <th>
                Check 2
            </th>
            <th>
                Check 3
            </th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach($roomsAssigned as $room)
        <tr>
            <td>
                {{extractNumberFromString($room->section->floor->floor_name)}}
            </td>
            <td>
                {{extractNumberFromString($room->section->section_name)}}
            </td>
            <td>
                {{extractNumberFromString($room->room_name)}}
            </td>
            <td></td>
            @foreach($tapsAssigned as $tap)
                <td>
                    @php
                        $roomTypeCount = $room->taps->where('room_type_id', $tap->id)->count();
                    @endphp
                    {{$roomTypeCount == 0 ? '' : $roomTypeCount}}
                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
            @endforeach
        </tr>
        @endforeach
    </tbody>
</table>
