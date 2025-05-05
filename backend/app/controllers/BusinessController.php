<?php


require_once './app/config/Database.php';
require_once './app/models/Business.php';

class BusinessController{

    private $businesssModel;

    public function __construct() {

        $database = new Database();
        $db = $database->connect();

        $this->businesssModel = new Business($db);
        
    }

    public function getBusinessType(){
        $response = $this->businesssModel->getBusinessType();
        return json_encode($response);
    }

    public function getBusinessTypeById($id){
        $response = $this->businesssModel->getBusinessTypeById($id);
        return json_encode($response);
    }

    


}