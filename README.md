# Inventory Management System

Inventory Management System is a full-stack inventory management application built with **React, PHP, MySQL, and Docker**. The application provides a simple and efficient way to manage products, categories, suppliers, stock movements, and inventory reports through a modern web interface.

## Features

* User authentication with Login / Logout
* Dashboard with inventory statistics
* Product management

  * Create products
  * Edit products
  * Delete products
  * Search products
  * Filter by category
* Category management
* Supplier management

  * Create suppliers
  * Edit suppliers
  * Delete suppliers
* Stock management

  * Stock In
  * Stock Out
  * Stock movement history
* Inventory reports
* Print reports / Save reports as PDF
* Inventory value calculation
* Low stock and out-of-stock monitoring
* Responsive dashboard interface

## Tech Stack

### Frontend

* React
* JavaScript
* React Router
* CSS
* Vite

### Backend

* PHP
* PDO
* REST-style API

### Database

* MySQL

### Development

* Docker
* Docker Compose

## Project Structure

```text
InventorySystem/
│
├── backend/
│   └── public/
│       ├── index.php
│       ├── test-db.php
│       │
│       ├── dashboard.php
│       ├── reports.php
│       │
│       ├── products.php
│       ├── create-product.php
│       ├── update-product.php
│       └── delete-product.php
│       │
│       ├── categories.php
│       ├── add-category.php
│       ├── update-category.php
│       └── delete-category.php
│       │
│       ├── suppliers.php
│       ├── add-supplier.php
│       ├── update-supplier.php
│       └── delete-supplier.php
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   └── ProductForm.jsx
│       │
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Products.jsx
│       │   ├── Categories.jsx
│       │   ├── Stock.jsx
│       │   ├── Suppliers.jsx
│       │   └── Reports.jsx
│       │
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

Make sure you have installed:

* Docker
* Docker Compose
* Git

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd InventorySystem
```

Start the application with Docker Compose:

```bash
docker compose up -d
```

Check the running containers:

```bash
docker compose ps
```

## Application

The React frontend is available at:

```text
http://localhost:5173
```

The PHP backend API is available at:

```text
http://localhost:8080
```

## Authentication

The application includes a login system.

After successful authentication, users can access the inventory management dashboard.

## Main Pages

### Dashboard

The dashboard provides an overview of the inventory, including:

* Total products
* Total stock
* Inventory value
* Low stock products
* Out-of-stock products
* Recently added products

### Products

The Products page allows users to manage inventory products.

Users can:

* Add products
* Edit products
* Delete products
* Search products
* Filter products by category
* Check stock status

### Categories

The Categories page allows users to create and view product categories.

### Stock

The Stock page is used to manage inventory movements.

Users can record:

* Stock In
* Stock Out

The system keeps a history of stock movements.

### Suppliers

The Suppliers page provides complete supplier management.

Users can:

* Add suppliers
* Edit suppliers
* Delete suppliers
* View supplier information

### Reports

The Reports page provides inventory statistics and summaries, including:

* Inventory value
* Product statistics
* Top products
* Category summary
* Stock movement summary
* Low stock information

Reports can be printed or saved as PDF using the browser print functionality.

## API

The backend provides PHP API endpoints for communication with the React frontend.

### Products

```text
GET    /products.php
POST   /create-product.php
PUT    /update-product.php
DELETE /delete-product.php
```

### Categories

```text
GET    /categories.php
POST   /add-category.php
PUT    /update-category.php
DELETE /delete-category.php
```

### Suppliers

```text
GET    /suppliers.php
POST   /add-supplier.php
PUT    /update-supplier.php
DELETE /delete-supplier.php
```

### Dashboard & Reports

```text
GET /dashboard.php
GET /reports.php
```

## Database

The application uses MySQL as its database.

The main entities include:

* Users
* Products
* Categories
* Suppliers
* Stock Movements

The PHP backend communicates with MySQL using **PDO** and prepared statements.

## Docker

The application runs in a Dockerized environment using Docker Compose.

To start the project:

```bash
docker compose up -d
```

To stop the project:

```bash
docker compose down
```

To view container logs:

```bash
docker compose logs
```

## Author

**Zorica**

## License

This project was created for educational and portfolio purposes.

