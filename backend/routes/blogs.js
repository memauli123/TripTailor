// backend/routes/blogs.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username _id').sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/', auth, async (req, res) => {
    const { title, content, image, location } = req.body;
    try {
        const newBlog = new Blog({
            title, content, image, location, author: req.user.id
        });
        const blog = await newBlog.save();
        res.json(blog);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.put('/like/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ msg: 'Blog not found' });

        if (blog.likes.some(like => like.toString() === req.user.id)) {
            blog.likes = blog.likes.filter(like => like.toString() !== req.user.id);
        } else {
            blog.likes.unshift(req.user.id);
        }
        await blog.save();
        res.json(blog.likes);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ msg: 'Blog not found' });

        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Blog removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;