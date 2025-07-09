const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    _id: String, // roomId like "userA@example.comuserB@example.com"
    users: [String], // array of user emails
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', roomSchema);
