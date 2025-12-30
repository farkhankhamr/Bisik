const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ChatSchema = new mongoose.Schema({
    chat_id: { type: String, default: uuidv4, unique: true },
    post_id: { type: String, required: true },
    user_a: { type: String, required: true, index: true }, // Initiator
    user_b: { type: String, required: true, index: true }, // Recipient
    status: { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' },
    expires_at: { type: Date, required: true, index: { expires: 0 } }
});

module.exports = mongoose.model('Chat', ChatSchema);
