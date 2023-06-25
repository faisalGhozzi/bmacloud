<?php

namespace api\controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header('Access-Control-Allow-Methods: GET, POST');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


use services\Database;
use repository\BoxRepository;
use PDO;

class BoxController {
    public $conn = null;

    public function __construct(){
        $this->conn = (new Database())->dbConnection();
    }

    /**
     * Fetching all available maintenance boxes
     */
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
        echo json_encode(json_decode($jsonResult));
        // echo json_encode((new BoxRepository($this->conn))->getBoxes(), JSON_UNESCAPED_UNICODE);
    }
}


    // $db_connection = new Database();
    // $boxRepository = null;
    // $boxRepository = new BoxRepository($db_connection->dbConnection());
        
    // function getData(){
    //     $boxes = $boxRepository->getBoxes();
    //     echo json_encode($boxes, JSON_UNESCAPED_UNICODE);
    // }

    // if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    //     $boxes = $boxRepository->getBoxes();          
    //     echo json_encode($boxes, JSON_UNESCAPED_UNICODE);
    // } else {
    //     echo 'Method not allowed';
    // }


// class BoxController implements Controller{

//     private $boxRepository = null;

//     /**
//      * Box Constructor
//      */
//     public function __construct(){
//         $db_connection = new Database();
//         $this->boxRepository = new BoxRepository($db_connection->dbConnection());
//     }

//     /**
//      * GET method on /boxen
//      * Return all the maintenance boxes
//      */
//     public function getBoxes(){
//         $boxes = $this->boxRepository->getBoxes();
//         //return json_encode($boxes, JSON_UNESCAPED_UNICODE);

//         header('Content-Type: application/json');
//         echo json_encode($boxes, JSON_UNESCAPED_UNICODE);
//     }

//     public function execute($input){
//         return null;
//     }
// }