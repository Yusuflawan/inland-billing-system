<?php

class Payment{
    private $db;
    private $table = 'users';

    public function __construct($db){
        $this->db = $db;
    }

    // public function addPayment($email, $amount, $status){
    //     $sql = "INSERT INTO payment VALUES(:email, :amount, :reference)";
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

}