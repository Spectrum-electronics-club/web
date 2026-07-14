const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
  imageUrl:   { type: String, required: true },
  album:      { type: String, trim: true, index: true },
  tags:       [{ type: String, trim: true }],
  caption:    { type: String, trim: true, maxlength: 300 },
  uploadedAt: { type: Date, default: Date.now, index: true },
})

module.exports = mongoose.model('Gallery', gallerySchema)
