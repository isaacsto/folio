const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

// Create Post
router.post('/', protect, async (req, res) => {
  const { imageUrl, caption } = req.body;

  const post = new Post({
    user: req.user.id,
    imageUrl,
    caption,
  });

  await post.save();
  res.json(post);
});

// Like Post Privately
router.post('/:id/like', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.user.id)) {
    post.likes.push(req.user.id);
  } else {
    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
  }
  await post.save();
  res.json({ message: 'Like updated' });
});

// Comment
router.post('/:id/comment', protect, async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);

  post.comments.push({ user: req.user.id, text });
  await post.save();
  res.json(post.comments);
});

module.exports = router;
