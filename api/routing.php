<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header('Access-Control-Allow-Methods: GET, POST');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', '1');

// require './controllers/BoxController.php';

require('Api.php');
use Api\Api;
require "services/Database.php";
use services\Database;


require('controllers/BoxController.php');
use api\controllers\BoxController;
require('controllers/AnlageController.php');
use api\controllers\AnlageController;
require('repository/BoxRepository.php');
use api\repository\BoxRepository;
$current_url = $_SERVER["REQUEST_URI"];

// Handle query string

if(strpos($current_url, '?')){
    $current_url = explode('?', $current_url)[0];
}

// Routes

$urls = [
    '/bmacloud/api/boxes' => ['BoxController@getBoxes'],
    '/bmacloud/api/boxes/status' => ['BoxController@getBoxStatus'],
    '/bmacloud/api/anlage/id' => ['AnlageController@getAnlageById']
];

// Check if route available

$availableRoutes = array_keys($urls);

if(!in_array($current_url, $availableRoutes)){
    header('HTTP/1.0 404 Not Found!');
    exit;
}

Api::routing($current_url, $urls);