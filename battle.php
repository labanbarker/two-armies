<?php
error_reporting(1);

spl_autoload_register(function($class_name) {
    $path = "server/";
    include $path . $class_name . '.php'; 
});

header("Content-Type: application/json; charset=UTF-8");

// keep track of flags used
$flagsTaken = array();


// make two army objects with the army name at the start
$army = new Army(); 
$flag = $army->getName($flagsTaken);
array_push($flagsTaken, $flag);

$army2 = new Army();
$flag2 = $army2->getName($flagsTaken);
array_push($flagsTaken, $flag2);


// make some nice json for the Javascript to parse
$json = array(
	$flag => $army->soldier->getSizes()
);
$json2 = array(
	$flag2 => $army2->soldier->getSizes()
);
echo json_encode( 
	array_merge($json, $json2) 
);

?>