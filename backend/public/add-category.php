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

$input = json_decode(file_get_contents('php://input'), true);

$name = trim($input['name'] ?? '');

if ($name === '') {
    http_response_code(400);

    echo json_encode([
        'error' => 'Category name is required.'
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

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare(
        "INSERT INTO categories (name)
         VALUES (:name)"
    );

    $stmt->execute([
        'name' => $name
    ]);

    echo json_encode([
        'success' => true,
        'id' => $pdo->lastInsertId(),
        'name' => $name
    ]);

} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        http_response_code(409);

        echo json_encode([
            'error' => 'Category already exists.'
        ]);

        exit;
    }

    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to add category.'
    ]);
}
