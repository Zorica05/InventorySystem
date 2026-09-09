<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'error' => 'Method not allowed.'
    ]);

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

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $productId = isset($data['product_id'])
        ? (int) $data['product_id']
        : 0;

    $type = $data['type'] ?? '';

    $quantity = isset($data['quantity'])
        ? (int) $data['quantity']
        : 0;

    $note = trim($data['note'] ?? '');

    if ($productId <= 0) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Valid product is required.'
        ]);

        exit;
    }

    if (!in_array($type, ['in', 'out'], true)) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Stock type must be in or out.'
        ]);

        exit;
    }

    if ($quantity <= 0) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Quantity must be greater than zero.'
        ]);

        exit;
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT id, quantity
        FROM products
        WHERE id = :id
        FOR UPDATE
    ");

    $stmt->execute([
        ':id' => $productId
    ]);

    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        $pdo->rollBack();

        http_response_code(404);

        echo json_encode([
            'error' => 'Product not found.'
        ]);

        exit;
    }

    $currentQuantity = (int) $product['quantity'];

    if ($type === 'out') {
        if ($quantity > $currentQuantity) {
            $pdo->rollBack();

            http_response_code(400);

            echo json_encode([
                'error' => 'Not enough stock available.'
            ]);

            exit;
        }

        $newQuantity = $currentQuantity - $quantity;
    } else {
        $newQuantity = $currentQuantity + $quantity;
    }

    $update = $pdo->prepare("
        UPDATE products
        SET quantity = :quantity
        WHERE id = :id
    ");

    $update->execute([
        ':quantity' => $newQuantity,
        ':id' => $productId
    ]);

    $movement = $pdo->prepare("
        INSERT INTO stock_movements
        (product_id, type, quantity, note)
        VALUES
        (:product_id, :type, :quantity, :note)
    ");

    $movement->execute([
        ':product_id' => $productId,
        ':type' => $type,
        ':quantity' => $quantity,
        ':note' => $note !== '' ? $note : null
    ]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Stock updated successfully.',
        'product_id' => $productId,
        'type' => $type,
        'quantity' => $quantity,
        'new_quantity' => $newQuantity
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to update stock.'
    ]);
}
