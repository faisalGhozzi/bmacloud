<?php

namespace api;

class Api{
    public static function routing($current_url, $urls){
        try{
            foreach($urls as $index => $url){
                if($index != $current_url){
                    continue;
                }

                // Getting controller & method

                $routeElement = explode('@', $url[0]);
                $className = $routeElement[0];
                $function = $routeElement[1];

                // check if controller present

                if(!file_exists("controllers/". $className . ".php")){
                    return "Controller not found";
                }

                $class = "api\controllers\\$className";
                $object = new $class();

                $object->$function();
            }
        }catch(\Exception $e){
            var_dump($e->getMessage());
        }
    }
}