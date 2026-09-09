<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');

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

    $stmt = $pdo->query("
        SELECT
            id,
            name,
            email,
            phone,
            address,
            created_at
        FROM suppliers
        ORDER BY name ASC
    ");

    $suppliers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($suppliers);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to load suppliers.'
    ]);
}
