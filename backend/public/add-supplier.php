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

    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $address = trim($data['address'] ?? '');

    if ($name === '') {
        http_response_code(400);

        echo json_encode([
            'error' => 'Supplier name is required.'
        ]);

        exit;
    }

    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Invalid email address.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO suppliers
        (name, email, phone, address)
        VALUES
        (:name, :email, :phone, :address)
    ");

    $stmt->execute([
        ':name' => $name,
        ':email' => $email !== '' ? $email : null,
        ':phone' => $phone !== '' ? $phone : null,
        ':address' => $address !== '' ? $address : null
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Supplier added successfully.',
        'id' => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to add supplier.'
    ]);
}
