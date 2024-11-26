const express = require('express');
const router = express.Router();
const { body, header } = require('express-validator');
const { validationResult } = require('express-validator');
const { actions, topics } = require('../types');
const Post = require('../models/Post');
const { mongoose } = require('mongoose');

const postBody = [
    body('title').isLength({ min: 5 }),
    body('topic').isIn(topics),
    body('message').isLength({ min: 10 }),
    // header('accessToken').isString().isLength({ min: 10 })
];

router.get('/', (req, res) => {
    Post.find().then((posts) => {
        res.json(posts);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id).then((post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

router.post('/', postBody, (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() })
    };

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

});

router.patch('/:id', (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() })
    };

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
});

router.delete('/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id).then((post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(204).send();
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

module.exports = router;