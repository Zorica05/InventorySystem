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

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $username = trim($data['username'] ?? '');
    $userPassword = $data['password'] ?? '';

    if ($username === '' || $userPassword === '') {
        http_response_code(400);

        echo json_encode([
            'error' => 'Username and password are required.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT id, username, password
         FROM users
         WHERE username = :username
         LIMIT 1"
    );

    $stmt->execute([
        ':username' => $username
    ]);

    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userData || $userPassword !== $userData['password']) {
        http_response_code(401);

        echo json_encode([
            'error' => 'Invalid username or password.'
        ]);

        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Login successful.',
        'user' => [
            'id' => (int) $userData['id'],
            'username' => $userData['username']
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Login failed.'
    ]);
}
