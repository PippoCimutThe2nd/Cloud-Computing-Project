const Post = require('../models/Post');
const PostAdapter = require('../adapters/Post');

exports.createPost = async (req, res, next) => {
    const result = await Post.create({
        title: req.body.title,
        topic: req.body.topic,
        message: req.body.message,
        owner: {
            id: req.user.id
        },
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    })

    res.status(201).json({ message: "Post created" });

}

exports.getPosts = async (req, res) => {
    const filterTopic = req.query.topic ? { topic: req.query.topic } : null;
    const filterStatus = req.query.status ? { status: req.query.status } : null;
    const filterHighestInterests = req.query.highestInterest ? { topic: req.query.highestInterest } : null;

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
        //Calculate highest sum of likes and dislikes and return a single value
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


    return Post.aggregate(pipeline).then((posts) => {
        res.json(posts.map(PostAdapter.fromDatabaseRecord));
    })

}
exports.getPost = async (req, res) => {
    Post.findById(req.params.id).then((post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(PostAdapter.fromDatabaseRecord(post));
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
}
exports.updatePost = async (req, res) => {
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
}
exports.deletePost = async (req, res) => {
    Post.findByIdAndDelete(req.params.id).then((post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(204).send();
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
}