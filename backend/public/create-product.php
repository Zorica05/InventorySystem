<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

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

    $data = json_decode(file_get_contents('php://input'), true);

    if (
        empty($data['name']) ||
        empty($data['sku']) ||
        empty($data['category'])
    ) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Name, SKU and category are required.'
        ]);

        exit;
    }

    $price = isset($data['price']) ? (float) $data['price'] : 0;
    $quantity = isset($data['quantity']) ? (int) $data['quantity'] : 0;
    $minQuantity = isset($data['min_quantity']) ? (int) $data['min_quantity'] : 0;

    $stmt = $pdo->prepare("
        INSERT INTO products
        (name, sku, category, price, quantity, min_quantity)
        VALUES
        (:name, :sku, :category, :price, :quantity, :min_quantity)
    ");

    $stmt->execute([
        ':name' => $data['name'],
        ':sku' => $data['sku'],
        ':category' => $data['category'],
        ':price' => $price,
        ':quantity' => $quantity,
        ':min_quantity' => $minQuantity
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Product created successfully.',
        'id' => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to create product.'
    ]);
}
