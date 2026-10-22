/**
 * Middleware for validating incoming blog post request bodies.
 */

/**
 * Validate input fields when creating a new blog post.
 * Required fields: title, content, author (or authorName), category
 */
const validateCreatePost = (req, res, next) => {
  const { title, content, category } = req.body;
  const author = req.body.author || req.body.authorName;

  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('Content is required and must be a non-empty string');
  }

  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    errors.push('Author is required and must be a non-empty string');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Normalize author in req.body
  req.body.author = author.trim();
  req.body.title = title.trim();
  req.body.content = content.trim();
  req.body.category = category.trim();

  next();
};

/**
 * Validate input fields when updating an existing blog post.
 * At least one field (title, content, author, category) must be provided.
 */
const validateUpdatePost = (req, res, next) => {
  const { title, content, category } = req.body;
  const author = req.body.author !== undefined ? req.body.author : req.body.authorName;

  const errors = [];

  // Check if at least one field is provided
  if (
    title === undefined &&
    content === undefined &&
    author === undefined &&
    category === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: ['At least one field (title, content, author, category) must be provided for update']
    });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    errors.push('Title must be a non-empty string if provided');
  }

  if (content !== undefined && (typeof content !== 'string' || content.trim().length === 0)) {
    errors.push('Content must be a non-empty string if provided');
  }

  if (author !== undefined && (typeof author !== 'string' || author.trim().length === 0)) {
    errors.push('Author must be a non-empty string if provided');
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim().length === 0)) {
    errors.push('Category must be a non-empty string if provided');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  if (author !== undefined) {
    req.body.author = author.trim();
  }

  next();
};

module.exports = {
  validateCreatePost,
  validateUpdatePost
};
