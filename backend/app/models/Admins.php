<?php

class Admins{
    private $db;
    // private $table = 'admins';

    public function __construct($db){
        $this->db = $db;
    }

    public function getAdmins(){
        $query = "SELECT * FROM admins";
        // $query = "SELECT admins.*,
        // states.state AS state_name,
        // local_govts.lga AS lga_name
        // FROM admins
        // JOIN states ON states.id = admins.state
        // JOIN local_govts ON local_govts.id = admins.lga
        // ";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAdminById($id){
       try {
            // $query = "SELECT * FROM admins WHERE id = :id";
            $query = "SELECT admins.*,
            states.state AS state_name,
            local_govts.lga AS lga_name
            FROM admins
            JOIN states ON states.id = admins.state
            JOIN local_govts ON local_govts.id = admins.lga
            WHERE admins.id = :id
            ";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "Admin no found"];
            } else {
                return ["status" => "success", "message" => "Admin found", "data" => $data];
           }
       } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
       }
    }

    public function getAdminByEmail($email)
    {
        try {
            $sql = "SELECT * FROM admins WHERE email = :email";
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

    public function register($firstName, $lastName, $email, $role, $password)
    {
        try {
            $checkSql = "SELECT id FROM admins WHERE email = :email";
            $stmt = $this->db->prepare($checkSql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return ["status" => "error", "message" => "Email already exists; this admin cannot be registered"];
            }

            $insertSql = "INSERT INTO admins(`first_name`, `last_name`, `email`, `role`, `password`) VALUES(:first_name, :last_name, :email, :role, :password)";
            $stmt = $this->db->prepare($insertSql);
            $stmt->bindParam(':first_name', $firstName, PDO::PARAM_STR);
            $stmt->bindParam(':last_name', $lastName, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':role', $role, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->execute();

            return ["status" => "success", "message" => "Admin registered successfully"];

        } catch (Exception $e) {
            throw new Exception("Error while fetching the data: " . $e->getMessage());
        }
    }

    public function getPaymentHistoty()
    {
        try {
            // $query = "SELECT * FROM paymentHistory";
            $query = "SELECT 
                business_owners.business_name, 
                -- business_owners.tin, 
                payment_history.tin, 
                payment_history.payment_date, 
                payment_history.amount, 
                payment_history.status, 
                -- payment_history.payment_method,
                payment_history.notice_number
                -- demand_notices.demand_notice_number
            FROM 
                business_owners 
            INNER JOIN 
                payment_history 
            ON
                business_owners.tin = payment_history.tin 
            -- INNER JOIN demand_notices
                -- ON demand_notices.id = payment_history.notice_id
            ";

        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $data =  $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$data) {
            return ["status" => "error", "message" => "No payment history found"];
        }

        return ["status" => "success", "message" => "success", "data" => $data];
        } catch (Exception $e) {
            throw new Exception("Error while fetching the data: " . $e->getMessage());
        }
    }

      
        public function getBlacklistedbBusinesses() {
        try {
            // $query = "SELECT * FROM blacklistedBusinesses";
            $query = "
                SELECT
                    agents.first_name, 
                    agents.last_name, 
                    blacklisted_businesses.business_owner,
                    blacklisted_businesses.business_name,
                    blacklisted_businesses.phone,
                    blacklisted_businesses.email,
                    blacklisted_businesses.address,
                    blacklisted_businesses.reason,
                    blacklisted_businesses.created_at
                FROM 
                    blacklisted_businesses 
                JOIN 
                    agents 
                ON 
                    blacklisted_businesses.reported_by = agents.id
                ";
            $stmt = $this->db->prepare($query);
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

    public function   updateProfile($id, $firstName,$lastName, $address, $phone, $email, $state, $lga){
        try{
        $sql = "UPDATE admins SET first_name = :first_name, last_name = :last_name, state = :state, lga = :lga, email = :email, phone = :phone, address = :address WHERE id = :id";
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