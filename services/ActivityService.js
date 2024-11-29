const Post = require('../models/Post');
exports.giveLike = async function giveLike(postId, userId) {
    return Post.findByIdAndUpdate(postId, {
        $addToSet: {
            "likes.users": userId
        }
    })
}

exports.removeLike = async function removeLike(postId, userId) {
    return Post.findByIdAndUpdate(postId, {
        $pull: {
            "likes.users": userId
        }
    })
}

exports.giveDislike = async function giveDislike(postId, userId) {
    return Post.findByIdAndUpdate(postId, {
        $addToSet: {
            "dislikes.users": userId
        }
    })
}

exports.removeDislike = async function removeDislike(postId, userId) {
    return Post.findByIdAndUpdate(postId, {
        $pull: {
            "dislikes.users": userId
        }
    })
}

exports.isThisMyPost = async function isThisMyPost(postId, userId) {
    return Post.findById(postId).then((post) => {
        if (post.owner.id.toString() === userId.toString()) {
            return true;
        } else {
            return false;
        }
    })
}

exports.setPostToExpired = async function setPostToExpired(postId) {
    return Post.findByIdAndUpdate(postId, {
        status: 'expired'
    })
}

exports.isPostLive = async function isPostLive(postId) {
    return await Post.findById(postId).then((post) => {
        if (!post) {
            return true;
        }
        if (post.status === 'live') {

            if (post.expiresAt > new Date()) {
                return true;
            }

            return this.setPostToExpired(postId);
        }
        return false;
    })
}

