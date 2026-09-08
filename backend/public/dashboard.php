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

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Total products
    $totalProducts = $pdo->query(
        "SELECT COUNT(*) FROM products"
    )->fetchColumn();

    // Total stock
    $totalStock = $pdo->query(
        "SELECT COALESCE(SUM(quantity), 0) FROM products"
    )->fetchColumn();

    // Total inventory value
    $totalValue = $pdo->query(
        "SELECT COALESCE(SUM(price * quantity), 0) FROM products"
    )->fetchColumn();

    // Low stock count
    $lowStock = $pdo->query(
        "SELECT COUNT(*)
         FROM products
         WHERE quantity > 0
         AND quantity <= min_quantity"
    )->fetchColumn();

    // Out of stock count
    $outOfStock = $pdo->query(
        "SELECT COUNT(*)
         FROM products
         WHERE quantity = 0"
    )->fetchColumn();

    // Recent products
    $recentProducts = $pdo->query(
        "SELECT id, name, sku, category, price, quantity
         FROM products
         ORDER BY id DESC
         LIMIT 5"
    )->fetchAll(PDO::FETCH_ASSOC);

    // Low stock products
    $lowStockProducts = $pdo->query(
        "SELECT id, name, sku, quantity, min_quantity
         FROM products
         WHERE quantity > 0
         AND quantity <= min_quantity
         ORDER BY quantity ASC
         LIMIT 5"
    )->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'total_products' => (int) $totalProducts,
        'total_stock' => (int) $totalStock,
        'total_value' => (float) $totalValue,
        'low_stock' => (int) $lowStock,
        'out_of_stock' => (int) $outOfStock,
        'recent_products' => $recentProducts,
        'low_stock_products' => $lowStockProducts
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to load dashboard data.'
    ]);
}
