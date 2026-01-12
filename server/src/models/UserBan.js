const mongoose = require('mongoose');

const UserBanSchema = new mongoose.Schema({
    anon_id: { type: String, required: true, unique: true },
    report_count: { type: Number, default: 0 },
    is_banned: { type: Boolean, default: false },
    banned_at: { type: Date },
    warnings: [{
        reason: {
            type: String,
            enum: ['spam', 'harmful', 'sexuality', 'violence', 'hoax', 'sara']
        },
        timestamp: { type: Date, default: Date.now },
        target_type: { type: String, enum: ['POST', 'INTEL'], default: 'POST' }
    }],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserBan', UserBanSchema);
