const mongoose = require('mongoose')

const competitionSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String },
  date:        { type: String },
  result:      { type: String },
  isUpcoming:  { type: Boolean, default: false, index: true },
  links:       [{ label: String, url: String }],
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } })

module.exports = mongoose.model('Competition', competitionSchema)
