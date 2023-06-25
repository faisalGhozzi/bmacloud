<?php


include_once('./mqtt.inc.php');

class Backlash
{

    const COMMAND_SWITCH_GROUP_ACTIVE = "Anlage.setGroupActive";

    public static function backlashAllowedForUser($userinfo) {
        $getMandantStatement = "SELECT * FROM `mandant` WHERE `mandant` = {$userinfo["mandant"]}";
        $getMandantQuery = mysql_query($getMandantStatement);
        $mandant = mysql_fetch_array($getMandantQuery);
        $mandantHasBacklashRight = $mandant !== false && $mandant["backlash_right_enabled"] == '1';
        $userHasBacklashRight = $userinfo["r_backlash"] == '1';
        return $mandantHasBacklashRight && $userHasBacklashRight;
    }

    public static function switchActiveStateOfGroups($anlagenId, $startGroup, $endGroup, $newActiveState)
    {
        global $userinfo;
        $mandant_esc = mysql_real_escape_string($userinfo["mandant"]);
        $boxes = mysql_query("SELECT `boxid` FROM `box` WHERE `mandant` = '$mandant_esc' AND `aid` = {$anlagenId} LIMIT 1");
        if (mysql_num_rows($boxes) > 0) {
            while($box = mysql_fetch_array($boxes)){
                $boxid = $box["boxid"];

                $cmd = self::COMMAND_SWITCH_GROUP_ACTIVE;

                $message = json_encode([
                    "cmd" => "$cmd",
                    "component_start" => "$startGroup",
                    "component_end" => "$endGroup",
                    "arg" => "$newActiveState"
                ]);
                self::sendMessageToWartungsbox($message, $boxid);
            }
        }else{
            throw new RuntimeException("No boxes connected");
        }
    }

    public static function handleConfirm($message){
        switch($message["aktion"]){
            case self::COMMAND_SWITCH_GROUP_ACTIVE:
                return self::updateGroupActive($message);
            default:
                return "confirmed unknown command";
        }
    }

    public static function handleAbschaltung($message){
        if($message["text"] == "Gruppe"){
            return self::updateGroupActive($message);
        }
    }

    private static function updateGroupActive($message){
        global $userinfo;
        $group = $message["gruppe"];
        $active = self::isMessageAnActivation($message);
        if($group){
            $success = mysql_query("UPDATE `technik_gruppe`
                                    SET `active` = '" . mysql_real_escape_string(intval($active)) . "'
                                    WHERE `mandant` = '" . mysql_real_escape_string($userinfo["mandant"]) . "'
                                        AND `anlage` = '" . mysql_real_escape_string($message["aid"]) . "'
                                        AND `gruppe` = '" . mysql_real_escape_string($group) . "'");
        }
        return boolval($success) ? "" : "could not update group state - " . mysql_error();
    }

    private static function isMessageAnActivation($message){
        return $message["aktion"] == "Ruhe Abschaltung" || json_decode($message["text"]) == 1;
    }

    private static function sendMessageToWartungsbox($message, $boxId, $retain = false) {
        $topic = 'box/' . $boxId . '/in/enc/backlash';
        mqtt_send($topic, encrypt_payload($message, $boxId), $retain);
    }

    public static function getMelderGroups($aid, $mandant) {
        $statement = "SELECT id, gruppe, text, active FROM `technik_gruppe` WHERE anlage = '$aid' AND `mandant` = '$mandant' ORDER BY gruppe";
        $query = mysql_query($statement);
        $groups = [];
        while ($group = mysql_fetch_array($query)) {
            $groupState = self::getStatesOfGroup($group["id"]);
            $groups[] = new BacklashGroup($aid, $group["id"], $group["gruppe"], $group["text"], $group["active"], $groupState);
        }
        return $groups;
    }

    private static function getStatesOfGroup($id) {
        // Mock. TODO: replace with database queries.
        switch($id % 4) {
            case 0:
                return [BacklashGroupState::ALARM];
            case 1:
                return [BacklashGroupState::DISTURBANCE];
            case 2:
                return [BacklashGroupState::DEACTIVATED];
            default:
                return [BacklashGroupState::NONE];
        }
    }

}

class BacklashGroup implements JsonSerializable {
    private $aid;
    private $id;
    private $number;
    private $name;
    private $active;
    private $states;

    public function __construct($aid, $id, $number, $name, $active, $states)
    {
        $this->aid = $aid;
        $this->id = $id;
        $this->number = $number;
        $this->name = $name;
        $this->active = $active;
        $this->states = $states;
    }

    public function toJson(){
        json_encode($this);
    }

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}

class BacklashGroupState {
    const ALARM = "alarm";
    const DISTURBANCE = "disturbance";
    const DEACTIVATED = "deactivated";
    const NONE = "none";
}

class BacklashMelder {

}