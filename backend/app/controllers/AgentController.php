<?php

require 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

require_once './app/config/Database.php';
require_once './app/models/Agents.php';

class AgentController {
    private $agentsModel;
    private $secretKey;

    public function __construct()
    {
        $database = new Database();
        $db = $database->connect();

        $this->agentsModel = new Agents($db);
        $this->secretKey = $_ENV['JWT_SECRET_KEY'];
    }

    public function getAgents()
    {
        $response = $this->agentsModel->getAgents();
        return json_encode($response);
    }

    public function getAgentById($id)
    {
        $response = $this->agentsModel->getAgentById($id);
        return json_encode($response);
    }

    public function getBlacklistedbBusinesses($agentId)
    {
        $response = $this->agentsModel->getBlacklistedbBusinesses($agentId);
        return json_encode($response);
    }

    public function createBlacklistBusiness()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data["business_owner"] || !$data["business_name"] || !$data["email"] || !$data["phone"] || !$data["address"]  || !$data["reported_by"] || !$data["reason"]) {
            return json_encode(["status" => "error", "message" => "All fields are required"]);
        }

        $businessOwner = $data["business_owner"];
        $businessName = $data["business_name"];
        $email = $data["email"];
        $phone = $data["phone"];
        $address = $data["address"];
        $reportedBy = $data["reported_by"];
        $reason = $data["reason"];

        $response = $this->agentsModel->createBlacklistBusiness($businessOwner, $businessName, $phone, $email, $address, $reportedBy, $reason);
        return json_encode($response);
    }

    public function getAgentsCount(){
        $response = $this->agentsModel->getAgentsCount();
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
            $agentId = $decoded->agent_id;

            if ($agentId != $id) {
                http_response_code(403);
                return json_encode(["status" => "error", "message" => "Unauthorized access"]);
            }

            $response = $this->agentsModel->updateProfile($id, $firstName,$lastName, $address, $phone, $email, $state, $lga);
            return json_encode($response);

        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token', 'error' => $e->getMessage()]);
        }

    }
}
        