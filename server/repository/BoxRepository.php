<?php

namespace server\repository;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Methods: *');
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

    public function getBoxes($mandant){
        $sql = 'SELECT * FROM `box` WHERE `mandant` = :mandant ORDER BY `boxid`';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':mandant', $mandant);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getBoxStatus($boxid, $skey){
        $sql = 'SELECT `svalue`, `ts` FROM `box_status` WHERE `boxid` = :boxid AND `skey` = :skey';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':boxid', $boxid);
        $stmt->bindParam(':skey', $skey);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result;
    }

    
}