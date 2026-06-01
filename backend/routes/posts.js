const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const Post    = require('../models/Post');
const protect = require('../middleware/auth');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all posts (with pagination)
router.get('/', protect, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort  = req.query.sort || 'createdAt'; // createdAt | likes | comments

    let sortObj = {};
    if (sort === 'likes')    sortObj = { likesCount: -1 };
    else if (sort === 'comments') sortObj = { commentsCount: -1 };
    else sortObj = { createdAt: -1 };

    const posts = await Post.aggregate([
      { $addFields: {
          likesCount:    { $size: '$likes' },
          commentsCount: { $size: '$comments' }
      }},
      { $sort: sortObj },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const total = await Post.countDocuments();
    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE post
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    if (!content && !image)
      return res.status(400).json({ message: 'Post must have text or image' });

    const post = await Post.create({
      username: req.user.username,
      content,
      image
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LIKE / UNLIKE post
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const username = req.user.username;
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      post.likes = post.likes.filter(u => u !== username); // unlike
    } else {
      post.likes.push(username); // like
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ username: req.user.username, text: req.body.text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;