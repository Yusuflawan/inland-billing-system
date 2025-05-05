<?php

// require_once 'vendor/autoload.php';
// use \Firebase\JWT\JWT;
// use \Firebase\JWT\Key;

require_once './app/config/Database.php';
require_once './app/models/States.php';

class StatesController{

    private $statesModel;

    public function __construct() {

        $database = new Database();
        $db = $database->connect();

        $this->statesModel = new States($db);
        
    }

    public function getStates(){

        $response = $this->statesModel->getStates();

        return json_encode($response);
    }

    public function getLocalGovts($id){

        $response = $this->statesModel->getLocalGovts($id);

        return json_encode($response);
    }

    public function getStateById($id){

        $response = $this->statesModel->getStateById($id);

        return json_encode($response);
    }

    public function getLocalGovtById($id){

        $response = $this->statesModel->getLocalGovtById($id);

        return json_encode($response);
    }

    
    
}