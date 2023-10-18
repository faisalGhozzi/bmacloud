<?php

namespace server\controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Methods: *');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

use services\Database;
use PDO;

class DeviceController {
    public $conn = null;

    public function __construct(){
        $this->conn = (new Database())->dbConnection();
    }

    public function getAllDevices(){
        $houseid = $_GET["houseid"];
        $sql = 'SELECT * FROM `devices` LEFT JOIN `raume` ON `raume`.`id` = `devices`.`roomid` WHERE `devices`.`houseid` = :houseid';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":houseid", $houseid);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    }

    /**
     * Activate / Deactivate Device
     */
    public function changeDeviceStatus(){
        $deviceid = $_GET["deviceid"];
        $new_status = $_GET["status"];
        $sql = 'UPDATE `devices` SET `active` = :new_status WHERE `id` = :deviceid';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':new_status', $new_status);
        $stmt->bindParam(':deviceid', $deviceid);
        if($stmt->execute()){
            $data = ['status' => 1, 'message' => 'success'];
        }else {
            $data = ['status' => 0, 'message' => 'failure'];
        }
        echo json_encode($data);
    }

    /**
     * Activate / Deactivate Sirens
     */
    public function activateDeactivateSirens(){
        $new_status = $_GET["status"];
        $sql = "UPDATE `devices` SET `active` = :new_status WHERE `type` = 'Sirene'";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':new_status', $new_status);
        if($stmt->execute()){
            $data = ['status' => 1, 'message' => 'success'];
        }else {
            $data = ['status' => 0, 'message' => 'failure'];
        }
        echo json_encode($data);
    }

     /**
     * Activate / Deactivate Detectors
     */
    public function activateDeactivateDetectors(){
        $new_status = $_GET["status"];
        $sql = "UPDATE `devices` SET `active` = :new_status WHERE `type` = 'Rauchmelder'";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':new_status', $new_status);
        if($stmt->execute()){
            $data = ['status' => 1, 'message' => 'success'];
        }else {
            $data = ['status' => 0, 'message' => 'failure'];
        }
        echo json_encode($data);
    }
}