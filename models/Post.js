const mongoose = require('mongoose');
const { topics } = require('../types');
const { type } = require('express/lib/response');

const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    dislikes: {
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            message: {
                type: String,
                required: true
            },
            registreatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    registreatedAt: {
        type: Date,
        default: Date.now
    },
    topic: {
        type: String,
        enum: topics
    },
    message: String,
    expiresAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Post', PostSchema);