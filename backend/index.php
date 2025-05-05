<?php

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'vendor/autoload.php';
require_once './app/config/Database.php';
require_once './app/controllers/BusinessOwnerController.php';
require_once './app/controllers/AdminController.php';
require_once './app/controllers/AgentController.php';
require_once './app/controllers/AuthController.php';
require_once './app/controllers/ProfileController.php';
require_once './app/controllers/StatesController.php';
require_once './app/controllers/PaymentController.php';
require_once './app/controllers/BusinessController.php';
require_once './app/controllers/DemandNoticeController.php';
require_once './app/controllers/WebhookController.php';


require_once './app/middlewares/AuthMiddleware.php';

use Phroute\Phroute\RouteCollector;
use Phroute\Phroute\Dispatcher;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$router = new RouteCollector();

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$basePath = str_replace("index.php", "", $_SERVER["SCRIPT_NAME"]);

$normalizedPath = str_replace($basePath, "", $path);

$normalizedPath = "/" . trim($normalizedPath, "/");


// Authentication and Authorization

// Business Owner
$router->post('/auth/login', function(){
    $authController = new AuthController();
    return $authController->businessOwnerLogin();
});

$router->post('/auth/register', function(){
    $authController = new AuthController();
    return $authController->registerBusinessOwner();
});

$router->get('/business-owner/profile', function(){
    $profileController = new ProfileController();
    return $profileController->getBusinessOwnerProfile();
});

$router->get('/business-owner/tin/{tin}', function($tin){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getBusinessOwnerByTin($tin);
});

$router->put('/business-owner/{id}/update-profile', function($id){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->updateProfile($id);
});

$router->post('/auth/auto/register', function(){
    $authController = new AuthController();
    return $authController->registerBusOwn();
});


// Admin
// $router->post('/admin/register', function(){
//     //return 'This route responds to requests with the POST method at the path /auth/register. It register a new user.';
//     $authController = new AuthController();
//     return $authController->registerAdmin();
// });

$router->post('/admin/login', function(){
    $authController = new AuthController();
    return $authController->adminLogin();
});

$router->get('/admin/profile', function(){
    $profileController = new ProfileController();
    return $profileController->getAdminProfile();
});

$router->put('/admin/{id}/update-profile', function($id){
    $adminController = new AdminController();
    return $adminController->updateProfile($id);
});

$router->get('/admin/business-owners', function(){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getBusinessOwners();
});

$router->get('/admin/blacklist-businesses', function(){
    $adminController = new AdminController();
    return $adminController->getBlacklistedbBusinesses();
});



// counts
$router->get('/admin/business-owners/count', function(){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getAllBusinessOwnersCount();
});

$router->get('/admin/agent/count', function(){
    $agentController = new AgentController();
    return $agentController->getAgentsCount();
});

$router->get('/admin/demand-notices/paid/count', function(){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getPaidDemandNoticesCount();
});

$router->get('/admin/demand-notices/unpaid/count', function(){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getUnpaidDemandNoticesCount();
});

$router->get('/agent/{id}/demand-notices/paid/count', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getPaidDemandNoticesCountByAgent($id);
});

$router->get('/agent/{id}/demand-notices/unpaid/count', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getUnpaidDemandNoticesCountByAgent($id);
});

$router->get('/business-owner/{id}/demand-notices/paid/count', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getPaidDemandNoticesCountByBusinessOwner($id);
});

$router->get('/business-owner/{id}/demand-notices/unpaid/count', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getUnpaidDemandNoticesCountByBusinessOwner($id);
});

$router->get('/admin/demand-notices/count', function(){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getDemandNoticesCount();
});

$router->get('/agent/{id}/business-owners/count', function($id){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getBusinessOwnersCountByAgent($id);
});

$router->get('/agent/{id}/demand-notices/count', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getDemandNoticesCountByAgent($id);
});

$router->get('/business-owner/{id}/demand-notices/count', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getDemandNoticesCountByBusinessOwner($id);
});

$router->get('/agent/{id}/business-owners/active/count', function($id){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getActiveBusinessOwnersCountByAgent($id);
});

$router->get('/agent/{id}/business-owners/inactive/count', function($id){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getInactiveBusinessOwnersCountByAgent($id);
});

$router->get('/admin/business-owners/active/count', function(){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getAllActiveBusinessOwnersCount();
});

$router->get('/admin/business-owners/inactive/count', function(){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getAllInactiveBusinessOwnersCount();
});




// Agent
$router->post('/agent/login', function(){
    $authController = new AuthController();
    return $authController->agentLogin();
});

$router->post('/agent/register', function(){
    $authController = new AuthController();
    return $authController->registerAgent();
});

