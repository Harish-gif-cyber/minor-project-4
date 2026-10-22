const PostModel = require('../models/postModel');

/**
 * Controller for managing Blog Posts CRUD operations.
 */
class PostController {
  /**
   * @desc    Create a new blog post
   * @route   POST /posts
   * @access  Public
   */
  static async createPost(req, res, next) {
    try {
      const { title, content, author, category } = req.body;

      const newPost = await PostModel.create({
        title,
        content,
        author,
        category
      });

      return res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: newPost
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Retrieve all blog posts (supports search, filtering, sorting, pagination)
   * @route   GET /posts
   * @access  Public
   */
  static async getAllPosts(req, res, next) {
    try {
      const {
        search,
        category,
        author,
        sortBy,
        order,
        page,
        limit
      } = req.query;

      const result = await PostModel.findAll({
        search,
        category,
        author,
        sortBy,
        order,
        page,
        limit
      });

      const response = {
        success: true,
        message: 'Blog posts retrieved successfully',
        count: result.posts.length,
        total: result.total,
        data: result.posts
      };

      if (result.page !== undefined) {
        response.page = result.page;
        response.limit = result.limit;
        response.totalPages = result.totalPages;
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Retrieve a single blog post by ID
   * @route   GET /posts/:id
   * @access  Public
   */
  static async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await PostModel.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: `Blog post with ID '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Blog post retrieved successfully',
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Update an existing blog post by ID
   * @route   PUT /posts/:id
   * @access  Public
   */
  static async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, author, category } = req.body;

      const updatedPost = await PostModel.update(id, {
        title,
        content,
        author,
        category
      });

      if (!updatedPost) {
        return res.status(404).json({
          success: false,
          message: `Blog post with ID '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        data: updatedPost
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Delete a blog post by ID
   * @route   DELETE /posts/:id
   * @access  Public
   */
  static async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const deletedPost = await PostModel.delete(id);

      if (!deletedPost) {
        return res.status(404).json({
          success: false,
          message: `Blog post with ID '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully',
        data: deletedPost
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PostController;
