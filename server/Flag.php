<?php

// loops through the flag image directory and returns an array of flag names

class Flag {

	public function getFlags() {
		$directory = getcwd() . "/client/img/flags/";
		$filePosition = -1;
		$flags = array();

		if ($dir_handle = opendir($directory)) {

	        while (false !== ($file = readdir($dir_handle))) {

	            if (substr($file, -4) == ".png") { 
	                $fileName = substr($file, 0, -4); 
                    $filePosition++;
                    $flags[$filePosition] = $fileName;
	            }
	        }
	        closedir($dir_handle);
	    } else 
	        die("Error opening directory.");

	    return $flags;
	} 
} 
