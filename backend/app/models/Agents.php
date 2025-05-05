<?php

class Agents{
    private $db;
    // private $table = 'agents';

    public function __construct($db){
        $this->db = $db;
    }

    public function getAgents(){
        

        try {
            $query = "SELECT * FROM agents";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "Agent no found"];
            } else {
                return ["status" => "success", "message" => "Agents found", "data" => $data];
           }
       } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
       }
    }

    public function getAgentById($id){
        
        try {
            // $query = "SELECT * FROM agents WHERE id = :id";
            $query = "SELECT agents.*,
            states.state AS state_name,
            local_govts.lga AS lga_name
            FROM agents
            JOIN states ON states.id = agents.state
            JOIN local_govts ON local_govts.id = agents.lga
            WHERE agents.id = :id
            ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "Agent no found"];
            } else {
                return ["status" => "success", "message" => "Agent found", "data" => $data];
           }
       } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
       }
    }

    public function getAgentByEmail($email)
    {
        try {
            $sql = "SELECT * FROM agents WHERE email = :email";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam("email", $email, PDO::PARAM_STR);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$data) {
                return ["status" => "error", "message" => "Incorrect email or password"];
            }

            return ["status" => "success", "message" => "success", "data" => $data];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    public function register($firstName, $lastName, $email, $phone, $address, $state, $lga, $role, $password)
    {
        try {
            $checkSql = "SELECT id FROM agents WHERE email = :email";
            $stmt = $this->db->prepare($checkSql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return ["status" => "error", "message" => "Email already exists; this agent cannot be registered"];
            }

            $insertSql = "INSERT INTO agents(`first_name`, `last_name`, `email`, `phone`, `address`, `state`, `lga`, `role`, `password`) VALUES(:first_name, :last_name, :email, :phone, :address, :state, :lga, :role, :password)";
            $stmt = $this->db->prepare($insertSql);
            $stmt->bindParam(':first_name', $firstName, PDO::PARAM_STR);
            $stmt->bindParam(':last_name', $lastName, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
            $stmt->bindParam(':address', $address, PDO::PARAM_STR);
            $stmt->bindParam(':state', $state, PDO::PARAM_STR);
            $stmt->bindParam(':lga', $lga, PDO::PARAM_STR);
            $stmt->bindParam(':role', $role, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->execute();

            return ["status" => "success", "message" => "Agent registered successfully"];

        } catch (Exception $e) {
            throw new Exception("Error while fetching the data: " . $e->getMessage());
        }
    }

    public function getPaymentByAgentId($id)
    {
    try {
        $query = "
            SELECT 
                business_owners.business_name, 
                business_owners.tin, 
                payment_history.paid_on, 
                payment_history.amount, 
                payment_history.payment_method,
                payment_history.notice_id,
                demand_notices.demand_notice_number
            FROM 
                business_owners 
            INNER JOIN 
                payment_history 
            ON 
                business_owners.id = payment_history.business_owner_id 
            INNER JOIN demand_notices
                ON demand_notices.id = payment_history.notice_id
            WHERE 
                payment_history.managed_by = :id
        ";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$data) {
            return ["status" => "error", "message" => "Non of your business owners have made any payments"];
        } else {
            return ["status" => "success", "message" => "Payment found", "data" => $data];
       }
   } catch (Exception $e) {
        return ["status" => "error", "message" => $e->getMessage()];
   }
}


public function getBlacklistedbBusinesses($agentId) {
    try {
        // $query = "SELECT * FROM blacklistedBusinesses";
        $query = "SELECT * FROM blacklisted_businesses WHERE blacklisted_businesses.reported_by = :agent_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':agent_id', $agentId, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$data) {
            return ["status" => "error", "message" => "No blacklisted business found"];
        }

        return ["status" => "success", "message" => "Blacklisted business found", "data" => $data];

    } catch (Exception $e) {
        throw new Exception("Error while fetching the data: " . $e->getMessage());
    }
}


public function createBlacklistBusiness($businessOwner, $businessName, $phone, $email, $address, $reportedBy, $reason) {
    try {
        $sql = "INSERT INTO blacklisted_businesses (business_owner, business_name, phone, email, address, reported_by, reason) VALUES (:business_owner, :business_name, :phone, :email, :address, :reported_by, :reason)";

        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':business_owner', $businessOwner, PDO::PARAM_STR);
        $stmt->bindParam(':business_name', $businessName, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':address', $address, PDO::PARAM_STR);
        $stmt->bindParam(':reported_by', $reportedBy, PDO::PARAM_INT);
        $stmt->bindParam(':reason', $reason, PDO::PARAM_STR);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ["status" => "success", "message" => "Business blacklisted successfully"];
        } else {
            return ["status" => "error", "message" => "Failed to blacklist business"];
        }
    } catch (Exception $e) {
        return ["status" => "error", "message" => "Error while blacklisting the business: " . $e->getMessage()];        
    }
}

    public function getAgentsCount(){
        $query = "SELECT COUNT(*) as count FROM agents";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Agents count found" : "No Agents found",
            "data" => $data
        ];
    }
  
    public function   updateProfile($id, $firstName,$lastName, $address, $phone, $email, $state, $lga){
        try{
        $sql = "UPDATE agents SET first_name = :first_name, last_name = :last_name, state = :state, lga = :lga, email = :email, phone = :phone, address = :address WHERE id = :id";
        $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':first_name', $firstName, PDO::PARAM_STR);
            $stmt->bindParam(':last_name', $lastName, PDO::PARAM_STR);
            $stmt->bindParam(':state', $state, PDO::PARAM_INT);
            $stmt->bindParam(':lga', $lga, PDO::PARAM_INT);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
            $stmt->bindParam(':address', $address, PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return ["status" => "success", "message" => "Profile updated successfully"];

        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    
}