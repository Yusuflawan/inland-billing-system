<?php

require 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

require_once './app/config/Database.php';
require_once './app/models/BusinessOwners.php';


class BusinessOwnerController {

    private $businessOwnersModel;
    private $secretKey;

    public function __construct() {

        $this->secretKey = $_ENV['JWT_SECRET_KEY'];

        $database = new Database();
        $db = $database->connect();

        $this->businessOwnersModel = new BusinessOwners($db);
    }

    public function getBusinessOwners() {
        $response = $this->businessOwnersModel->getBusinessOwners();
        return json_encode($response);
    }

    public function getBusinessOwnerById($id) {
        $response = $this->businessOwnersModel->getBusinessOwnerById($id);
        return json_encode($response);
    }

    public function getBusinessOwnerByEmail($email) {
        $response = $this->businessOwnersModel->getBusinessOwnerByEmail($email);
        return json_encode($response);
    }

    public function getBusinessOwnerByAgent($id) {
        $response = $this->businessOwnersModel->getBusinessOwnerByAgent($id);
        return json_encode($response);
    }

    public function getBusinessOwnerByTin($tin){
        $response = $this->businessOwnersModel->getBusinessOwnerByTin($tin);
        return json_encode($response);
    }

    public function getAllBusinessOwnersCount(){
        $response = $this->businessOwnersModel->getAllBusinessOwnersCount();
        return json_encode($response);
    }

    public function getBusinessOwnersCountByAgent($id){
        $response = $this->businessOwnersModel->getBusinessOwnersCountByAgent($id);
        return json_encode($response);
    }
    
   
public function updateProfile($id) {

        $headers = apache_request_headers();
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $headers['Authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['message' => 'Authorization token not provided']);
            return;
        }

        $token = $matches[1];

        $data = json_decode(file_get_contents("php://input"), true);

        $businessName = $data['business_name'];
        $address = $data['address'];
        $phone = $data['phone'];
        $email = $data['email'];
        $state = $data['state'];
        $lga = $data['lga'];
        $businessType = $data['business_type'];
        $businessSector = $data['sector'];
        $staffQuota = $data['staff_quota'];
        $website = $data['website'];
        $cacNumber = $data['cac_number'];

        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            $businessOwnerId = $decoded->business_owner_id;

            if ($businessOwnerId != $id) {
                http_response_code(403);
                return json_encode(["status" => "error", "message" => "Unauthorized access"]);
            }

            $response = $this->businessOwnersModel->updateProfile($id, $businessName, $address, $phone, $email, $state, $lga, $businessType, $businessSector, $staffQuota, $website, $cacNumber);
            return json_encode($response);

        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token', 'error' => $e->getMessage()]);
        }

    }

    public function getActiveBusinessOwnersCountByAgent($id){
        $response = $this->businessOwnersModel->getActiveBusinessOwnersCountByAgent($id);
        return json_encode($response);
    }

    public function getInactiveBusinessOwnersCountByAgent($id){
        $response = $this->businessOwnersModel->getInactiveBusinessOwnersCountByAgent($id);
        return json_encode($response);
    }

    public function getAllActiveBusinessOwnersCount(){
        $response = $this->businessOwnersModel->getAllActiveBusinessOwnersCount();
        return json_encode($response);
    }

    public function getAllInactiveBusinessOwnersCount(){
        $response = $this->businessOwnersModel->getAllInactiveBusinessOwnersCount();
        return json_encode($response);
    }

    // public function getAgentByBusinessOwnerId($id){
    //     $response = $this->businessOwnersModel->getAgentByBusinessOwnerId($id);
    //     return json_encode($response);
    // }
    

}



