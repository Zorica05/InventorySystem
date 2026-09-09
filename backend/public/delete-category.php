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

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Category ID is required.'
        ]);

        exit;
    }

    $id = (int) $data['id'];

    if ($id <= 0) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Invalid category ID.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT name
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
        "SELECT COUNT(*)
         FROM products
         WHERE category = :category"
    );

    $stmt->execute([
        ':category' => $category['name']
    ]);

    $productCount = (int) $stmt->fetchColumn();

    if ($productCount > 0) {
        http_response_code(409);

        echo json_encode([
            'error' => 'This category cannot be deleted because it is used by one or more products.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        "DELETE FROM categories
         WHERE id = :id"
    );

    $stmt->execute([
        ':id' => $id
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Category deleted successfully.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to delete category.'
    ]);
}
