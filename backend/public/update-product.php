<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
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
        empty($data['id']) ||
        empty($data['name']) ||
        empty($data['sku']) ||
        empty($data['category'])
    ) {
        http_response_code(400);

        echo json_encode([
            'error' => 'ID, name, SKU and category are required.'
        ]);

        exit;
    }

    $price = isset($data['price']) ? (float) $data['price'] : 0;
    $quantity = isset($data['quantity']) ? (int) $data['quantity'] : 0;
    $minQuantity = isset($data['min_quantity'])
        ? (int) $data['min_quantity']
        : 0;

    $stmt = $pdo->prepare("
        UPDATE products
        SET
            name = :name,
            sku = :sku,
            category = :category,
            price = :price,
            quantity = :quantity,
            min_quantity = :min_quantity
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => (int) $data['id'],
        ':name' => $data['name'],
        ':sku' => $data['sku'],
        ':category' => $data['category'],
        ':price' => $price,
        ':quantity' => $quantity,
        ':min_quantity' => $minQuantity
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Product updated successfully.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to update product.'
    ]);
}
