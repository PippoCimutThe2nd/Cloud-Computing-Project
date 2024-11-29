const Post = require('../models/Post');
const PostAdapter = require('../adapters/Post');
const PostService = require('../services/PostService');

exports.createPost = async (req, res, next) => {
    await PostService.createPost(req.user.id, req.body);

    res.status(201).json({ message: "Post created" });
}

exports.getPosts = async (req, res) => {
    const filterTopic = req.query.topic ? { topic: req.query.topic } : null;
    const filterStatus = req.query.status ? { status: req.query.status } : null;
    const filterHighestInterests = req.query.highestInterest ? { topic: req.query.highestInterest } : null;

    const posts = await PostService.getPosts(filterTopic, filterStatus, filterHighestInterests)

    res.json(posts);

}
exports.getPost = async (req, res) => {
    const post = await PostService.getPost(req.params.id);

    res.json(post);
}
exports.updatePost = async (req, res) => {
    const post = await PostService.updatePost(req.params.id, req.body);

    res.json(post);
}
exports.deletePost = async (req, res) => {
    await PostService.deletePost(req.params.id);

    res.json({ message: 'Post deleted' });
}