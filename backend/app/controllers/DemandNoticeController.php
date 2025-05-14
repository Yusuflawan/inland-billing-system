<?php

require_once './app/config/Database.php';
require_once './app/models/DemandNotice.php';

class DemandNoticeController{
    private $demandNoticeModel;

    public function __construct() {
        $database = new Database();
        $db = $database->connect();
        $this->demandNoticeModel = new DemandNotice($db);
    }

    public function getAllDemandNotices(){
        $response = $this->demandNoticeModel->getAllDemandNotices();
        return json_encode($response);
    }

    public function getADemandNoticesByAgentId($id){
        $response = $this->demandNoticeModel->getADemandNoticesByAgentId($id);
        return json_encode($response);
    }

    public function getADemandNoticesByBusinessOwnerId($id){
        $response = $this->demandNoticeModel->getADemandNoticesByBusinessOwnerId($id);
        return json_encode($response);
    }

    public function createDemandNotice(){
        $data = json_decode(file_get_contents("php://input"), true);
        $businessOwnerId = $data["business_owner_id"];
        $agentId = $data["agent_id"];
        $revenueHeadItem = $data["revenue_head_item"];
        $demandNoticeNumber = $data["demand_notice_number"];
        $amount = $data["amount"];

        $response = $this->demandNoticeModel->createDemandNotice($businessOwnerId, $agentId, $revenueHeadItem, $demandNoticeNumber, $amount);
        return json_encode($response);
    }
    
    public function getRevenueHeadItems(){
        $response = $this->demandNoticeModel->getRevenueHeadItems();
        return json_encode($response);
    }

    public function getDemandNoticesCount(){
        $response = $this->demandNoticeModel->getDemandNoticesCount();
        return json_encode($response);
    }
    
    public function getDemandNoticesCountByAgent($id){
        $response = $this->demandNoticeModel->getDemandNoticesCountByAgent($id);
        return json_encode($response);
    }

    public function getDemandNoticesCountByBusinessOwner($id){
        $response = $this->demandNoticeModel->getDemandNoticesCountByBusinessOwner($id);
        return json_encode($response);
    }
    
    public function getPaidDemandNoticesCount(){
        $response = $this->demandNoticeModel->getPaidDemandNoticesCount();
        return json_encode($response);
    }

    public function getUnpaidDemandNoticesCount(){
        $response = $this->demandNoticeModel->getUnpaidDemandNoticesCount();
        return json_encode($response);
    }

    public function getPaidDemandNoticesCountByAgent($id){
        $response = $this->demandNoticeModel->getPaidDemandNoticesCountByAgent($id);
        return json_encode($response);
    }

    public function getUnpaidDemandNoticesCountByAgent($id){
        $response = $this->demandNoticeModel->getUnpaidDemandNoticesCountByAgent($id);
        return json_encode($response);
    }

    public function getPaidDemandNoticesCountByBusinessOwner($id){
        $response = $this->demandNoticeModel->getPaidDemandNoticesCountByBusinessOwner($id);
        return json_encode($response);
    }

    public function getUnpaidDemandNoticesCountByBusinessOwner($id){
        $response = $this->demandNoticeModel->getUnpaidDemandNoticesCountByBusinessOwner($id);
        return json_encode($response);
    }

    public function getADemandNoticeByNoticeNumber($demandNoticeNumber){
        $response = $this->demandNoticeModel->getADemandNoticeByNoticeNumber($demandNoticeNumber);
        return json_encode($response);
    }

    public function getTotalAmountPaid(){
        $response = $this->demandNoticeModel->getTotalAmountPaid();
        return json_encode($response);
    }

    public function getTotalAmountUnpaid(){
        $response = $this->demandNoticeModel->getTotalAmountUnpaid();
        return json_encode($response);
    }
    
    
    public function getTotalAmountPaidByAgent($id){
        $response = $this->demandNoticeModel->getTotalAmountPaidByAgent($id);
        return json_encode($response);
    }

    public function getTotalAmountUnpaidByAgent($id){
        $response = $this->demandNoticeModel->getTotalAmountUnpaidByAgent($id);
        return json_encode($response);
    }

    public function getTotalAmountPaidByBusinessOwner($id){
        $response = $this->demandNoticeModel->getTotalAmountPaidByBusinessOwner($id);
        return json_encode($response);
    }

    public function getTotalAmountUnpaidByBusinessOwner($id){
        $response = $this->demandNoticeModel->getTotalAmountUnpaidByBusinessOwner($id);
        return json_encode($response);
    }

    public function getPaymentAmount($business_owner_id, $revenue_head_id){
        $response = $this->demandNoticeModel->getPaymentAmount($business_owner_id, $revenue_head_id);
        return json_encode($response);
    }

    public function updateDemandNoticeStatus($demandNoticeNumber){
        $response = $this->demandNoticeModel->updateDemandNoticeStatus($demandNoticeNumber);
        return json_encode($response);
    }
    

}

