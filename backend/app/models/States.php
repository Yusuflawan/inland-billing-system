<?php

class States{

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function getStates(){
        $query = "SELECT * FROM states";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getLocalGovts($stateId){
        // $query = "SELECT lga FROM localGovts WHERE stateId = :stateId";
        $query = "SELECT * FROM `local_govts` WHERE `state_id` = :state_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam("state_id", $stateId, PDO::PARAM_STR);
        $stmt->execute();
        $data =  $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$data) {
            return ["status" => "error", "message" => "Agent not found"];
        }

        return ["status" => "success", "message" => "success", "data" => $data];
    }

    public function getStateById($id){
        try {
            $query = "SELECT * FROM states WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam("id", $id, PDO::PARAM_STR);
            $stmt->execute();
            $data =  $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No state with the given id found"];
            }

            return ["status" => "success", "message" => "State found", "data" => $data];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    public function getLocalGovtById($id){
        try {
            $query = "SELECT * FROM local_govts WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam("id", $id, PDO::PARAM_STR);
            $stmt->execute();
            $data =  $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No lgi with the given id found"];
            }

            return ["status" => "success", "message" => "LGA found", "data" => $data];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

}