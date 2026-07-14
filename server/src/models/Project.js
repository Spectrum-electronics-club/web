const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  techStack:   [{ type: String, trim: true }],
  images:      [{ type: String }],
  status:      { type: String, enum: ['ongoing', 'completed', 'archived'], default: 'ongoing', index: true },
  featured:    { type: Boolean, default: false, index: true },
  githubUrl:   { type: String },
  demoUrl:     { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)
