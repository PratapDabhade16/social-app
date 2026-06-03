const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const Post    = require('../models/Post');
const protect = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'social-app-uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
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
          likesCount:    { $size: { $ifNull: [ '$likes', [] ] } },
          commentsCount: { $size: { $ifNull: [ '$comments', [] ] } }
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
    const image = req.file ? req.file.path : '';

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
    post.likes = post.likes || [];
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

    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    post.comments.push({ username: req.user.username, text: req.body.text.trim() });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;