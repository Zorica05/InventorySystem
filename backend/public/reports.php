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

    $summary = $pdo->query("
        SELECT
            COUNT(*) AS total_products,
            COALESCE(SUM(quantity), 0) AS total_stock,
            COALESCE(SUM(price * quantity), 0) AS total_value,
            SUM(
                CASE
                    WHEN quantity > 0
                    AND quantity <= min_quantity
                    THEN 1
                    ELSE 0
                END
            ) AS low_stock,
            SUM(
                CASE
                    WHEN quantity = 0
                    THEN 1
                    ELSE 0
                END
            ) AS out_of_stock
        FROM products
    ")->fetch(PDO::FETCH_ASSOC);

    $topProducts = $pdo->query("
        SELECT
            id,
            name,
            sku,
            category,
            price,
            quantity,
            (price * quantity) AS stock_value
        FROM products
        ORDER BY stock_value DESC
        LIMIT 10
    ")->fetchAll(PDO::FETCH_ASSOC);

    $categorySummary = $pdo->query("
        SELECT
            category,
            COUNT(*) AS product_count,
            COALESCE(SUM(quantity), 0) AS total_stock,
            COALESCE(SUM(price * quantity), 0) AS total_value
        FROM products
        GROUP BY category
        ORDER BY total_value DESC
    ")->fetchAll(PDO::FETCH_ASSOC);

    $movementSummary = $pdo->query("
        SELECT
            type,
            COUNT(*) AS movement_count,
            COALESCE(SUM(quantity), 0) AS total_quantity
        FROM stock_movements
        GROUP BY type
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'summary' => [
            'total_products' => (int) $summary['total_products'],
            'total_stock' => (int) $summary['total_stock'],
            'total_value' => (float) $summary['total_value'],
            'low_stock' => (int) $summary['low_stock'],
            'out_of_stock' => (int) $summary['out_of_stock']
        ],
        'top_products' => $topProducts,
        'category_summary' => $categorySummary,
        'movement_summary' => $movementSummary
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to load reports.'
    ]);
}
