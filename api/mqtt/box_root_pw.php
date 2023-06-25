<?php

// Source: kwonline.inc.php lines 51 - 58
$serial = '57f38f37'; // Put yours here
$encrypt_method = "AES-256-CBC";
$secret_key = '$Nx6Qsi4Ot9%';
$secret_iv = 'kwkwkwkwkwkwkw';
$key = hash('sha256', $secret_key);
$iv = substr(hash('sha256', $secret_iv), 0, 16);
$encrypted_data = openssl_encrypt($serial, $encrypt_method, $key, 0, $iv);
    
$pwd = '7S'.substr($encrypted_data,0,7).'!';
echo $pwd;
