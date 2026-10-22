const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, '..', 'data', 'posts.json');

/**
 * Helper to ensure the data directory and posts.json file exist.
 */
async function ensureFileExists() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Read all posts directly from the JSON file.
 * @returns {Promise<Array>} Array of blog posts
 */
async function readData() {
  await ensureFileExists();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

/**
 * Write posts to the JSON file.
 * @param {Array} posts - Array of blog post objects
 */
async function writeData(posts) {
  await ensureFileExists();
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

class PostModel {
  /**
   * Retrieve posts with optional filtering, search, sorting, and pagination.
   * @param {Object} options Query parameters
   * @returns {Promise<{ posts: Array, total: number, page?: number, limit?: number, totalPages?: number }>}
   */
  static async findAll(options = {}) {
    let posts = await readData();

    const {
      search,
      category,
      author,
      sortBy = 'createdAt',
      order = 'desc',
      page,
      limit
    } = options;

    // Filter by search term in title or content
    if (search && typeof search === 'string') {
      const q = search.trim().toLowerCase();
      posts = posts.filter(
        post =>
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category && typeof category === 'string') {
      const cat = category.trim().toLowerCase();
      posts = posts.filter(post => post.category.toLowerCase() === cat);
    }

    // Filter by author
    if (author && typeof author === 'string') {
      const auth = author.trim().toLowerCase();
      posts = posts.filter(post => post.author.toLowerCase().includes(auth));
    }

    // Sort posts
    posts.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const total = posts.length;

    // Pagination
    if (page && limit) {
      const parsedPage = Math.max(1, parseInt(page, 10) || 1);
      const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
      const startIndex = (parsedPage - 1) * parsedLimit;
      const paginatedPosts = posts.slice(startIndex, startIndex + parsedLimit);
      const totalPages = Math.ceil(total / parsedLimit);

      return {
        posts: paginatedPosts,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages
      };
    }

    return {
      posts,
      total
    };
  }

  /**
   * Retrieve a single post by ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const posts = await readData();
    const post = posts.find(p => String(p.id) === String(id));
    return post || null;
  }

  /**
   * Create a new post.
   * @param {Object} postData { title, content, author, category }
   * @returns {Promise<Object>} Created post
   */
  static async create(postData) {
    const posts = await readData();
    const now = new Date().toISOString();

    const newPost = {
      id: crypto.randomUUID(),
      title: postData.title.trim(),
      content: postData.content.trim(),
      author: postData.author.trim(),
      category: postData.category.trim(),
      createdAt: now,
      updatedAt: now
    };

    posts.unshift(newPost);
    await writeData(posts);
    return newPost;
  }

  /**
   * Update an existing post.
   * @param {string} id
   * @param {Object} updateData Fields to update
   * @returns {Promise<Object|null>} Updated post or null
   */
  static async update(id, updateData) {
    const posts = await readData();
    const index = posts.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      return null;
    }

    const currentPost = posts[index];
    const updatedPost = {
      ...currentPost,
      title: updateData.title !== undefined ? updateData.title.trim() : currentPost.title,
      content: updateData.content !== undefined ? updateData.content.trim() : currentPost.content,
      author: updateData.author !== undefined ? updateData.author.trim() : currentPost.author,
      category: updateData.category !== undefined ? updateData.category.trim() : currentPost.category,
      updatedAt: new Date().toISOString()
    };

    posts[index] = updatedPost;
    await writeData(posts);
    return updatedPost;
  }

  /**
   * Delete a post by ID.
   * @param {string} id
   * @returns {Promise<Object|null>} The deleted post or null
   */
  static async delete(id) {
    const posts = await readData();
    const index = posts.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      return null;
    }

    const [deletedPost] = posts.splice(index, 1);
    await writeData(posts);
    return deletedPost;
  }
}

module.exports = PostModel;
