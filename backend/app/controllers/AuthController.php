<?php

require 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

require_once './app/config/Database.php';
require_once './app/models/BusinessOwners.php';
require_once './app/models/Admins.php';
require_once './app/models/Agents.php';

class AuthController{
    private $secretKey;

    private $businessOwnersModel;
    private $adminsModel;
    private $agentsModel;

    public function __construct() {

        $this->secretKey = $_ENV['JWT_SECRET_KEY'];
        
        $database = new Database();
        $db = $database->connect();

        $this->businessOwnersModel = new BusinessOwners($db);
        $this->adminsModel = new Admins($db);
        $this->agentsModel = new Agents($db);
    }

    public function registerBusinessOwner() {
       
        $data = json_decode(file_get_contents("php://input"), true);

        // if (!$data["firstName"] || !$data["lastName"] || !$data["email"] || !$data["role"] ||  !$data["password"]) {
        //     return json_encode(["status" => "error", "message" => "All fields are required"]);
        // }

        $businessName = $data["business_name"];
        $email = $data["email"];
        $phone = $data["phone"];
        $address = $data["address"];
        $idType = $data["id_type"];
        $idNumber = $data["id_number"];
        $businessType = $data["business_type_id"];
        $sector = $data["sector"];
        $staffQuota = $data["staff_quota"];
        $cacNumber = $data["cac_number"];
        $tin = $data["tin"];
        $website = $data["website"];
        $state = $data["state_id"];
        $lga = $data["lga_id"];
        $password = password_hash($data["password"], PASSWORD_BCRYPT);
        $agentId = $data["agent_id"];


        $response = $this->businessOwnersModel->register($businessName, $email, $phone, $address, $website, $idType, $idNumber, $staffQuota, $businessType, $sector, $tin, $cacNumber, $state, $lga, $agentId,  $password);

        return json_encode($response);
    }

    
    public function registerBusOwn() {
       
        $data = json_decode(file_get_contents("php://input"), true);

        $businessName = $data["business_name"];
        $email = $data["email"];
        $phone = $data["phone"];
        $tin = $data["tin"];
        $agentId = $data["agent_id"];

        $pass = "123";
        $password = password_hash($pass, PASSWORD_BCRYPT);

        $response = $this->businessOwnersModel->registerBusOwn($businessName, $email, $phone, $tin, $agentId,  $password);

        return json_encode($response);
    }


    
    public function adminLogin() {
  
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data["email"] || !$data["password"]) {
        return json_encode(["status" => "error", "message" => "All fields are required"]);
    }

    $email = $data["email"];
    $password = $data["password"];
    
    $admin = $this->adminsModel->getAdminByEmail($email);

    if ($admin["status"] == "error") {
        return json_encode($admin);
    }
    if (password_verify($password, $admin["data"]["password"])) {
        $payload = [
            'iat' => time(),
            'exp' => time() + (60 * 60), // Token valid for 1 hour
            'admin_id' => $admin["data"]["id"],
            'role' => 'admin'
        ];
        $jwt = JWT::encode($payload, $this->secretKey, 'HS256');
        return json_encode(["status" => "success", "message" => "Login successfully", "token" => $jwt]);
    } else {
        return json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }

    }

    public function agentLogin() {
        
        $data = json_decode(file_get_contents("php://input"), true);
    
        if (!$data["email"] || !$data["password"]) {
            return json_encode(["status" => "error", "message" => "All fields are required"]);
        }
    
        $email = $data["email"];
        $password = $data["password"];
        
        $agent = $this->agentsModel->getAgentByEmail($email);
    
        if ($agent["status"] == "error") {
            return json_encode($agent);
        }
        if (password_verify($password, $agent["data"]["password"])) {
            $payload = [
                'iat' => time(),
                'exp' => time() + (60 * 60), // Token valid for 1 hour
                'agent_id' => $agent["data"]["id"],
                'role' => 'agent'
            ];
            $jwt = JWT::encode($payload, $this->secretKey, 'HS256');
            return json_encode(["status" => "success", "message" => "Login successfully", "token" => $jwt]);
        } else {
            return json_encode(["status" => "error", "message" => "Incorect email or password"]);
        }
        
        }


    public function businessOwnerLogin() {
       
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data["email"] || !$data["password"]) {
            return json_encode(["status" => "error", "message" => "All fields are required"]);
        }

        $email = $data["email"];
        $password = $data["password"];
        
        $businessOwner = $this->businessOwnersModel->getBusinessOwnerByEmail($email);

        if ($businessOwner["status"] == "error") {
            return json_encode($businessOwner);
        }
        if (password_verify($password, $businessOwner["data"]["password"])) {
            $payload = [
                'iat' => time(),
                'exp' => time() + (60 * 60), // Token valid for 1 hour
                'business_owner_id' => $businessOwner["data"]["id"]
                // 'role' => $businessOwner["data"]["role"]
            ];
            $jwt = JWT::encode($payload, $this->secretKey, 'HS256');
            return json_encode(["status" => "success", "message" => "Login successfully", "token" => $jwt]);
        } else {
            return json_encode(["status" => "error", "message" => "Invalid credentials"]);
        }
    }

    public function logout() {
        
        return json_encode(["status" => "success", "message" => "Logged out successfully"]);
    }

    public function registerAdmin() {
        
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data["first_name"] || !$data["last_name"] || !$data["email"] || !$data["role"] || !$data["password"]) {
            return json_encode(["status" => "error", "message" => "All fields are required"]);
        }

        $firstName = $data["first_name"];
        $lastName = $data["last_name"];
        $email = $data["email"];
        $role = $data["role"];
        $password = password_hash($data["password"], PASSWORD_BCRYPT);

        $response = $this->adminsModel->register(trim($firstName), trim($lastName), trim($email), trim($role), $password);

        return json_encode($response);
    }

    public function registerAgent() {
        
        $data = json_decode(file_get_contents("php://input"), true);

                
        if (empty($data["first_name"]) || empty($data["last_name"]) || empty($data["email"]) || empty($data["password"])) {
            return json_encode(["status" => "error", "message" => "All fields are required"]);
        }
                
        $firstName = htmlspecialchars(trim($data["first_name"]));
        $lastName = htmlspecialchars(trim($data["last_name"]));
        $email = htmlspecialchars(trim($data["email"]));
        $phone = htmlspecialchars(trim($data["phone"]));
        $address = htmlspecialchars(trim($data["address"]));
        $state = htmlspecialchars(trim($data["state"]));
        $lga = htmlspecialchars(trim($data["lga"]));
        $role = $data["role"];
        $password = password_hash($data["password"], PASSWORD_BCRYPT);

        $response = $this->agentsModel->register($firstName, $lastName, $email, $phone, $address, $state, $lga, $role, $password);

        return json_encode($response);
    }

    

    
}


        