<?php

class BusinessOwners{
    private $db;
    // private $table = 'users';

    public function __construct($db){
        $this->db = $db;
    }
   
    public function register($businessName, $email, $phone, $address, $website, $idType, $idNumber, $staffQuota, $businessType, $sector, $tin, $cacNumber, $state, $lga, $agentId,  $password)
    {
        try {
            // Check if the email already exists
            $checkSql = "SELECT id FROM business_owners WHERE email = :email";
            $stmt = $this->db->prepare($checkSql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                return ["status" => "error", "message" => "Email already exists; this business owner cannot be registered"];
            }
    
            // Insert identity information into the identity table
            $identitySql = "INSERT INTO identity(`id_type`, `id_number`) VALUES(:id_type, :id_number)";
            $stmt = $this->db->prepare($identitySql);
            $stmt->bindParam(':id_type', $idType, PDO::PARAM_STR);
            $stmt->bindParam(':id_number', $idNumber, PDO::PARAM_STR);
            $stmt->execute();
    
            // Get the ID of the inserted identity record
            $identity = $this->db->lastInsertId();

            // Insert user information into the users table
            $insertSql = "INSERT INTO business_owners(`business_name`, `staff_quota`, `email`, `phone`, `address`, `website`, `identity`, `business_type`, `sector`, `tin`, `cac_number`, `state`, `lga`, `agent_id`, `password`) 
                          VALUES(:business_name, :staff_quota, :email, :phone, :address, :website, :identity, :business_type, :sector, :tin, :cac_number, :state, :lga, :agent_id, :password)";
            $stmt = $this->db->prepare($insertSql);
            $stmt->bindParam(':business_name', $businessName, PDO::PARAM_STR);
            $stmt->bindParam(':staff_quota', $staffQuota, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
            $stmt->bindParam(':address', $address, PDO::PARAM_STR);
            $stmt->bindParam(':website', $website, PDO::PARAM_STR);
            $stmt->bindParam(':identity', $identity, PDO::PARAM_INT);
            $stmt->bindParam(':business_type', $businessType, PDO::PARAM_STR);
            $stmt->bindParam(':sector', $sector, PDO::PARAM_STR);
            $stmt->bindParam(':tin', $tin, PDO::PARAM_STR);
            $stmt->bindParam(':cac_number', $cacNumber, PDO::PARAM_STR);
            $stmt->bindParam(':state', $state, PDO::PARAM_STR);
            $stmt->bindParam(':lga', $lga, PDO::PARAM_STR);
            $stmt->bindParam(':agent_id', $agentId, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->execute();
    
            return ["status" => "success", "message" => "Business Owner registered successfully"];
    
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    public function registerBusOwn($businessName, $email, $phone, $tin, $agentId,  $password){

        try {
            $sql = "INSERT INTO business_owners(business_name, email, phone, tin, agent_id, password) VALUES(:business_name, :email, :phone, :tin, :agent_id, :password)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':business_name', $businessName, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
            $stmt->bindParam(':tin', $tin, PDO::PARAM_STR);
            $stmt->bindParam(':agent_id', $agentId, PDO::PARAM_INT);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->execute();

            return ["status" => "success", "message" => "Business Owner registered successfully"];
        
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }


    public function getBusinessOwners(){
        $query = "SELECT 
                business_owners.*, 
                agents.first_name AS agent_first_name,
                agents.last_name AS agent_last_name
            FROM 
                business_owners
            LEFT JOIN 
                agents ON business_owners.agent_id = agents.id";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$data) {
            return ["status" => "error", "message" => "No Business Owner found"];
        }

        return ["status" => "success", "message" => "Business Owner found", "data" => $data];
    }

    public function getAllBusinessOwnersCount(){
        // count the number of business owners
        $query = "SELECT COUNT(*) as count FROM business_owners";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Business Owners count found" : "No Business Owners found",
            "data" => $data
        ];
    }

    public function getBusinessOwnersCountByAgent($agentId) {
        // Count the number of business owners by agent
        $query = "SELECT COUNT(*) as count FROM business_owners WHERE agent_id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $agentId, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Business Owners count by agent found" : "No Business Owners found for this agent",
            "data" => $data
        ];
    }

    public function getBusinessOwnerById($businessOwnerId)
    {
        try {
            $sql = "SELECT business_owners.*,
            business_owners.business_type AS business_type_id,
            states.state,
            states.id AS state_id,
            local_govts.id AS lga_id,
            local_govts.lga,
            identity.id_type,
            identity.id_number,
            business.business_type
            FROM business_owners
            JOIN business ON business_owners.business_type = business.id
            JOIN states ON business_owners.state = states.id
            JOIN local_govts ON business_owners.lga = local_govts.id
            JOIN identity ON business_owners.identity = identity.id
            WHERE business_owners.id = :business_owner_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam("business_owner_id", $businessOwnerId, PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No Business Owner found"];
            }

            return ["status" => "success", "message" => "Business Owner found", "data" => $data];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    public function getBusinessOwnerByEmail($email)
    {
        try {
            $sql = "SELECT * FROM business_owners WHERE email = :email";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam("email", $email, PDO::PARAM_STR);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "Email and password do not match"];
            }

            return ["status" => "success", "message" => "This Business Owner is registered", "data" => $data];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }
 
    public function getBusinessOwnerByAgent($agentId)
    {
        try {
            $sql = "SELECT * FROM business_owners WHERE agent_id = :agent_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam("agent_id", $agentId, PDO::PARAM_STR);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No Business Owner to manages"];
            }

            return ["status" => "success", "message" => "Business Owner to manage found", "data" => $data];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    public function getPaymentHistory($businessOwnerId){

        try {
            $sql = "SELECT * FROM payment_history WHERE business_owner_id = :business_owner_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':business_owner_id', $businessOwnerId, PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No Payment Made Yet"];
            }

            return ["status" => "success", "message" => "Payments found", "data" => $data];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
        
    } 

    public function getBusinessOwnerByTin($tin){
        try {
            $sql = "SELECT * FROM business_owners WHERE tin = :tin";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':tin', $tin, PDO::PARAM_STR);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No Business Owner found. Please proceed to manual filling."];
            }

            return ["status" => "success", "message" => "Business Owner found", "data" => $data];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    // updatae profile
    public function updateProfile($id, $businessName, $address, $phone, $email, $state, $lga, $businessType, $businessSector, $staffQuota, $website, $cacNumber){
        try {
            $sql = "UPDATE business_owners SET business_name = :business_name, staff_quota = :staff_quota, business_type = :business_type, sector = :business_sector, state = :state, lga = :lga, cac_number = :cac_number, email = :email, phone = :phone, address = :address, website = :website WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':business_name', $businessName, PDO::PARAM_STR);
            $stmt->bindParam(':staff_quota', $staffQuota, PDO::PARAM_STR);
            $stmt->bindParam(':business_type', $businessType, PDO::PARAM_INT);
            $stmt->bindParam(':business_sector', $businessSector, PDO::PARAM_STR);
            $stmt->bindParam(':state', $state, PDO::PARAM_INT);
            $stmt->bindParam(':lga', $lga, PDO::PARAM_INT);
            $stmt->bindParam(':cac_number', $cacNumber, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
            $stmt->bindParam(':address', $address, PDO::PARAM_STR);
            $stmt->bindParam(':website', $website, PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return ["status" => "success", "message" => "Profile updated successfully"];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    // getActiveBusinessOwnersCountByAgent
    public function getActiveBusinessOwnersCountByAgent($agentId){
        $query = "SELECT COUNT(*) as count FROM `business_owners` WHERE `agent_id` = :id AND `status` = :status";
        $stmt = $this->db->prepare($query);
        $status = "Active";
        $stmt->bindParam(':id', $agentId, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Active business owners count found" : "No Active business owners count found",
            "data" => $data
        ];
    }

    public function getInactiveBusinessOwnersCountByAgent($agentId){
        $query = "SELECT COUNT(*) as count FROM `business_owners` WHERE `agent_id` = :id AND `status` = :status";
        $stmt = $this->db->prepare($query);
        $status = "Inactive";
        $stmt->bindParam(':id', $agentId, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Inactive business owners count found" : "No Inactive business owners count found",
            "data" => $data
        ];
    }

    public function getAllActiveBusinessOwnersCount(){
        $query = "SELECT COUNT(*) as count FROM `business_owners` WHERE `status` = :status";
        $stmt = $this->db->prepare($query);
        $status = "Active";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Inactive business owners count found" : "No Inactive business owners count found",
            "data" => $data
        ];
    }

    public function getAllInactiveBusinessOwnersCount(){
        $query = "SELECT COUNT(*) as count FROM `business_owners` WHERE `status` = :status";
        $stmt = $this->db->prepare($query);
        $status = "Inactive";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Inactive business owners count found" : "No Inactive business owners count found",
            "data" => $data
        ];
    }


}