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
            id: {
                type: Number,
                auto: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            message: String,
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
    status: {
        type: String,
        enum: ['live', 'expired'],
        default: 'live'
    },
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

module.exports = mongoose.model('Post', PostSchema);