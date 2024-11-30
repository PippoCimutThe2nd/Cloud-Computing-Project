exports.fromDatabaseRecord = (record) => {
    return {
        id: record._id,
        from: record.user.username,
        message: record.message,
        leftAt: record.registreatedAt
    }
}