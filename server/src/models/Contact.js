const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  fullName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  subject:     { type: String, required: true, trim: true },
  message:     { type: String, required: true },
  isRead:      { type: Boolean, default: false, index: true },
  submittedAt: { type: Date, default: Date.now, index: true },
})

module.exports = mongoose.model('Contact', contactSchema)
