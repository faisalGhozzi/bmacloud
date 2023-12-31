<?php

namespace services;

require ('../../server/vendor/autoload.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JwtHandler{
    protected $jwt_secret;
    protected $token;
    protected $issuedAt;
    protected $expire;
    protected $jwt;

    public function __construct(){
        date_default_timezone_set('Europe/Berlin');
        $this->issuedAt = time();
        $this->expire = $this->issuedAt + 3600;
        $this->jwt_secret = "updated_by_faycal_ghozzi";
    }

    public function jwtEncodeData($iss, $data){
        $this->token = array(
            "iss" => $iss,
            "aud" => $iss,
            "iat" => $this->issuedAt,
            "exp" => $this->expire,
            "data" => $data
        );

        $this->jwt = JWT::encode($this->token, $this->jwt_secret, 'HS256');
        return $this->jwt;
    }

    public function jwtDecodeData($jwt_token){
        try{
            $decode = JWT::decode($jwt_token, new Key($this->jwt_secret, 'HS256'));

            return [
                "data" => $decode->data
            ];
        }catch(Exception $e) {
            return [
                "message" => $e->getMessage()
            ];
        }
    }
}