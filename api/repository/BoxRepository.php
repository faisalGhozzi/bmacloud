<?php

namespace api\repository;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header('Access-Control-Allow-Methods: GET, POST');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include_once('../mqtt/mqtt.inc.php');
use services\Database;
use PDO;

class BoxRepository{
    private $conn = null;
    public function __construct($conn){
        $this->conn = $conn;
    }

    public function getBox($boxid, $mandantId){
        $sql = "SELECT `boxid` FROM `box` a WHERE a.`mandant`='$mandantId' AND a.`boxid` = '".$boxid."'";

        return mysql_query($sql);
    }

    public function getBoxes(){
        $query = "SELECT * FROM `box`";
        $stmt = $this->conn->query($query);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Set headers for JSON response

        $cleanedResults = array_map(function ($row) {
            return array_map(function ($value) {
                return mb_convert_encoding($value, 'UTF-8', 'UTF-8');
            }, $row);
        }, $results);
        
        // Convert result to JSON
        $jsonResult = json_encode($cleanedResults);
        // Echo or return the JSON-encoded result
        return json_decode($jsonResult);
        
        
    }

    
}