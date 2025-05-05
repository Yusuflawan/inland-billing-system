<?php

require 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class AuthMiddleware {

    private $secretKey;

    public function __construct() {
        
        $this->secretKey = $_ENV['JWT_SECRET_KEY'];
    }

    public function authenticate() {
        // Logic for authentication
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            list($jwt) = sscanf($authHeader, 'Bearer %s');

            if ($jwt) {
                try {
                    $decoded = JWT::decode($jwt, new Key($this->secretKey, 'HS256'));
                    // Store user data in session or context
                    $_SESSION['user'] = $decoded;
                } catch (Exception $e) {
                    http_response_code(401);
                    echo json_encode(['message' => 'Invalid token']);
                    exit;
                }
            } else {
                http_response_code(401);
                echo json_encode(['message' => 'Token not provided']);
                exit;
            }
        } else {
            http_response_code(401);
            echo json_encode(['message' => 'Authorization header not found']);
            exit;
        }
    }


    public function authorize($role) {
        // Logic for authorization based on role
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            list($jwt) = sscanf($authHeader, 'Bearer %s');

            if ($jwt) {
                try {
                    $decoded = JWT::decode($jwt, new Key($this->secretKey, 'HS256'));
                    // Check user role and permissions
                    if ($decoded->role !== $role) {
                        http_response_code(403);
                        echo json_encode(['message' => 'Access denied']);
                        exit;
                    }
                } catch (Exception $e) {
                    http_response_code(401);
                    echo json_encode(['message' => 'Invalid token']);
                    exit;
                }
            } else {
                http_response_code(401);
                echo json_encode(['message' => 'Token not provided']);
                exit;
            }
        } else {
            http_response_code(401);
            echo json_encode(['message' => 'Authorization header not found']);
            exit;
        }
    }
}