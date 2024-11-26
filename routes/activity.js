const express = require('express');
const router = express.Router();

const { body, header } = require('express-validator');
const Post = require('../models/Post');
const { actions } = require('../types');
const { validationResult } = require('express-validator');
const { mongoose } = require('mongoose');

const postBody = [
    body('message').isLength({ min: 10 }).optional(),
    body("action").isIn(actions),
    // header('accessToken').isString().isLength({ min: 10 })
];

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post("/:postId/like", postBody, async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    const dislikesFoundResult = await Post.find({ "dislikes.users": req.user.id }).exec();
    const dislikesFound = dislikesFoundResult.length > 0;
    if (dislikesFound) {
        Post.findByIdAndUpdate(req.params.postId, {
            $pull: {
                "dislikes.users": req.user.id
            }
        }).then((post) => {
            res.json(post);
        }).catch((err) => {
            res.status(500).json({ error: err.message });
        });
    }

    Post.findByIdAndUpdate(req.params.postId, {
        $addToSet: {
            "likes.users": req.user.id
        }
    }).then((post) => {
        res.json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

router.post("/:postId/dislike", postBody,async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    const likesFoundResult = await Post.find({ "likes.users": req.user.id }).exec();
    const likesFound = likesFoundResult.length > 0;
    if (likesFound) {
        Post.findByIdAndUpdate(req.params.postId, {
            $pull: {
                "likes.users": req.user.id
            }
        }).then((post) => {
            res.json(post);
        }).catch((err) => {
            res.status(500).json({ error: err.message });
        });
    }

    Post.findByIdAndUpdate(req.params.postId, {
        $addToSet: {
            "dislikes.users": req.user.id
        }
    }).then((post) => {
        res.json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

router.post("/:postId/comment", postBody, (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    Post.findByIdAndUpdate(req.params.postId, {
        $push: {
            comments: {
                user: {
                    id: req.user.id,
                    username: req.user.username
                },
                textBody: req.body.textBody
            }
        }
    }, { new: true }).then((post) => {
        res.json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

router.delete("/:postId/comment/", (req, res) => {
    Post.findByIdAndUpdate(req.params.postId, {
        $pull: {
            comments: {
                user: {
                    id: req.user.id,
                    username: req.user.username
                }
            }
        }
    }, { new: true }).then((post) => {
        res.json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

router.post('/:postId/:activity', (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    Post.findByIdAndUpdate(req.params.postId, {
        $push: {
            activity: {
                user: {
                    id: req.user.id,
                    username: req.user.username
                },
                action: req.params.activity,
                textBody: req.body.textBody
            }
        }
    }, { new: true }).then((post) => {
        res.json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });

});

router.patch('/', (req, res) => {
    res.send('Hello World');
});

router.delete('/:id', (req, res) => {
    res.send('Hello World');
});

module.exports = router;