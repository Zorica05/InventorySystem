<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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

    if ($id <= 0) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Valid supplier ID is required.'
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
        DELETE FROM suppliers
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Supplier deleted successfully.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to delete supplier.'
    ]);
}
