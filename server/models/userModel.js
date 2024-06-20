const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    courses: {
        type: [String], default: [], required: true
    },
    role: { type: String, enum: ['teacher', 'student'], required: true }
});

module.exports = mongoose.model('User', UserSchema);
