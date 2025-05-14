<?php

class Payment{
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    // public function addPayment($email, $amount, $status){
    //     $sql = "INSERT INTO payment_history VALUES(:email, :amount, :reference)";

    // }


    // public function getPaymentHistory($id){

    //     try {
    //         $sql = "SELECT * FROM paymentHistory WHERE business_owner_id = :id";
    //         $stmt = $this->db->prepare($sql);
    //         $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    //         $stmt->execute();
    //         $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //         if (!$data) {
    //             return ["status" => "error", "message" => "No Payment Made Yet"];
    //         }

    //         return ["status" => "success", "message" => "Payments found", "data" => $data];

    //     } catch (Exception $e) {
    //         return ["status" => "error", "message" => $e->getMessage()];
    //     }
        
    // }

    
public function createPaymentHistory($noticeNumber, $amount, $revenueItem, $tin, $status, $paymentDate, $agentId) {

    try {
        $sql = "INSERT INTO payment_history (tin, notice_number, amount, status, revenue_item, payment_date, managed_by) 
                VALUES (:tin, :notice_number, :amount, :status, :revenue_item, :payment_date, :managed_by)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':tin', $tin, PDO::PARAM_STR);
        $stmt->bindParam(':notice_number', $noticeNumber, PDO::PARAM_STR);
        $stmt->bindParam(':amount', $amount, PDO::PARAM_STR);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':revenue_item', $revenueItem, PDO::PARAM_STR);
        $stmt->bindParam(':payment_date', $paymentDate, PDO::PARAM_STR);
        $stmt->bindParam(':managed_by', $agentId, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return ["status" => "success", "message" => "Payment history created successfully"];
        } else {
            return ["status" => "error", "message" => "Failed to create payment history"];
        }
    } catch (Exception $e) {
        // error_log($e->getMessage()); // Log the error for debugging
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

    
public function setPayment($noticeNumber, $paymentChannel, $paymentBank, $paymentMethod, $referenceNumber, $receiptNumber, $amount) {

    try {
        // $sql = "INSERT INTO payment_history (tin, notice_number, amount, status, revenue_item, payment_date, managed_by) 
        //         VALUES (:tin, :notice_number, :amount, :status, :revenue_item, :payment_date, :managed_by)";
        $sql = "INSERT INTO payment_history (notice_number, payment_channel, payment_bank, payment_method, reference_number, receipt_number, amount) 
                VALUES (:notice_number, :payment_channel, :payment_bank, :payment_method, :reference_number, :receipt_number, :amount)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':notice_number', $noticeNumber, PDO::PARAM_STR);
        $stmt->bindParam(':payment_channel', $paymentChannel, PDO::PARAM_STR);
        $stmt->bindParam(':payment_bank', $paymentBank, PDO::PARAM_STR);
        $stmt->bindParam(':payment_method', $paymentMethod, PDO::PARAM_STR);
        $stmt->bindParam(':reference_number', $referenceNumber, PDO::PARAM_STR);
        $stmt->bindParam(':receipt_number', $receiptNumber, PDO::PARAM_STR);
        $stmt->bindParam(':amount', $amount, PDO::PARAM_STR);


        // $stmt->bindParam(':tin', $tin, PDO::PARAM_STR);
        // $stmt->bindParam(':notice_number', $noticeNumber, PDO::PARAM_STR);
        // $stmt->bindParam(':amount', $amount, PDO::PARAM_STR);
        // $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        // $stmt->bindParam(':revenue_item', $revenueItem, PDO::PARAM_STR);
        // $stmt->bindParam(':payment_date', $paymentDate, PDO::PARAM_STR);
        // $stmt->bindParam(':managed_by', $agentId, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return ["status" => "success", "message" => "Payment history created successfully"];
        } else {
            return ["status" => "error", "message" => "Failed to create payment history"];
        }
    } catch (Exception $e) {
        // error_log(); // Log the error for debugging
        return ["status" => "error", "message" => $e->getMessage()];
    }
}







}