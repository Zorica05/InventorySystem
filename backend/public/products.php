<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');

$host = 'mysql';
$db = 'inventory';
$user = 'inventory_user';
$password = 'inventory_password';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $password
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("
        SELECT
            id,
            name,
            sku,
            category,
            price,
            quantity,
            min_quantity,
            created_at
        FROM products
        ORDER BY id DESC
    ");

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Database connection failed'
    ]);
}
