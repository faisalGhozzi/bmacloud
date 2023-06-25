<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
require ("api/services/Database.php");

use services\Database;

require ("api/controllers/BoxController.php");
require ("api/repository/BoxRepository.php");
require ("api/controllers/login.php");
use api\controllers\BoxController;
use api\repository\BoxRepository;
use api\controllers\login;

