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

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    $stmt = $pdo->query("
        SELECT
            stock_movements.id,
            stock_movements.product_id,
            products.name AS product_name,
            products.sku,
            stock_movements.type,
            stock_movements.quantity,
            stock_movements.note,
            stock_movements.created_at
        FROM stock_movements
        INNER JOIN products
            ON products.id = stock_movements.product_id
        ORDER BY stock_movements.created_at DESC
    ");

    $movements = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($movements);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to load stock movements.'
    ]);
}
