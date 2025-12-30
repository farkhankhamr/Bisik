const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ReportSchema = new mongoose.Schema({
    report_id: { type: String, default: uuidv4, unique: true },
    target_id: { type: String, required: true },
    target_type: {
        type: String,
        enum: ['POST', 'INTEL'],
        default: 'POST'
    },
    reported_by: { type: String, required: true }, // anon_id of reporter
    reported_user: { type: String, required: true }, // anon_id of post author
    reason: {
        type: String,
        enum: ['spam', 'harmful', 'sexuality', 'violence', 'hoax', 'sara'],
        required: true
    },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
