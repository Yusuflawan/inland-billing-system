<?php

require 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

require_once './app/config/Database.php';
require_once './app/models/Admins.php';

class AdminController {

    private $adminsModel;
    private $secretKey;

    public function __construct()
    {
        $database = new Database();
        $db = $database->connect();

        $this->adminsModel = new Admins($db);
        $this->secretKey = $_ENV['JWT_SECRET_KEY'];
    }

    public function getAdmins()
    {
        $response = $this->adminsModel->getAdmins();
        return json_encode($response);
    }


    public function getBlacklistedbBusinesses()
    {
        $response = $this->adminsModel->getBlacklistedbBusinesses();
        return json_encode($response);
    }

    public function updateProfile($id){
        
        $headers = apache_request_headers();
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $headers['Authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['message' => 'Authorization token not provided']);
            return;
        }

        $token = $matches[1];

        $data = json_decode(file_get_contents("php://input"), true);

        $firstName = $data['first_name'];
        $lastName = $data['last_name'];
        $address = $data['address'];
        $phone = $data['phone'];
        $email = $data['email'];
        $state = $data['state'];
        $lga = $data['lga'];
       

        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            $adminId = $decoded->admin_id;

            if ($adminId != $id) {
                http_response_code(403);
                return json_encode(["status" => "error", "message" => "Unauthorized access"]);
            }

            $response = $this->adminsModel->updateProfile($id, $firstName,$lastName, $address, $phone, $email, $state, $lga);
            return json_encode($response);

        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token', 'error' => $e->getMessage()]);
        }

    }

}