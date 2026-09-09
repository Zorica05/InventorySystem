<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

    $id = isset($data['id'])
        ? (int) $data['id']
        : 0;

    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $address = trim($data['address'] ?? '');

    if ($id <= 0) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Valid supplier ID is required.'
        ]);

        exit;
    }

    if ($name === '') {
        http_response_code(400);

        echo json_encode([
            'error' => 'Supplier name is required.'
        ]);

        exit;
    }

    if (
        $email !== '' &&
        !filter_var($email, FILTER_VALIDATE_EMAIL)
    ) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Invalid email address.'
        ]);

        exit;
    }

    $check = $pdo->prepare("
        SELECT id
        FROM suppliers
        WHERE id = :id
    ");

    $check->execute([
        ':id' => $id
    ]);

    if (!$check->fetch()) {
        http_response_code(404);

        echo json_encode([
            'error' => 'Supplier not found.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE suppliers
        SET
            name = :name,
            email = :email,
            phone = :phone,
            address = :address
        WHERE id = :id
    ");

    $stmt->execute([
        ':name' => $name,
        ':email' => $email !== '' ? $email : null,
        ':phone' => $phone !== '' ? $phone : null,
        ':address' => $address !== '' ? $address : null,
        ':id' => $id
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Supplier updated successfully.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to update supplier.'
    ]);
}
