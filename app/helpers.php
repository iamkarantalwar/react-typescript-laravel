<?php

function extractNumberFromString($string)
{
        $arrayOfString = str_split($string);
        $number = '';
        foreach($arrayOfString as $string) {
            if(is_numeric($string)) {
                $number = $number . $string;
            }
        }

        return is_numeric($number) ?  $number : 0;
}
