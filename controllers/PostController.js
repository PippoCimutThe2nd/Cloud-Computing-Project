const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    Post.create({
        title: req.body.title,
        topic: req.body.topic,
        message: req.body.message,
        owner: {
            id: req.user.id,
            username: req.user.username
        },
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }).then((post) => {
        res.status(201).json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    })
}

exports.getPosts = async (req, res) => {
    const filterTopic = req.query.topic ? { topic: req.query.topic } : {};
    Post.find().then((posts) => {
        res.json(posts);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
}
exports.getPost = async (req, res) => {
    Post.findById(req.params.id).then((post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
}
exports.updatePost = async (req, res) => {
    Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        topic: req.body.topic,
        message: req.body.message
    }, { new: true }).then((post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
}
exports.deletePost = async (req, res) => {
    Post.findByIdAndDelete(req.params.id).then((post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(204).send();
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
}