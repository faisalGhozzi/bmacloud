<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header('Access-Control-Allow-Methods: GET, POST');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// require './controllers/BoxController.php';

require "services/Database.php";
use services\Database;


require('controllers/BoxController.php');
use api\controllers\BoxController;

// $current_url = $_SERVER["REQUEST_URI"];
// var_dump($current_url);
// exit;

// Routes

$urls = [
    '/bmacloud/api/boxes' => [(new BoxController)->getBoxes()],
];