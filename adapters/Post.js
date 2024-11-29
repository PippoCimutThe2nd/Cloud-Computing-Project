exports.fromDatabaseRecord = (record) => {
    return {
        id: record._id,
        registreatedAt: record.registreatedAt,
        likes: record.likes.users.length,
        dislikes: record.dislikes.users.length,
        comments: record.comments.map((comment) => {
            return {
                id: comment._id,
                from: comment.user.username,
                message: comment.message,
                leftAt: comment.registreatedAt
            }
        }),
        topic: record.topic,
        message: record.message,
        expiresAt: record.expiresAt,
        status: record.status,
        owner: record.owner
    }
}