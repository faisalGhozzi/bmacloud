<?php

namespace api\controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

 require ("../../api/services/Database.php");
 require ("../../api/services/JwtHandler.php");

use services\Database;
use services\JwtHandler;
use PDO;
use PDOException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function msg($success,$status,$message,$extra = []){
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ],$extra);
}


// $db_connection = new Database();
$conn = (new Database())->dbConnection();

$data = json_decode(file_get_contents("php://input"));
$returnData = [];

if($_SERVER["REQUEST_METHOD"] != "POST"):
    $returnData = msg(0, 404, "Not Found!");
elseif (!isset($data->login) 
    || !isset($data->password)
    || empty(trim($data->login))
    || empty(trim($data->password))
    ):

    $fields = ['fields' => ['login', 'password']];
    $returnData = msg(0,422,'Fill required fields!',$fields);
else:
    $login = trim($data->login);
    $password = trim($data->password);

    if(strlen($login) == 0):
        $returnData = msg(0,422,'Input login');
    
    elseif(strlen($password) < 8):
        $returnData = msg(0,422,'Your password must be at least 8 characters long!');

    else:
        try{
            $fetch_user_by_email = "SELECT * FROM `user` WHERE `login`=:login";
            $query_stmt = $conn->prepare($fetch_user_by_email);
            $query_stmt->bindValue(':login', $login,PDO::PARAM_STR);
            $query_stmt->execute();

            if($query_stmt->rowCount()):
                $row = $query_stmt->fetch(PDO::FETCH_ASSOC);
                // $check_password = password_verify($password, $row['password']);
                

                if(md5($password) == $row['password']):

                    // $jwt = new JwtHandler();
                    $token = (new Jwthandler())->jwtEncodeData(
                        'http://localhost/bmacloud/',
                        array("user_id"=> $row['uid'])
                    );
                    
                    $returnData = [
                        'success' => 1,
                        'message' => 'You have successfully logged in.',
                        'token' => $token
                    ];

                else:
                    $returnData = msg(0,422,'Invalid Password!');
                endif;

            else:
                $returnData = msg(0,422,'Invalid Login!');
            endif;
        }
        catch(PDOException $e){
            $returnData = msg(0,500,$e->getMessage());
        }

    endif;

endif;

echo json_encode($returnData);