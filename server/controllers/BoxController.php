<?php

namespace server\controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Methods: *');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

use services\Database;
use PDO;
use server\repository\BoxRepository;

class BoxController {
    private $conn = null;
    private $boxRepo = null;


    public function __construct(){
        $this->conn = (new Database())->dbConnection();
        $this->boxRepo = new BoxRepository($this->conn);
    }

    /**
     * Fetching all available maintenance boxes
     */
    public function getBoxes(){
        $mandant = $_GET["mandant"];
        $result = $this->boxRepo->getBoxes($mandant);
        echo json_encode($result);
    }

    public function getBoxStatus(){
        $boxid = $_GET['boxid'];
        $skey = $_GET['skey'];
        $result = $this->boxRepo->getBoxStatus($boxid, $skey);
        echo json_encode($result);
    }
}