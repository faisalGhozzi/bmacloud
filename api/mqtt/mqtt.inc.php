<?php

/*
 * MQTT-Funktionen zum Nachrichtenversand an eine Box
 */
//error_reporting(E_ALL);

include_once("./lic.inc.php");

require '../vendor/autoload.php';
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\Exceptions\MqttClientException;

function mqtt_send($topic,$payload,$retain=false)
{
    global $boxid;
    $boxid = getBoxid($topic);

    $mqtt_username = 'php';
    $mqtt_password = substr(get_serial('/var/www/bmacloud/').'!',1);

    $server   = '127.0.0.1';
    $port     = 1888;
    $clientId = 'bmacloud-'.time();

    try {
        $mqtt = new \PhpMqtt\Client\MqttClient($server, $port, $clientId);

        $connectionSettings = (new \PhpMqtt\Client\ConnectionSettings)
            ->setUsername($mqtt_username)
            ->setPassword($mqtt_password);

        $mqtt->connect($connectionSettings, true);
        $mqtt->publish($topic, $payload, MqttClient::QOS_EXACTLY_ONCE, $retain);

        $mqtt->loop(true, true);

        $mqtt->disconnect();
    } catch (MqttClientException $e) {
        // MqttClientException is the base exception of all exceptions in the library. Catching it will catch all MQTT related exceptions.
        echo('MQTT failed. An exception occurred. '.$e);
        return false;
    }
    return true;
}

function getBoxid($topic){
    $offset = strpos($topic, "/") + 1;
    $end = strpos($topic, "/", $offset);
    $len = $end - $offset;
    return substr($topic, $offset, $len);
}

function encrypt_payload($cleartext, $boxid = null){
    $method = "aes-256-ctr";
    $iv_size = openssl_cipher_iv_length($method);
    $iv = openssl_random_pseudo_bytes($iv_size);
    $cipheredtext = openssl_encrypt($cleartext, $method, mqtt_passphrase($boxid), OPENSSL_RAW_DATA, $iv);
    return base64_encode($iv . $cipheredtext);
}

function decrypt_payload($cipheredtext, $boxid = null){
    $cipheredtext = base64_decode($cipheredtext);
    $method = "aes-256-ctr";
    $iv_size = openssl_cipher_iv_length($method);
    $iv = substr($cipheredtext, 0, $iv_size);
    $cipheredtext = substr($cipheredtext, $iv_size);
    return openssl_decrypt($cipheredtext, $method, mqtt_passphrase($boxid), OPENSSL_RAW_DATA, $iv);
}

function mqtt_passphrase($localBoxid = null){
    global $_mqttpass, $boxid;
    if(!isset($localBoxid)){
        $localBoxid = $boxid;
    }
    if(!isset($_mqttpass)){
        $_mqttpass = [];
    }
    if(!isset($_mqttpass[$localBoxid])){
        $appSecret = "Y57otDvBfeCZ5PPzUWV1wWixQ5JiVgjt6U1oMEgPrcQP7vu5PPiQqy6dYQKB3ePJ2kKDcj2evZofb9NCWhB3v6HbEYDjctCfLn1FkAwfzZ1UZErCY1VUQmoXtnZLFZLwR1iw2cPHNfMEauKuM14D41hh7tXYE15xNxCuQoA51XHDkCxtui0ahNhDKp7NP15XumYpWtfKK8gdgoHpAkcBhdsJqixKhv70hNM2ZgzwF37p3u96kDTYmN5ErpiMcmiA";
        $key_clear = substr_replace($appSecret, $localBoxid, intval((256-strlen($localBoxid)) / 2), strlen($localBoxid));
        $_mqttpass[$localBoxid] = openssl_digest(substr($key_clear, 0, 128), "sha512") . openssl_digest(substr($key_clear, 128), "sha512");
    }
    return $_mqttpass[$localBoxid];
}
