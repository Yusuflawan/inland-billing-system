<?php

require 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

require_once './app/config/Database.php';
require_once './app/models/Payment.php';

class WebhookController
{
    private $paymentModel;
    private $secretKey;

    public function __construct()
    {
        $database = new Database();
        $db = $database->connect();

        $this->paymentModel = new Payment($db);
        $this->secretKey = $_ENV['PAYSTACK_SECRET_KEY'];
    }

    // public function handlePaystack()
    // {
    //     $rawPayload = file_get_contents('php://input');
    //     $signature = $_SERVER['HTTP_X_PAYSTACK_SIGNATURE'] ?? '';

    //     if (hash_hmac('sha512', $rawPayload, $this->secretKey) === $signature) {
    //         $data = json_decode($rawPayload, true);

    //         if ($data['event'] === 'charge.success') {
    //             $email = $data['data']['customer']['email'];
    //             $amount = $data['data']['amount'] / 100;
    //             $reference = $data['data']['reference'];
    //             $status = $data['data']['status'];

    //             $response = $this->paymentModel->addPayment($email, $amount, $status);
    //             return json_encode($response);
    //         }

    //         http_response_code(200);
    //         echo "OK";
    //     } else {
    //         http_response_code(403);
    //         echo "Invalid signature";
    //     }
    // }
}
