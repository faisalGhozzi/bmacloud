<?php
namespace api\controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header('Access-Control-Allow-Methods: GET, POST');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

use services\Database;
// use repository\BoxRepository;
use PDO;

class AnlageController{
    public $conn = null;

    public function __construct(){
        $this->conn = (new Database())->dbConnection();
    }

    public function getAnlageById(){
        $aid = $_GET['aid'];
        // $q2=mysql_query("SELECT * FROM `anlagen` WHERE `aid`='$box[aid]' AND `mandant`='$userinfo[mandant]'");

        $sql = "SELECT * FROM `anlagen` WHERE `aid`= :aid";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':aid', $aid);
        $stmt->execute();
        // var_dump($stmt->debugDumpParams());
        $result = $stmt->fetch();
        echo json_encode($result);
    }
}