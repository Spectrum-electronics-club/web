const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema({
  fullName:          { type: String, required: true, trim: true },
  role:              { type: String, required: true, trim: true },
  category:          { type: String, default: 'Core Team', trim: true },
  photo:             { type: String },
  linkedinUrl:       { type: String },
  githubUrl:         { type: String },
  email:             { type: String },
  skills:            [{ type: String, trim: true }],
  researchInterests: [{ type: String, trim: true }],
  isActive:          { type: Boolean, default: true, index: true },
  order:             { type: Number, default: 0, index: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } })

module.exports = mongoose.model('TeamMember', teamMemberSchema)
