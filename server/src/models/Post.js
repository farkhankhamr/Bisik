const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PostSchema = new mongoose.Schema({
    post_id: { type: String, default: uuidv4, unique: true },
    anon_id: { type: String, required: true },
    content: { type: String, required: true, maxLength: 500 },
    city: { type: String, required: true, index: true },
    institution: { type: String, default: null },
    topic: { type: String, default: null },
    gender: { type: String, enum: ['M', 'F', 'NB', null], default: null },
    occupation: { type: String, default: null },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    },
    likes: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true, index: { expires: 0 } },
    is_seed: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'hidden'], default: 'active' }
});

module.exports = mongoose.model('Post', PostSchema);
