# Project Setup
Project -> Laravel 12 project with a React frontend using Vite.

---

## 🧰 Requirements

Make sure the following are installed:

- PHP >= 8.2
- Composer
- Node.js >= 18
- NPM or Yarn
- MySQL or MariaDB
- Laravel CLI
- Git

## 🧪 Environment Setup

- cp .env.example .env

Then set your DB settings:

## 🧱 Install Backend & Frontend Dependencies

```
composer install
npm install
````
## 🔑 Generate App Key
```
php artisan key:generate
```


## 🗃️ Run Migrations and seeders
```
php artisan migrate --seed
```
## 🚀 Start Development Servers

In two separate terminals:
```
php artisan serve
npm run dev
```



# API Documentation


## Authentication

This API uses Laravel Sanctum for authentication. Protected routes require a valid bearer token.

### Authentication Header
```
Authorization: Bearer {your-token}
```

## Endpoints

### Authentication

#### Login
Authenticate a user and receive an access token.

**Endpoint:** `POST /login`  
**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### Products

#### Get All Products
Retrieve a list of all products.

**Endpoint:** `GET /products`  
**Access:** Public

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number for pagination |
| `per_page` | integer | No | Number of items per page (default: 15, max: 100) |
| `name` | string | No | Filter products by name |
| `min_price` | decimal | No | Minimum price filter |
| `max_price` | decimal | No | Maximum price filter |
| `categories` | array/string | No | Filter by categories (array or comma-separated string) |
| `category` | string | No | Filter by single category (backwards compatibility) |
| `search` | string | No | Search term to filter products by name |

---

### Orders

#### Create Order
Create a new order.

**Endpoint:** `POST /orders`  
**Access:** Protected (requires authentication)

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error - Server error |


- All requests should include `Accept: application/json` header
- All POST requests should include `Content-Type: application/json` header
