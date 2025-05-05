<?php

class DemandNotice
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function createDemandNotice($businessOwnerId, $agentId, $revenueHeadItem, $demandNoticeNumber)
    {
        try {
            $query = "INSERT INTO demand_notices (business_owner_id, agent_id, revenue_head_item, demand_notice_number) VALUES (:business_owner_id, :agent_id, :revenue_head_item, :demand_notice_number)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':business_owner_id', $businessOwnerId, PDO::PARAM_INT);
            $stmt->bindParam(':agent_id', $agentId, PDO::PARAM_INT);
            $stmt->bindParam(':revenue_head_item', $revenueHeadItem, PDO::PARAM_INT);
            $stmt->bindParam(':demand_notice_number', $demandNoticeNumber, PDO::PARAM_INT);
            // $stmt->bindParam(':status', $status, PDO::PARAM_STR);

            if ($stmt->execute()) {
                return ["status" => "success", "message" => "Demand notice created successfully"];
            } else {
                return ["status" => "error", "message" => "Failed to create demand notice"];
            }
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }


    public function getADemandNoticeByNoticeNumber($demandNoticeNumber)
    {
        try {
            $query = "SELECT 
                demand_notices.*, 
                business_owners.business_name, 
                business_owners.address, 
                revenue_head_items.revenue_head,
                -- Dynamically select either amount or renewal_amount
                CASE 
                    WHEN revenue_head_items.revenue_head_id = demand_notices.revenue_head_item THEN revenue_head_items.amount
                    WHEN revenue_head_items.revenue_head_id_renewal = demand_notices.revenue_head_item THEN revenue_head_items.renewal_amount
                    ELSE NULL
                END AS amount
            FROM demand_notices
            JOIN business_owners ON business_owners.id = demand_notices.business_owner_id
            JOIN revenue_head_items 
                ON revenue_head_items.revenue_head_id = demand_notices.revenue_head_item
                OR revenue_head_items.revenue_head_id_renewal = demand_notices.revenue_head_item
            WHERE demand_notices.demand_notice_number = :demand_notice_number

            ";


            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':demand_notice_number', $demandNoticeNumber, PDO::PARAM_STR);

            $stmt->execute();
            $data =  $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No demand notice found"];
            }

            return ["status" => "success", "message" => "success", "data" => $data];
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    public function getAllDemandNotices()
    {
        try {
            $query = "SELECT 
                    dn.demand_notice_number,
                    dn.status,
                    dn.created_at,
                    dn.agent_id,
                    bo.tin,
                    bo.business_name,
                    rhi.revenue_head,
                    CASE 
                        WHEN dn.revenue_head_item = rhi.revenue_head_id THEN rhi.amount
                        WHEN dn.revenue_head_item = rhi.revenue_head_id_renewal THEN rhi.renewal_amount
                        ELSE NULL
                    END AS amount,
                    a.first_name AS agent_first_name,
                    a.last_name AS agent_last_name
                FROM demand_notices dn
                INNER JOIN business_owners bo 
                    ON dn.business_owner_id = bo.id
                INNER JOIN revenue_head_items rhi 
                    ON dn.revenue_head_item = rhi.revenue_head_id 
                    OR dn.revenue_head_item = rhi.revenue_head_id_renewal
                INNER JOIN agents a 
                    ON dn.agent_id = a.id;
                        ";

            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $data =  $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No demand notice found"];
            }

            return ["status" => "success", "message" => "success", "data" => $data];
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }


    public function getADemandNoticesByAgentId($id)
    {
        try {
            $query = "SELECT 
                dn.demand_notice_number,
                dn.status,
                dn.created_at,
                bo.tin,
                bo.business_name,
                rhi.revenue_head,
                CASE 
                    WHEN dn.revenue_head_item = rhi.revenue_head_id THEN rhi.amount
                    WHEN dn.revenue_head_item = rhi.revenue_head_id_renewal THEN rhi.renewal_amount
                    ELSE NULL
                    END AS amount
                FROM demand_notices dn
                INNER JOIN business_owners bo 
                    ON dn.business_owner_id = bo.id
                INNER JOIN revenue_head_items rhi 
                    ON dn.revenue_head_item = rhi.revenue_head_id 
                    OR dn.revenue_head_item = rhi.revenue_head_id_renewal
                WHERE dn.agent_id = :id;
                ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $data =  $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No demand notice found"];
            }

            return ["status" => "success", "message" => "success", "data" => $data];
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    public function getADemandNoticesByBusinessOwnerId($id)
    {
        try {
            $query = "SELECT 
                        demand_notices.demand_notice_number,
                        demand_notices.status,
                        demand_notices.created_at,
                        demand_notices.agent_id,
                        -- users.tin,
                        -- users.businessName,
                        revenue_head_items.revenue_head,
                        revenue_head_items.amount
                    FROM demand_notices
                        INNER JOIN business_owners ON demand_notices.business_owner_id = business_owners.id
                        INNER JOIN revenue_head_items ON demand_notices.revenue_head_item = revenue_head_items.revenue_head_id
                    WHERE demand_notices.business_owner_id = :id
                        ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $data =  $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No demand notice found"];
            }

            return ["status" => "success", "message" => "success", "data" => $data];
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }


    public function getRevenueHeadItems()
    {
        try {
            $query = "SELECT * FROM revenue_head_items";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $data =  $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$data) {
                return ["status" => "error", "message" => "No revenue head items found"];
            }

            return ["status" => "success", "message" => "success", "data" => $data];
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    public function getDemandNoticesCount()
    {
        $query = "SELECT COUNT(*) as count FROM demand_notices";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Demand Notices count found" : "No Demand Notices found",
            "data" => $data
        ];
    }

    public function getDemandNoticesCountByAgent($agentId)
    {
        $query = "SELECT COUNT(*) as count FROM demand_notices WHERE agent_id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $agentId, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Demand Notices by Agent count found" : "No Demand Notices by Agent found",
            "data" => $data
        ];
    }

    public function getDemandNoticesCountByBusinessOwner($businessOwnerId)
    {
        $query = "SELECT COUNT(*) as count FROM demand_notices WHERE business_owner_id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $businessOwnerId, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Demand Notices by Business Owner count found" : "No Demand Notices by Business Owner found",
            "data" => $data
        ];
    }

    public function getPaidDemandNoticesCount()
    {
        $query = "SELECT COUNT(*) as count FROM demand_notices WHERE status = :status";
        $stmt = $this->db->prepare($query);
        $status = "paid";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Paid Demand Notices count found" : "No paid Demand Notices found",
            "data" => $data
        ];
    }

    public function getUnpaidDemandNoticesCount()
    {
        $query = "SELECT COUNT(*) as count FROM demand_notices WHERE status = :status";
        $stmt = $this->db->prepare($query);
        $status = "unpaid";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Unpaid Demand Notices count found" : "No unpaid Demand Notices found",
            "data" => $data
        ];
    }

    public function getPaidDemandNoticesCountByAgent($agentId)
    {
        $query = "SELECT COUNT(*) as count FROM `demand_notices` WHERE `agent_id` = :id AND `status` = :status";
        $stmt = $this->db->prepare($query);
        $status = "paid";
        $stmt->bindParam(':id', $agentId, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "paid Demand Notices count found" : "No paid Demand Notices found",
            "data" => $data
        ];
    }

    public function getUnpaidDemandNoticesCountByAgent($agentId)
    {
        $query = "SELECT COUNT(*) as count FROM `demand_notices` WHERE `agent_id` = :id AND `status` = :status";
        $stmt = $this->db->prepare($query);
        $status = "unpaid";
        $stmt->bindParam(':id', $agentId, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Unpaid Demand Notices count found" : "No unpaid Demand Notices found",
            "data" => $data
        ];
    }

    public function getPaidDemandNoticesCountByBusinessOwner($businessOwnerId)
    {
        $query = "SELECT COUNT(*) as count FROM `demand_notices` WHERE `business_owner_id` = :id AND `status` = :status";
        $stmt = $this->db->prepare($query);
        $status = "paid";
        $stmt->bindParam(':id', $businessOwnerId, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Paid Demand Notices count found" : "No paid Demand Notices found",
            "data" => $data
        ];
    }

    public function getUnpaidDemandNoticesCountByBusinessOwner($businessOwnerId)
    {
        $query = "SELECT COUNT(*) as count FROM `demand_notices` WHERE `business_owner_id` = :id AND `status` = :status";
        $stmt = $this->db->prepare($query);
        $status = "unpaid";
        $stmt->bindParam(':id', $businessOwnerId, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['count'] > 0 ? "Unpaid Demand Notices count found" : "No unpaid Demand Notices found",
            "data" => $data
        ];
    }

    public function getTotalAmountPaid()
    {
        $query = "SELECT COALESCE(SUM(revenue_head_items.amount), 0) AS total_amount
                  FROM demand_notices
                  JOIN revenue_head_items ON demand_notices.revenue_head_item = revenue_head_items.revenue_head_id
                  WHERE demand_notices.status = :status";

        $stmt = $this->db->prepare($query);
        $status = "paid";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            "status" => "success",
            "message" => ($data['total_amount'] > 0) ? "Payment Made" : "No payment made yet",
            "data" => $data
        ];
    }


    public function getTotalAmountUnpaid()
    {
        $query = "SELECT COALESCE(SUM(revenue_head_items.amount), 0) AS total_amount
        FROM demand_notices
        JOIN revenue_head_items ON demand_notices.revenue_head_item = revenue_head_items.revenue_head_id
        WHERE demand_notices.status = :status";

        $stmt = $this->db->prepare($query);
        $status = "unpaid";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['total_amount'] > 0 ? "Payment Made" : "No payment made yet",
            "data" => $data
        ];
    }


    public function getTotalAmountPaidByAgent($id)
    {
        $query = "SELECT COALESCE(SUM(revenue_head_items.amount), 0) AS total_amount
                  FROM demand_notices
                  JOIN revenue_head_items ON demand_notices.revenue_head_item = revenue_head_items.revenue_head_id
                  WHERE demand_notices.agent_id = :id 
                  AND demand_notices.status = :status";

        $stmt = $this->db->prepare($query);
        $status = "paid";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            "status" => "success",
            "message" => ($data['total_amount'] > 0) ? "Payment Made" : "No payment made yet",
            "data" => $data
        ];
    }

    public function getTotalAmountUnpaidByAgent($id)
    {
        $query = "SELECT COALESCE(SUM(revenue_head_items.amount), 0) AS total_amount
                  FROM demand_notices
                  JOIN revenue_head_items ON demand_notices.revenue_head_item = revenue_head_items.revenue_head_id
                  WHERE demand_notices.agent_id = :id 
                  AND demand_notices.status = :status";

        $stmt = $this->db->prepare($query);
        $status = "unpaid";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['total_amount'] > 0 ? "Payment Made" : "No payment made yet",
            "data" => $data
        ];
    }

    public function getTotalAmountPaidByBusinessOwner($id)
    {
        $query = "SELECT COALESCE(SUM(revenue_head_items.amount), 0) AS total_amount
                  FROM demand_notices
                  JOIN revenue_head_items ON demand_notices.revenue_head_item = revenue_head_items.revenue_head_id
                  WHERE demand_notices.business_owner_id = :id 
                  AND demand_notices.status = :status";

        $stmt = $this->db->prepare($query);
        $status = "paid";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            "status" => "success",
            "message" => ($data['total_amount'] > 0) ? "Payment Made" : "No payment made yet",
            "data" => $data
        ];
    }

    public function getTotalAmountUnpaidByBusinessOwner($id)
    {
        $query = "SELECT COALESCE(SUM(revenue_head_items.amount), 0) AS total_amount
                  FROM demand_notices
                  JOIN revenue_head_items ON demand_notices.revenue_head_item = revenue_head_items.revenue_head_id
                  WHERE demand_notices.business_owner_id = :id 
                  AND demand_notices.status = :status";

        $stmt = $this->db->prepare($query);
        $status = "unpaid";
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Always return success, even if count is 0
        return [
            "status" => "success",
            "message" => $data['total_amount'] > 0 ? "Payment Made" : "No payment made yet",
            "data" => $data
        ];
    }





    public function getPaymentAmount($business_owner_id, $revenue_head_id)
{
    // Check if business owner has any demand notice payments for this revenue_head_id
    // We assume status 'paid' means completed payment (adjust as needed)
    $checkPaymentSql = "
        SELECT COUNT(*) as count
        FROM demand_notices dn
        JOIN revenue_head_items rhi ON dn.revenue_head_item = rhi.revenue_head_id
        WHERE dn.business_owner_id = :business_owner_id
          AND rhi.revenue_head_id = :revenue_head_id
          AND dn.status = 'paid'
    ";

    // Prepare and execute the check payment SQL
    $stmt = $this->db->prepare($checkPaymentSql);
    $stmt->bindParam(':business_owner_id', $business_owner_id, PDO::PARAM_INT);
    $stmt->bindParam(':revenue_head_id', $revenue_head_id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result !== false && isset($result['count'])) {

            $count = (int)$result['count'];
            $hasPaidBefore = ($count > 0);
        } else {
            $hasPaidBefore = false;
        }
    } else {
        // Query failed, assume no prior payment
        $hasPaidBefore = false;
    }

    // Fetch revenue head item details
    $rhiSql = "SELECT * FROM revenue_head_items WHERE revenue_head_id = :revenue_head_id LIMIT 1";
    $stmt = $this->db->prepare($rhiSql);
    $stmt->bindParam(':revenue_head_id', $revenue_head_id, PDO::PARAM_INT);
    $stmt->execute();
    $revenueHeadItem = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$revenueHeadItem) {
        // revenue head item not found
        return null;
    }

    if (!$hasPaidBefore) {
        // First payment: return normal amount
        return [
            'revenue_head_id' => $revenue_head_id,
            'amount' => (float)$revenueHeadItem['amount']
        ];
    } else {
        // Subsequent payments: use renewal revenue_head_id and renewal_amount
        $renewalId = $revenueHeadItem['revenue_head_id_renewal'];
        $renewalAmount = $revenueHeadItem['renewal_amount'];

        if ($renewalId && $renewalAmount) {
            return [
                'revenue_head_id' => (int)$renewalId,
                'amount' => (float)$renewalAmount
            ];
        } else {
            // If no renewal specified, fallback to normal amount
            return [
                'revenue_head_id' => $revenue_head_id,
                'amount' => (float)$revenueHeadItem['amount']
            ];
        }
    }
}

}
