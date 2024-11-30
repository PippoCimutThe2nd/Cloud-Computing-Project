const Post = require('../models/Post');
const PostAdapter = require('../adapters/Post');

exports.createPost = async (userId, post) => {
    return await Post.create({
        title: post.title,
        topic: post.topic,
        message: post.message,
        owner: {
            id: userId
        },
        expiresAt: new Date(new Date().getTime() + 5 * 60 * 1000)
    })

}

exports.getPosts = async (
    topic = null,
    postStatus = null,
    highestInterest = null
) => {
    const filterTopic = topic ? { topic: topic } : null;
    const filterStatus = postStatus ? { status: postStatus } : null;
    const filterHighestInterests = highestInterest ? { topic: highestInterest } : null;

    const pipeline = [
        {
            $match: {
                _id: { $exists: 1 }
            }
        }
    ]

    if (filterTopic) {
        pipeline.push({ $match: filterTopic });
    }
    if (filterStatus) {
        pipeline.push({ $match: filterStatus });
    }
    if (filterHighestInterests) {
        pipeline.push({
            $addFields: {
                totalInterests: {
                    $add: [
                        { $size: "$likes.users" },
                        { $size: "$dislikes.users" }
                    ]
                }
            }
        });
        pipeline.push({ $sort: { totalInterests: -1 } });
        pipeline.push({ $limit: 1 });
    }

    const posts = Post.aggregate(pipeline)

    return posts.map(PostAdapter.fromDatabaseRecord);

}

exports.getPost = async (id) => {
    const post = await Post.findById(id)
    if (!post) {
        const error = new Error('Post not found');
        error.status = 404;
        throw error;
    }

    return post;
}

exports.updatePost = async (id, partialPost) => {
    const post = await Post.findById(id);
    if (!post) {
        const error = new Error('Post not found');
        error.status = 404;
        throw error;
    }

    post.title = partialPost.title || post.title;
    post.topic = partialPost.topic || post.topic;
    post.message = partialPost.message || post.message;

    return post.save();
}

exports.deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        const error = new Error('Post not found');
        error.status = 404;
        throw error;
    }
    return post.remove();
}