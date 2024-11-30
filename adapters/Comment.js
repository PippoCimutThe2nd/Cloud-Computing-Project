exports.fromDatabaseRecord = (record) => {
    return {
        by: record._id,
        message: record.message,
        leftAt: record.registreatedAt
    }
}