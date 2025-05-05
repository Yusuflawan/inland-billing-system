<?php

class Business{

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function getBusinessType(){
        try {
            $query = "SELECT * FROM business";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $data =  $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "Business not found"];
            }

            return ["status" => "success", "message" => "success", "data" => $data];
        
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
    }

    }

    public function getBusinessTypeById($id){
        try {
            $query = "SELECT * FROM business WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $data =  $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "Agent not found"];
            }

            return ["status" => "success", "message" => "success", "data" => $data];
        
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
    }

    }

}