$router->get('/agents', function(){
    $agentController = new AgentController();
    return $agentController->getAgents();
});

$router->get('/agent/profile', function(){
    $profileController = new ProfileController();
    return $profileController->getAgentProfile();
});

$router->put('/agent/{id}/update-profile', function($id){
    $agentController = new AgentController();
    return $agentController->updateProfile($id);
});

$router->get('/agent/{id}/business-owners', function($id){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getBusinessOwnerByAgent($id);
});

$router->post('/agent/blacklist-business', function(){
    $agentController = new AgentController();
    return $agentController->createBlacklistBusiness();
});

$router->get('/agent/{id}/blacklist-businesses', function($id){
    $agentController = new AgentController();
    return $agentController->getBlacklistedbBusinesses($id);
});

$router->post('/demand-notice', function(){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->createDemandNotice();
});

$router->get('/admin/demand-notices', function(){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getAllDemandNotices();
});

$router->get('/revenue-head/amount/{business_owner_id}/{revenue_head_id}', function($business_owner_id, $revenue_head_id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getPaymentAmount($business_owner_id, $revenue_head_id);
});

$router->get('/agent/{id}/demand-notices', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getADemandNoticesByAgentId($id);
});

$router->get('/business-owner/{id}/demand-notices', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getADemandNoticesByBusinessOwnerId($id);
});

$router->get('/revenue-head-items', function(){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getRevenueHeadItems();
});

$router->get('/demand-notice/view/{demandNoticeNumber}', function($demandNoticeNumber){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getADemandNoticeByNoticeNumber($demandNoticeNumber);
});



// Amount count
$router->get('/admin/total-amount/paid', function(){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getTotalAmountPaid();
});

$router->get('/admin/total-amount/unpaid', function(){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getTotalAmountUnpaid();
});

$router->get('/agent/{id}/total-amount/paid', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getTotalAmountPaidByAgent($id);
});

$router->get('/agent/{id}/total-amount/unpaid', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getTotalAmountUnpaidByAgent($id);
});

$router->get('/business-owner/{id}/total-amount/paid', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getTotalAmountPaidByBusinessOwner($id);
});

$router->get('/business-owner/{id}/total-amount/unpaid', function($id){
    $demandNoticeController = new DemandNoticeController();
    return $demandNoticeController->getTotalAmountUnpaidByBusinessOwner($id);
});






// State Management
$router->get('/states', function(){
    $stateController = new StatesController();
    return $stateController->getStates();
});

$router->get('/state/lgas/{id}', function($id){
    $stateController = new StatesController();
    return $stateController->getLocalGovts($id);
});

// user payment history
$router->get('/business-owners/payment-history/{id}', function($id){
    $paymentController = new PaymentController();
    return $paymentController->getBusinessOwnersPaymentHistory($id);
});

// Agent payment history
$router->get('/agent/{id}/payment-history', function($id){
    $paymentController = new PaymentController();
    return $paymentController->getPaymentByAgentId($id);
});

// // Admin payment history
$router->get('/admin/payment-history', function(){
    $paymentController = new PaymentController();
    return $paymentController->getPaymentHistoty();
});




$router->get('/business-types', function(){
    $businesController = new BusinessController();
    return $businesController->getBusinessType();
});

$router->get('/admin/business-owner/{id}', function($id){
    $businessOwnerController = new BusinessOwnerController();
    return $businessOwnerController->getBusinessOwnerById($id);
});
// business-type/${businessTypeId}

$router->get('/business-type/{id}', function($id){
    $businesController = new BusinessController();
    return $businesController->getBusinessTypeById($id);
});

$router->get('/state/{id}', function($id){
    $stateController = new StatesController();
    return $stateController->getStateById($id);
});

$router->get('/lga/{id}', function($id){
    $stateController = new StatesController();
    return $stateController->getLocalGovtById($id);
});

$router->get('/agent/{id}', function($id){
    $agentController = new AgentController();
    return $agentController->getAgentById($id);
});


// protected route
// $router->group(['before' => 'auth'], function($router) {
//     $router->get('/users', function(){
//         // return 'This route responds to GET method at the path /users. It retrive the list of all users.';
//         $userController = new BusinessOwnersController();
//         return $userController->getUsers(); 
//     });
    
//     $router->get('/users/{id}', function($id){
//         // return 'This route responds to GET method at the path /users/{id}. It get the details of a single user.';
//         $userController = new BusinessOwnersController();
//         return $userController->getUserById($id);
//     });
// });

