# Web Development – Week 06 Minor Project: Blog REST API

A robust, production-ready **Blog REST API with full CRUD operations** built with **Node.js** and **Express.js**, adhering strictly to RESTful architectural principles, standard HTTP status codes, structured JSON responses, modular architecture, and input validation.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Installation Steps](#-installation-steps)
- [Running the Application](#-running-the-application)
- [API Endpoints & Documentation](#-api-endpoints--documentation)
  - [1. Create Blog Post](#1-create-blog-post)
  - [2. Get All Blog Posts](#2-get-all-blog-posts)
  - [3. Get Single Blog Post by ID](#3-get-single-blog-post-by-id)
  - [4. Update Blog Post](#4-update-blog-post)
  - [5. Delete Blog Post](#5-delete-blog-post)
- [Testing Instructions](#-testing-instructions)
  - [Automated Testing (Jest & Supertest)](#automated-testing)
  - [Postman / Thunder Client / Insomnia](#postman--thunder-client--insomnia)
  - [Interactive Swagger UI](#interactive-swagger-ui)
- [Bonus Features](#-bonus-features)
- [License](#-license)

---

## 📖 Project Overview
This project satisfies all the requirements of the **Week 06 Minor Project: Blog REST API with CRUD Operations**. It demonstrates core backend engineering concepts:
- **RESTful API Design**: Predictable endpoints, standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), and appropriate status codes (`200`, `201`, `400`, `404`, `500`).
- **CRUD Operations**: Complete Create, Read, Update, and Delete operations on blog post resources.
- **Data Persistence**: Asynchronous JSON file-based storage (`data/posts.json`) that persists data across server restarts without external database setup.
- **Input Validation & Sanitization**: Comprehensive request body validation with descriptive error messages.
- **Centralized Error Handling**: Express middleware catching bad routes (404) and server errors (500).
- **Interactive Documentation**: Swagger UI documentation accessible directly in the browser at `/api-docs`.

---

## ✨ Features
1. **Create Blog Post (`POST /posts`)**: Adds a new post containing `title`, `content`, `author`, `category`, and auto-generates `id`, `createdAt`, and `updatedAt`.
2. **Get All Blog Posts (`GET /posts`)**: Retrieves all blog posts with support for **search**, **category/author filtering**, **sorting**, and **pagination**.
3. **Get Single Blog Post (`GET /posts/:id`)**: Retrieves a single post by its ID with 404 error handling for non-existent IDs.
4. **Update Blog Post (`PUT /posts/:id`)**: Updates one or more fields (`title`, `content`, `author`, `category`) and updates the `updatedAt` timestamp.
5. **Delete Blog Post (`DELETE /posts/:id`)**: Deletes a blog post by ID with proper success and error responses.
6. **Bonus Features**:
   - Pagination with metadata (`total`, `totalPages`, `currentPage`, `limit`).
   - Keyword search across `title` and `content`.
   - Category and author filtering.
   - Swagger / OpenAPI 3.0 interactive documentation.
   - 100% automated test suite with 16 comprehensive unit & integration tests.

---

## 🛠️ Technologies Used
- **Node.js** (v18+) – Server-side JavaScript runtime
- **Express.js** (v5) – Minimalist web framework for routing and middleware
- **CORS** – Cross-Origin Resource Sharing middleware
- **Swagger UI Express** – Interactive OpenAPI 3.0 API documentation
- **Morgan** – HTTP request logging
- **Jest & Supertest** – Automated testing framework and HTTP assertions

---

## 📁 Project Structure
The project strictly adheres to the recommended MVC modular architecture:

```text
minor-pro-6/
├── config/
│   └── swagger.js          # OpenAPI / Swagger specification
├── controllers/
│   └── postController.js   # Route handler business logic
├── data/
│   └── posts.json          # Persistent JSON storage & initial seed data
├── middleware/
│   ├── errorHandler.js     # 404 route and global 500 error handlers
│   ├── logger.js           # Custom HTTP request logger
│   └── validatePost.js     # Input validation middleware for POST & PUT
├── models/
│   └── postModel.js        # Data Access Layer (async file I/O operations)
├── routes/
│   └── postRoutes.js       # Express routing definitions
├── tests/
│   └── post.test.js        # Comprehensive Jest / Supertest test suite
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules for node_modules and logs
├── app.js                  # Express application setup and middleware chain
├── package.json            # Project dependencies and npm scripts
├── postman_collection.json # Ready-to-import Postman / Thunder Client collection
├── server.js               # Application entry point and HTTP server listener
└── README.md               # Detailed documentation
```

---

## 🚀 Installation Steps

1. **Clone or Download the Repository**:
   ```bash
   git clone <your-repo-url>
   cd "minor pro 6"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **(Optional) Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Defaults to `PORT=5000`)*

---

## ⚙️ Running the Application

### Development Mode (with automatic reload via nodemon):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Once started, the server is available at:
- **Base URL**: `http://localhost:5000`
- **Swagger Documentation**: `http://localhost:5000/api-docs`

---

## 📡 API Endpoints & Documentation

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API status & endpoint summary | `200 OK` |
| `GET` | `/health` | Server uptime and health check | `200 OK` |
| `POST` | `/posts` | Create a new blog post | `201 Created` / `400 Bad Request` |
| `GET` | `/posts` | Retrieve all posts (supports filters & pagination) | `200 OK` |
| `GET` | `/posts/:id` | Retrieve a specific blog post by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/posts/:id` | Update an existing blog post | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/posts/:id` | Delete a blog post by ID | `200 OK` / `404 Not Found` |

> *Note: Both `/posts` and `/api/posts` are supported for convenience.*

---

### Detailed Endpoint Specifications

#### 1. Create Blog Post
- **Endpoint**: `POST /posts`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "title": "Understanding Node.js Event Loop",
    "content": "The event loop is what allows Node.js to perform non-blocking I/O operations.",
    "author": "Alice Johnson",
    "category": "Technology"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Blog post created successfully",
    "data": {
      "id": "e6a17b2b-f350-482a-bc96-1cbf892d11e1",
      "title": "Understanding Node.js Event Loop",
      "content": "The event loop is what allows Node.js to perform non-blocking I/O operations.",
      "author": "Alice Johnson",
      "category": "Technology",
      "createdAt": "2026-10-22T17:35:00.000Z",
      "updatedAt": "2026-10-22T17:35:00.000Z"
    }
  }
  ```
- **Error Response (`400 Bad Request`)**:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      "Title is required and must be a non-empty string"
    ]
  }
  ```

---

#### 2. Get All Blog Posts
- **Endpoint**: `GET /posts`
- **Query Parameters (Optional)**:
  - `search` (string): Search text in title or content (e.g. `?search=Node`)
  - `category` (string): Filter by category (e.g. `?category=Technology`)
  - `author` (string): Filter by author (e.g. `?author=Alice`)
  - `sortBy` (string): Field to sort by (`createdAt`, `title`, default: `createdAt`)
  - `order` (string): `asc` or `desc` (default: `desc`)
  - `page` (number) & `limit` (number): Pagination (e.g. `?page=1&limit=2`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Blog posts retrieved successfully",
    "count": 3,
    "total": 3,
    "data": [
      {
        "id": "1",
        "title": "Getting Started with Node.js and Express",
        "content": "Node.js is an open-source, cross-platform JavaScript runtime environment...",
        "author": "Alice Johnson",
        "category": "Technology",
        "createdAt": "2026-03-01T10:00:00.000Z",
        "updatedAt": "2026-03-01T10:00:00.000Z"
      }
    ]
  }
  ```

---

#### 3. Get Single Blog Post by ID
- **Endpoint**: `GET /posts/:id`
- **Example**: `GET /posts/1`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Blog post retrieved successfully",
    "data": {
      "id": "1",
      "title": "Getting Started with Node.js and Express",
      "content": "Node.js is an open-source, cross-platform JavaScript runtime environment...",
      "author": "Alice Johnson",
      "category": "Technology",
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T10:00:00.000Z"
    }
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Blog post with ID '999' not found"
  }
  ```

---

#### 4. Update Blog Post
- **Endpoint**: `PUT /posts/:id`
- **Example**: `PUT /posts/1`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "title": "Getting Started with Node.js and Express (2026 Edition)",
    "category": "Backend Engineering"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Blog post updated successfully",
    "data": {
      "id": "1",
      "title": "Getting Started with Node.js and Express (2026 Edition)",
      "content": "Node.js is an open-source, cross-platform JavaScript runtime environment...",
      "author": "Alice Johnson",
      "category": "Backend Engineering",
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-10-22T17:40:00.000Z"
    }
  }
  ```

---

#### 5. Delete Blog Post
- **Endpoint**: `DELETE /posts/:id`
- **Example**: `DELETE /posts/1`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Blog post deleted successfully",
    "data": {
      "id": "1",
      "title": "Getting Started with Node.js and Express",
      "author": "Alice Johnson",
      "category": "Technology"
    }
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Blog post with ID '1' not found"
  }
  ```

---

## 🧪 Testing Instructions

### Automated Testing
The repository includes an extensive integration test suite verifying all CRUD endpoints, error states, and pagination using **Jest** and **Supertest**.

Run the tests using:
```bash
npm test
```

Expected result:
```text
PASS tests/post.test.js
  Blog REST API - CRUD Operations & Validation
    GET /posts - Retrieve Blog Posts
      √ should retrieve all blog posts with 200 OK
      √ should filter posts by category
      √ should search posts by keyword in title or content
      √ should paginate posts when page and limit query params are provided
    GET /posts/:id - Retrieve Single Blog Post
      √ should retrieve an existing blog post by ID
      √ should return 404 Not Found for a non-existent ID
    POST /posts - Create Blog Post
      √ should create a new blog post with valid inputs and return 201 Created
      √ should fail with 400 Bad Request when required fields are missing
      √ should fail with 400 Bad Request when fields are empty strings
    PUT /posts/:id - Update Blog Post
      √ should update an existing post with valid fields and return 200 OK
      √ should return 400 Bad Request if no fields are provided in update
      √ should return 404 Not Found when updating a non-existent post
    DELETE /posts/:id - Delete Blog Post
      √ should delete an existing blog post by ID and return 200 OK
      √ should return 404 Not Found when deleting a non-existent post
    General Error Handling
      √ should return 404 for undefined routes
      √ should serve home endpoint with API info

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
```

### Postman / Thunder Client / Insomnia
A pre-configured Postman Collection file `postman_collection.json` is included in the project root:
1. Open **Postman** (or **Thunder Client** / **Insomnia** in VS Code).
2. Click **Import** and choose [`postman_collection.json`](./postman_collection.json).
3. Start the server (`npm start`).
4. Execute the requests in the collection (`Create`, `Get All`, `Get Single`, `Update`, `Delete`, `Validation Error`, `Not Found`).

### Interactive Swagger UI
1. Start the server: `npm start`
2. Open your browser and navigate to:
   ```
   http://localhost:5000/api-docs
   ```
3. Test all endpoints interactively with the "Try it out" button.

---

## 🌟 Bonus Features Implemented
- [x] **JSON File Storage**: Persistent file-based data store with seamless asynchronous reads and writes.
- [x] **Pagination for Blog Posts**: Support for `?page=1&limit=2` returning total items, total pages, and current page.
- [x] **Search & Filter Functionality**: Keyword search (`?search=...`) and category filtering (`?category=...`).
- [x] **API Documentation using Swagger**: Full interactive OpenAPI 3.0 documentation at `/api-docs`.
- [x] **Automated Test Suite**: 16 integration tests covering status codes, validation, and CRUD operations.
- [x] **One-Click Postman Collection**: [`postman_collection.json`](./postman_collection.json) ready for immediate evaluation.

---

## 📄 License
This project is submitted as part of the Week 06 Minor Project curriculum.
