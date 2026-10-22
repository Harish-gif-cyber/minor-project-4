const request = require('supertest');
const app = require('../app');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'posts.json');

describe('Blog REST API - CRUD Operations & Validation', () => {
  let backupData;

  // Backup data before running tests
  beforeAll(async () => {
    try {
      backupData = await fs.readFile(DATA_FILE, 'utf-8');
    } catch {
      backupData = '[]';
    }
  });

  // Restore original data after tests complete
  afterAll(async () => {
    if (backupData) {
      await fs.writeFile(DATA_FILE, backupData, 'utf-8');
    }
  });

  describe('GET /posts - Retrieve Blog Posts', () => {
    it('should retrieve all blog posts with 200 OK', async () => {
      const res = await request(app).get('/posts');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.count).toBe('number');
    });

    it('should filter posts by category', async () => {
      const res = await request(app).get('/posts?category=Technology');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach(post => {
        expect(post.category.toLowerCase()).toBe('technology');
      });
    });

    it('should search posts by keyword in title or content', async () => {
      const res = await request(app).get('/posts?search=Node');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should paginate posts when page and limit query params are provided', async () => {
      const res = await request(app).get('/posts?page=1&limit=2');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(2);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
      expect(res.body).toHaveProperty('totalPages');
    });
  });

  describe('GET /posts/:id - Retrieve Single Blog Post', () => {
    it('should retrieve an existing blog post by ID', async () => {
      const res = await request(app).get('/posts/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', '1');
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('content');
      expect(res.body.data).toHaveProperty('author');
      expect(res.body.data).toHaveProperty('category');
    });

    it('should return 404 Not Found for a non-existent ID', async () => {
      const res = await request(app).get('/posts/non-existent-id-999');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe('POST /posts - Create Blog Post', () => {
    it('should create a new blog post with valid inputs and return 201 Created', async () => {
      const newPost = {
        title: 'Mastering JavaScript Async/Await',
        content: 'Asynchronous programming is fundamental in JavaScript and Node.js backend development.',
        author: 'David Clark',
        category: 'JavaScript'
      };

      const res = await request(app)
        .post('/posts')
        .send(newPost);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/created successfully/i);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(newPost.title);
      expect(res.body.data.content).toBe(newPost.content);
      expect(res.body.data.author).toBe(newPost.author);
      expect(res.body.data.category).toBe(newPost.category);
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body.data).toHaveProperty('updatedAt');
    });

    it('should fail with 400 Bad Request when required fields are missing', async () => {
      const invalidPost = {
        title: 'Incomplete Post'
        // Missing content, author, category
      };

      const res = await request(app)
        .post('/posts')
        .send(invalidPost);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should fail with 400 Bad Request when fields are empty strings', async () => {
      const invalidPost = {
        title: '   ',
        content: '',
        author: ' ',
        category: 'Tech'
      };

      const res = await request(app)
        .post('/posts')
        .send(invalidPost);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('PUT /posts/:id - Update Blog Post', () => {
    let testPostId;

    beforeAll(async () => {
      // Create a temporary post to test update
      const created = await request(app)
        .post('/posts')
        .send({
          title: 'Temporary Post For Update Test',
          content: 'Initial content',
          author: 'Tester',
          category: 'Testing'
        });
      testPostId = created.body.data.id;
    });

    it('should update an existing post with valid fields and return 200 OK', async () => {
      const updates = {
        title: 'Updated Post Title',
        category: 'Updated Category'
      };

      const res = await request(app)
        .put(`/posts/${testPostId}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/updated successfully/i);
      expect(res.body.data.title).toBe(updates.title);
      expect(res.body.data.category).toBe(updates.category);
      expect(res.body.data.content).toBe('Initial content'); // Unchanged
    });

    it('should return 400 Bad Request if no fields are provided in update', async () => {
      const res = await request(app)
        .put(`/posts/${testPostId}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 Not Found when updating a non-existent post', async () => {
      const res = await request(app)
        .put('/posts/unknown-id-888')
        .send({ title: 'New Title' });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /posts/:id - Delete Blog Post', () => {
    let postToDeleteId;

    beforeAll(async () => {
      const created = await request(app)
        .post('/posts')
        .send({
          title: 'Post to be deleted',
          content: 'Content to be deleted',
          author: 'Delete Me',
          category: 'Temporary'
        });
      postToDeleteId = created.body.data.id;
    });

    it('should delete an existing blog post by ID and return 200 OK', async () => {
      const res = await request(app).delete(`/posts/${postToDeleteId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/deleted successfully/i);

      // Verify the post no longer exists
      const verifyRes = await request(app).get(`/posts/${postToDeleteId}`);
      expect(verifyRes.statusCode).toBe(404);
    });

    it('should return 404 Not Found when deleting a non-existent post', async () => {
      const res = await request(app).delete('/posts/unknown-id-777');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('General Error Handling', () => {
    it('should return 404 for undefined routes', async () => {
      const res = await request(app).get('/undefined-route-abc');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/route not found/i);
    });

    it('should serve home endpoint with API info', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('endpoints');
    });
  });
});
