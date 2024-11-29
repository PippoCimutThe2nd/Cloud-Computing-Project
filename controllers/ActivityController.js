const Post = require('../models/Post');
const { validationResult } = require('express-validator');
const ActivityService = require('../services/ActivityService');

exports.createLike = async (req, res) => {
    const result = await  ActivityService.isThisMyPost(req.params.postId, req.user.id)
    
    if (result) {
        return res.status(400).json({ error: 'You cannot like your own post' });
    }
    
    const giveLikeResult = await ActivityService.giveLike(req.params.postId, req.user.id);
    const removeDislikeResult = await ActivityService.removeDislike(req.params.postId, req.user.id);

    return res.json("Like added");
};

exports.deleteLike = async (req, res) => {
    const result = await  ActivityService.isThisMyPost(req.params.postId, req.user.id)
    if (result) {
        return res.status(400).json({ error: 'You cannot remove like from your own post' });
    }

    const removeLikeResult = await ActivityService.removeLike(req.params.postId, req.user.id);

    return res.json("Like removed");
}

exports.createDislike = async (req, res) => {
    const result = await ActivityService.isThisMyPost(req.params.postId, req.user.id)
    if (result) {
        return res.status(400).json({ error: 'You cannot dislike your own post' });
    }

    const giveDislikeResult = await ActivityService.giveDislike(req.params.postId, req.user.id);
    const removeLikeResult = await ActivityService.removeLike(req.params.postId, req.user.id);

    return res.json("Dislike added");
}

exports.deleteDislike = async (req, res) => {
    const result = await ActivityService.isThisMyPost(req.params.postId, req.user.id)
    if (result) {
        return res.status(400).json({ error: 'You cannot remove dislike from your own post' });
    }

    const removeDislikeResult = await ActivityService.removeDislike(req.params.postId, req.user.id);

    return res.json("Dislike removed");
}

exports.createComment = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    Post.findByIdAndUpdate(req.params.postId, {
        $push: {
            comments: {
                user: {
                    id: req.user.id
                },
                message: req.body.message
            }
        }
    }, { new: true }).then((post) => {
        res.json(post);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
}

exports.deleteComment = async (req, res) => {
    Post.findByIdAndUpdate({
        _id: req.params.postId,
        "comments._id": req.params.id
    },
        {
            $pull: {
                "comments": { _id: req.params.id }
            }
        }, { new: true }).then((post) => {
            res.json(post);
        })
}

exports.updateComment = async (req, res) => {
    Post.findOneAndUpdate({
        _id: req.params.postId,
        "comments._id": req.params.id
    }, {
        $set: {
            "comments.$.message": req.body.message
        }
    }, { new: true }).then((post) => {
        res.json(post);
    })
}

exports.postLiveCheck = async (req, res, next) => {
    console.log(req.params.postId)
    const result = await ActivityService.isPostLive(req.params.postId)
    if (!result) {
        return res.status(400).json({ error: 'Post is not live' });
    }
    next();
}

