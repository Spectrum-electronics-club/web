const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  description:     { type: String },
  schedule:        [{ date: String, time: String, activity: String }],
  speakers:        [{ name: String, bio: String, photo: String }],
  registrationUrl: { type: String },
  galleryRef:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' }],
  isUpcoming:      { type: Boolean, default: false, index: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } })

module.exports = mongoose.model('Event', eventSchema)
