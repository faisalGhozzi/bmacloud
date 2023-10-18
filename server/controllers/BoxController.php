<?php

namespace server\controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Methods: *');
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
        $mandant = $_GET["mandant"];
        $sql = 'SELECT * FROM `box` WHERE `mandant` = :mandant ORDER BY `boxid`';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':mandant', $mandant);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    }

    public function getBoxStatus(){
        $boxid = $_GET['boxid'];
        $skey = $_GET['skey'];
        $sql = 'SELECT `svalue`, `ts` FROM `box_status` WHERE `boxid` = :boxid AND `skey` = :skey';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':boxid', $boxid);
        $stmt->bindParam(':skey', $skey);
        $stmt->execute();
        $result = $stmt->fetch();
        echo json_encode($result);
    }
}