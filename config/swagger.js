const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Blog REST API',
    version: '1.0.0',
    description:
      'Week 06 Minor Project: A RESTful API built with Node.js and Express.js supporting complete CRUD operations on blog posts with validation and persistent JSON storage.',
    contact: {
      name: 'API Support'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server'
    }
  ],
  tags: [
    {
      name: 'Posts',
      description: 'Blog post management operations'
    }
  ],
  paths: {
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Retrieve all blog posts',
        description: 'Returns a list of all blog posts with optional search, category/author filtering, and pagination.',
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Search keyword matching title or content',
            schema: { type: 'string' }
          },
          {
            name: 'category',
            in: 'query',
            description: 'Filter posts by category',
            schema: { type: 'string' }
          },
          {
            name: 'author',
            in: 'query',
            description: 'Filter posts by author name',
            schema: { type: 'string' }
          },
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of posts per page',
            schema: { type: 'integer', default: 10 }
          },
          {
            name: 'sortBy',
            in: 'query',
            description: 'Field to sort by (e.g. createdAt, title)',
            schema: { type: 'string', default: 'createdAt' }
          },
          {
            name: 'order',
            in: 'query',
            description: 'Sort direction (asc or desc)',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
          }
        ],
        responses: {
          200: {
            description: 'List of blog posts retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Blog posts retrieved successfully' },
                    count: { type: 'integer', example: 3 },
                    total: { type: 'integer', example: 3 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/BlogPost' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Posts'],
        summary: 'Create a new blog post',
        description: 'Creates a new post with title, content, author, and category.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePostInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Blog post created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Blog post created successfully' },
                    data: { $ref: '#/components/schemas/BlogPost' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed - Missing or invalid required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' }
              }
            }
          }
        }
      }
    },
    '/posts/{id}': {
      get: {
        tags: ['Posts'],
        summary: 'Retrieve a single blog post by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Unique ID of the blog post',
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Blog post retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Blog post retrieved successfully' },
                    data: { $ref: '#/components/schemas/BlogPost' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Blog post not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Posts'],
        summary: 'Update an existing blog post by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Unique ID of the blog post to update',
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdatePostInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Blog post updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Blog post updated successfully' },
                    data: { $ref: '#/components/schemas/BlogPost' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed - Invalid update payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' }
              }
            }
          },
          404: {
            description: 'Blog post not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Posts'],
        summary: 'Delete a blog post by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Unique ID of the blog post to delete',
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Blog post deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Blog post deleted successfully' },
                    data: { $ref: '#/components/schemas/BlogPost' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Blog post not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      BlogPost: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          title: { type: 'string', example: 'Getting Started with Node.js and Express' },
          content: { type: 'string', example: 'Node.js is an open-source JavaScript runtime environment...' },
          author: { type: 'string', example: 'Alice Johnson' },
          category: { type: 'string', example: 'Technology' },
          createdAt: { type: 'string', format: 'date-time', example: '2026-03-01T10:00:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2026-03-01T10:00:00.000Z' }
        }
      },
      CreatePostInput: {
        type: 'object',
        required: ['title', 'content', 'author', 'category'],
        properties: {
          title: { type: 'string', example: 'Modern Backend Architecture' },
          content: { type: 'string', example: 'Exploring modular route handlers and error middleware in Express.' },
          author: { type: 'string', example: 'John Doe' },
          category: { type: 'string', example: 'Development' }
        }
      },
      UpdatePostInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Updated Title' },
          content: { type: 'string', example: 'Updated content here...' },
          author: { type: 'string', example: 'Jane Doe' },
          category: { type: 'string', example: 'Tutorial' }
        }
      },
      ValidationError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: { type: 'string' },
            example: ['Title is required and must be a non-empty string']
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Blog post with ID \'999\' not found' }
        }
      }
    }
  }
};

module.exports = swaggerDefinition;
