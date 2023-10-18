<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../services/Database.php';
require '../misc/AuthMiddleware.php';
use services\Database;

$allHeaders = getallheaders();
$conn = (new Database())->dbConnection();
$auth = new Auth($conn, $allHeaders);

echo json_encode($auth->isValid());