// public routes
// $router->get('/users', function(){
//     // return 'This route responds to GET method at the path /users. It retrive the list of all users.';
//     $userController = new BusinessOwnersController();
//     return $userController->getUsers(); 
// });




















// // Authentication and Authorization
// $router->post('/auth/register', function(){
//     //return 'This route responds to requests with the POST method at the path /auth/register. It register a new user.';
//     $authController = new AuthController();
//     return $authController->register();
// });

// $router->post('/auth/login', function(){
//     // return 'This route responds to requests with the POST method at the path /auth/login. It authenticate a user and return a token.';
//     $authController = new AuthController();
//     return $authController->login();
// });

// $router->post('/auth/logout', function(){
//     // return 'This route responds to requests with the POST method at the path /auth/logout. It logout a user.';
//     $authController = new AuthController();
//     return $authController->logout();
// });

// // Coffee Menu Management
// $router->get('/coffees', function(){
//     // return 'This route responds to GET method at the path /coffess. It retrive the list of all coffees';
//     $coffeeController = new CoffeesController();
//     return $coffeeController->getCoffees(); 
// });

// $router->get('/coffees/{id}', function($id){
//     // return 'This route responds to GET method at the path /coffess/{id}. It get the details of a single coffee product';
//     $coffeeController = new CoffeesController();
//     return $coffeeController->getCoffeeById($id);
// });

// $router->post('/admin/coffees', function(){
//     // return 'This route responds to POST method at the path /admin/coffees. It add a new coffee product to the menu. Requires Admin role.';
//     $coffeeController = new CoffeesController();
//     return $coffeeController->addCoffee();
// });

// $router->put('/admin/coffees/{id}', function($id){
//     // return 'This route responds to PUT method at the path /admin/coffees/{id}. It update an existing product. Requires admin role.';
//     $coffeeController = new CoffeesController();
//     return $coffeeController->updateCoffee($id);
// });

// $router->delete('/admin/coffees/{id}', function($id){
//     // return 'This route responds to DELETE method at the path /admin/coffees/{id}. It removes a coffee product from the menu. Requires admin role.';
//     $coffeeController = new CoffeesController();
//     return $coffeeController->deleteCoffee($id);
// });


// // Shopping Cart
// $router->get('/cart', function(){
//     // return 'This route responds to GET method at the path /cart. It retrive the current users shopping.';
//     $cartController = new CartController();
//     return $cartController->getCartItems();
// });
                                    
// $router->post('/cart/add', function(){
//     // return 'This route responds to POST method at the path /cart/add. It add a product to the cart.';
//     $cartController = new CartController();
//     return $cartController->addToCart();
// });

// $router->post('/cart/remove', function(){
//     // return 'This route responds to POST method at the path /cart/remove. It removes a product from the cart.';
//     $cartController = new CartController();
//     return $cartController->removeFromCart();
// });

// $router->post('/cart/checkout', function(){
//     // return 'This route responds to POST method at the path /cart/checkout. It proceeds to check and generate an order from the cart.';
//     $cartController = new CartController();
//     return $cartController->checkuot();
// });


// // Order Management
// $router->get('/orders', function(){
//     // return 'This route responds to GET method at the path /orders. It gets the list of orders from the logged-in user.';
//     $orderController = new OrderController();
//     return $orderController->getUserOrders();
// });

// $router->get('/orders/{id}', function($id){
//     // return 'This route responds to GET method at the path /orders/{id}. It gets the details of a specific order.';
//     $orderController = new OrderController();
//     return $orderController->getOrder($id);
// });

// $router->get('/admin/orders', function(){
//     // return 'This route responds to GET method at the path /admin/orders. It gets the list of all orders. Requires admin role.';
//     $orderController = new OrderController();
//     return $orderController->getAllOrder();
// });

// $router->put('/admin/orders/{id}', function($id){
//     // return 'This route responds to PUT method at the path /admin/orders/{id}. It update the status of an order. Requires admin role.';
//     $orderController = new OrderController();
//     return $orderController->updateOrder($id);
// });


// // Payment Integration
// $router->post('/payments/initiate', function(){
//     // return 'This route responds to POST method at the path /payments/initiate. It initiate a payment for an order.';
//     $paymentController = new PaymentController();
//     return $paymentController->initiatePayment();
// });

// $router->post('/payments/verify', function(){
//     // return 'This route responds to POST method at the path /payments/verify. It verify the payment status using the gateways API. Update the order status accordingly.';
//     $paymentController = new PaymentController();
//     return $paymentController->verifyPayment();
// });



# NB. You can cache the return value from $router->getData() so you don't have to create the routes each request - massive speed gains
$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());

$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $normalizedPath);

// Print out the value returned from the dispatched function
echo $response;

