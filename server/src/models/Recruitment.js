const mongoose = require('mongoose')

const recruitmentSchema = new mongoose.Schema({
  fullName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true, index: true },
  phone:       { type: String, required: true, trim: true },
  department:  { type: String, required: true, trim: true },
  year:        { type: String, required: true },
  motivation:  { type: String, required: true },
  linkedinUrl: { type: String },
  status:      { type: String, enum: ['pending','reviewed','accepted','rejected'], default: 'pending', index: true },
  submittedAt: { type: Date, default: Date.now, index: true },
})

module.exports = mongoose.model('Recruitment', recruitmentSchema)
