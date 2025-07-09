const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: '' 
    },
    bio: {
        type: String,
        default: ''
    }
    ,
    role: {
        type: String,
        enum: ['user', 'admin', 'employee'],
        default: 'user'
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    images: [{
        url: String,
        public_id: String,
        caption: String,
        location: String,
        likes: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }],       
    }],
    roomIDs: [String] 
}
, 
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
