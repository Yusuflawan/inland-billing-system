<?php

require_once 'vendor/autoload.php';

use Dotenv\Dotenv;

class Database
{

    private $dbHost;
    private $dbName;
    private $dbUser ;
    private $dbPassword;

    public $pdo;

    public function __construct()
    {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->load();

        $this->dbHost = $_ENV['DB_HOST'];
        $this->dbName = $_ENV['DB_NAME'];
        $this->dbUser = $_ENV['DB_USER'];
        $this->dbPassword = $_ENV['DB_PASSWORD'];
    }

    public function connect()
    {
        $dsn = 'mysql:host=' .$this->dbHost . ';dbname=' .$this->dbName;
        
        $options = array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        );
        
        try {
            $this->pdo = new PDO($dsn, $this->dbUser, $this->dbPassword, $options);
            return $this->pdo;

        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }

    }
}




// require_once 'vendor/autoload.php';

// use Dotenv\Dotenv;

// class Database
// {

//     private $dbHost = "localhost:3306";
//     private $dbName = "premisre_tax";
//     private $dbUser = "premisre_premisre";
//     private $dbPassword = "securePassword123";
//     // private $dbPassword = "xW28K#ly02Vu!A";

//     public $pdo;

//     public function __construct()
//     {
//         // $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
//         // $dotenv->load();

//         // $this->dbHost = $_ENV['DB_HOST'];
//         // $this->dbName = $_ENV['DB_NAME'];
//         // $this->dbUser = $_ENV['DB_USER'];
//         // $this->dbPassword = $_ENV['DB_PASSWORD'];
//     }

//     public function connect()
//     {
//         $dsn = 'mysql:host=' .$this->dbHost . ';dbname=' .$this->dbName;
        
//         $options = array(
//             PDO::ATTR_PERSISTENT => true,
//             PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
//         );
        
//         try {
//             $this->pdo = new PDO($dsn, $this->dbUser, $this->dbPassword, $options);
//             return $this->pdo;

//         } catch (PDOException $e) {
//             throw new Exception("Database connection failed: " . $e->getMessage());
//         }

//     }
// }


