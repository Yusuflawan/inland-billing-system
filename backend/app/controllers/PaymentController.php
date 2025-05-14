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
    private $paymentModel;

    public function __construct() {

        // $this->secretKey = $_ENV['JWT_SECRET_KEY'];
        
        $database = new Database();
        $db = $database->connect();

        $this->businessOwnersModel = new BusinessOwners($db);
        $this->adminsModel = new Admins($db);
        $this->agentsModel = new Agents($db);
        $this->paymentModel = new Payment($db);
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
    

    public function createPaymentHistory()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $noticeNumber = $data['invoice_number'] ?? null;
        $amount = $data['amount_paid'] ?? null;
        $tin = $data['tin'] ?? null;
        $status = $data['payment_status'] ?? null;
        $paymentDate = $data['payment_date'] ?? null;
        $revenueItem = $data['revenue_item'] ?? null;
        $agentId = $data['agent_id'] ?? null;
        // $reference = $data['reference'] ?? null;

        $response = $this->paymentModel->createPaymentHistory($noticeNumber, $amount, $revenueItem, $tin, $status, $paymentDate, $agentId);

        return json_encode($response);
    }

    public function setPayment()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        
        $noticeNumber = $data["invoice_number"];
        $paymentChannel = $data["payment_channel"];
        $paymentBank = $data["payment_bank"];
        $paymentMethod = $data["payment_method"];
        $referenceNumber = $data["payment_reference_number"];
        $receiptNumber = $data["receipt_number"];
        $amount = $data["amount_paid"];
          
        $response = $this->paymentModel->setPayment($noticeNumber, $paymentChannel, $paymentBank, $paymentMethod, $referenceNumber, $receiptNumber, $amount);

        return json_encode($response);
    }

    

}






