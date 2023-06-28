<?php

//Liefert die Lizenzinformationen
//Muss verschlüsselt auf dem System liegen!


//Liefert die eindeutige Systemnummer anhand der MAC-Adresse
function get_serial($path='')
{
//$mymac = sg_get_mac_addresses();
//$secret_key = serialize($mymac);
//$key = hash('crc32', $secret_key);
//
if(file_exists($path.'uuid.txt'))
{
$uuid = trim(file_get_contents($path.'uuid.txt'));
return 'Y'.$uuid;
} else {
return 'Unknown UUID-Path - '.$path.'uuid.txt';
}
}

//Gibt das Datum zurück, bis wann die Lizenz gültig ist
function get_licinfo()
{
	$licinfo[0] = false;
	
	$id = get_serial();
	$q=mysql_query("SELECT `lic` FROM `cloud` WHERE `id`='".$id."' LIMIT 1");
	
	$dat = mysql_fetch_array($q);
	
	if($dat[lic]=='')
	{
		
	} else {
	//Entschlüssel die Lizenz
	
	$input = base64_decode(substr($dat[lic],3));

	$encrypt_method = "AES-256-CBC";
    $secret_key = '$nx6JW3@AsG*';
    $secret_iv = 'kwkwkwkwkwkwkw';
    $key = hash('sha256', $secret_key);
    $iv = substr(hash('sha256', $secret_iv), 0, 16);
	$decrypted_data = @openssl_decrypt($input, $encrypt_method, $key, 0, $iv);
	
	$dat = @explode('#',$decrypted_data);
	
	if(($id == $dat[1])&&(strlen($id)>3)&&($dat[0]=='Ykw'))
	{
		$licinfo[0] = true;
		$licinfo[1] = $dat[1]; //Seriennummer
		$licinfo[2] = $dat[2]; //Gültig bis
	}
	}
	return $licinfo;
}