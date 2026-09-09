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

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    if (
        !isset($data['id']) ||
        !isset($data['name'])
    ) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Category ID and name are required.'
        ]);

        exit;
    }

    $id = (int) $data['id'];
    $name = trim($data['name']);

    if ($id <= 0 || $name === '') {
        http_response_code(400);

        echo json_encode([
            'error' => 'Valid category ID and name are required.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT id
         FROM categories
         WHERE id = :id"
    );

    $stmt->execute([
        ':id' => $id
    ]);

    $category = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$category) {
        http_response_code(404);

        echo json_encode([
            'error' => 'Category not found.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT id
         FROM categories
         WHERE name = :name
         AND id != :id"
    );

    $stmt->execute([
        ':name' => $name,
        ':id' => $id
    ]);

    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        http_response_code(409);

        echo json_encode([
            'error' => 'A category with this name already exists.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        "UPDATE categories
         SET name = :name
         WHERE id = :id"
    );

    $stmt->execute([
        ':name' => $name,
        ':id' => $id
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Category updated successfully.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to update category.'
    ]);
}
