<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
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

    if (empty($data['id'])) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Product ID is required.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        "DELETE FROM products WHERE id = :id"
    );

    $stmt->execute([
        ':id' => (int) $data['id']
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);

        echo json_encode([
            'error' => 'Product not found.'
        ]);

        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Product deleted successfully.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to delete product.'
    ]);
}
