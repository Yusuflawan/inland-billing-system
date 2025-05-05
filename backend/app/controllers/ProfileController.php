<?php

require_once 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class ProfileController
{
    private $secretKey;

    private $adminsModel;
    private $agentsModel;
    private $businessOwnersModel;

    public function __construct()
    {
        $database = new Database();
        $db = $database->connect();

        $this->secretKey = $_ENV['JWT_SECRET_KEY'];
        $this->businessOwnersModel = new BusinessOwners($db);
        $this->adminsModel = new Admins($db);
        $this->agentsModel = new Agents($db);
    }

    public function getAdminProfile() {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['message' => 'Authorization token not provided']);
            return;
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            $adminId = $decoded->admin_id;

            $response = $this->adminsModel->getAdminById($adminId);
            if ($response["status"] == "error") {
                return json_encode($response);
            }

            return json_encode($response);

        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid or expired token', 'error' => $e->getMessage()]);
        }
    }

    public function getAgentProfile() {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['message' => 'Authorization token not provided']);
            return;
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            $agentId = $decoded->agent_id;

            $response = $this->agentsModel->getAgentById($agentId);
            if ($response["status"] == "error") {
                return json_encode($response);
            }

            return json_encode($response);

        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid or expired token', 'error' => $e->getMessage()]);
        }
    }

    public function getBusinessOwnerProfile() {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['message' => 'Authorization token not provided']);
            return;
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            $id = $decoded->business_owner_id;

            $response = $this->businessOwnersModel->getBusinessOwnerById($id);
            if ($response["status"] == "error") {
                return json_encode($response);
            }

            return json_encode($response);

        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid or expired token', 'error' => $e->getMessage()]);
        }
    }

    

   

}
