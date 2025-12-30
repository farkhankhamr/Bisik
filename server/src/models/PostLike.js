const mongoose = require('mongoose');

const PostLikeSchema = new mongoose.Schema({
    post_id: { type: String, required: true, index: true },
    anon_id: { type: String, required: true, index: true },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, index: { expires: '48h' } } // Auto cleanup matching post lifespan
});

// Composite index to ensure uniqueness per post per user
PostLikeSchema.index({ post_id: 1, anon_id: 1 }, { unique: true });

module.exports = mongoose.model('PostLike', PostLikeSchema);
