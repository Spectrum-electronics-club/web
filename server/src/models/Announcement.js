const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  body:      { type: String, required: true },
  isPinned:  { type: Boolean, default: false, index: true },
  expiresAt: { type: Date },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } })

module.exports = mongoose.model('Announcement', announcementSchema)
