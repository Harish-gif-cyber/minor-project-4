const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');
const postRoutes = require('./routes/postRoutes');
const requestLogger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();


app.use(cors());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// Swagger API Documentation (Bonus Feature)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Home route / API Information
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Blog REST API - Week 06 Minor Project',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      'Create Post': 'POST /posts',
      'Get All Posts': 'GET /posts',
      'Get Post by ID': 'GET /posts/:id',
      'Update Post': 'PUT /posts/:id',
      'Delete Post': 'DELETE /posts/:id'
    },
    sampleQueryParams: {
      search: 'GET /posts?search=Node',
      category: 'GET /posts?category=Technology',
      pagination: 'GET /posts?page=1&limit=2',
      sorting: 'GET /posts?sortBy=title&order=asc'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Blog Post Routes (Supports both /posts and /api/posts for convenience)
app.use('/posts', postRoutes);
app.use('/api/posts', postRoutes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
