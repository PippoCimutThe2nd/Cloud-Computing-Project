const CommentAdapter = require('./Comment');
const postStatus = require('../types').postStatus;

exports.fromDatabaseRecord = (record) => {
    return {
        id: record._id,
        registreatedAt: record.registreatedAt,
        likes: record.likes.users.length,
        dislikes: record.dislikes.users.length,
        comments: record.comments.map(CommentAdapter.fromDatabaseRecord),
        topic: record.topic,
        message: record.message,
        expiresAt: record.expiresAt,
        status: record.expiresAt > new Date() ? postStatus.live : postStatus.expired,
        owner: {
            id: record.owner._id? record.owner._id : record.owner.id ? record.owner.id : null,
            username: record.owner.username? record.owner.username : null
        }
    }
}