<?php

require 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

require_once './app/config/Database.php';
require_once './app/models/BusinessOwners.php';
require_once './app/models/Admins.php';
require_once './app/models/Agents.php';

class PaymentController{
    // private $secretKey;

    private $businessOwnersModel;
    private $adminsModel;
    private $agentsModel;

    public function __construct() {

        // $this->secretKey = $_ENV['JWT_SECRET_KEY'];
        
        $database = new Database();
        $db = $database->connect();

        $this->businessOwnersModel = new BusinessOwners($db);
        $this->adminsModel = new Admins($db);
        $this->agentsModel = new Agents($db);
    }

    public function getBusinessOwnersPaymentHistory($id) {
        $response = $this->businessOwnersModel->getPaymentHistory($id);

        return json_encode($response);
    }
           
    public function getPaymentByAgentId($id)
    {
        $response = $this->agentsModel->getPaymentByAgentId($id);

        return json_encode($response);
    }

    public function getPaymentHistoty()
    {
        $response = $this->adminsModel->getPaymentHistoty();

        return json_encode($response);
    }
    
}