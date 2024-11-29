const express = require('express');
const router = express.Router();

const { body, header } = require('express-validator');
const Post = require('../models/Post');
const { actions } = require('../types');
const { validationResult } = require('express-validator');
const { mongoose } = require('mongoose');
const ActivityController = require('../controllers/ActivityController');

const postBody = [
    body('message').isLength({ min: 10 }).optional()
];

router.use("/:postId", async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    next();
});

router.use("/:postId", ActivityController.postLiveCheck);

router.post("/:postId/like", ActivityController.createLike);
router.delete("/:postId/like", ActivityController.deleteLike);

router.post("/:postId/dislike", ActivityController.createDislike);
router.delete("/:postId/dislike", ActivityController.deleteDislike);

router.post("/:postId/comment", postBody, ActivityController.createComment);
router.delete("/:postId/comment/:id", ActivityController.deleteComment);
router.patch("/:postId/comment/:id", postBody, ActivityController.updateComment);


module.exports = router;