<?php

namespace server\controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Methods: *');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

use services\Database;
use PDO;

class BuildingController{
    public $conn = null;

    public function __construct(){
        $this->conn = (new Database())->dbConnection();
    }

        /**
     * Fetching buildings
     */

     public function getBuildings(){
        $boxid = $_GET['boxid'];
        $sql = 'SELECT * FROM `gebaude` WHERE `boxid` = :boxid';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':boxid', $boxid);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
    }

    /**
     * Fetching Rooms of buildings
     */

    public function getRooms(){
        $houseid = $_GET['houseid'];
        $sql = 'SELECT * FROM `raume` WHERE `houseid` = :houseid';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':houseid', $houseid);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    }

    /**
     * Get Connected devices to said room
     */

    public function getDevices(){
        $roomid = $_GET['roomid'];
        $houseid = $_GET['houseid'];
        $sql = 'SELECT * FROM `devices` WHERE `roomid` = :roomid AND `houseid` = :houseid';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':houseid', $houseid);
        $stmt->bindParam(':roomid', $roomid);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    }
}