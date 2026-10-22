const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const {
  validateCreatePost,
  validateUpdatePost
} = require('../middleware/validatePost');

/**
 * @route   POST /posts
 * @desc    Create a new blog post
 */
router.post('/', validateCreatePost, PostController.createPost);

/**
 * @route   GET /posts
 * @desc    Retrieve all blog posts (with search, filter, pagination support)
 */
router.get('/', PostController.getAllPosts);

/**
 * @route   GET /posts/:id
 * @desc    Retrieve a specific blog post by ID
 */
router.get('/:id', PostController.getPostById);

/**
 * @route   PUT /posts/:id
 * @desc    Update an existing blog post by ID
 */
router.put('/:id', validateUpdatePost, PostController.updatePost);

/**
 * @route   DELETE /posts/:id
 * @desc    Delete a blog post by ID
 */
router.delete('/:id', PostController.deletePost);

module.exports = router;
