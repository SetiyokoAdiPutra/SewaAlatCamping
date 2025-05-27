<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

$apiIndex = array_search('api', $uri);
$route = isset($uri[$apiIndex + 1]) ? $uri[$apiIndex + 1] : null;

switch ($route) {
    case 'barang':
        require __DIR__ . '/api/DataBarang.php';
        break;
    case 'pelanggan':
        require __DIR__ . '/api/DataPelanggan.php';
        break;
    case 'login':
        require __DIR__ . '/api/Login.php';
        break;
    case 'register':
        require __DIR__ . '/api/Register.php';
        break;
    case 'transaksi':
        require __DIR__ . '/api/Transaksi.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}