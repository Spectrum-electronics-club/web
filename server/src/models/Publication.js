const mongoose = require('mongoose')

const publicationSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  authors:       [{ type: String, trim: true }],
  abstract:      { type: String },
  publishedDate: { type: Date, index: true },
  pdfUrl:        { type: String },
  externalUrl:   { type: String },
  tags:          [{ type: String, trim: true }],
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } })

module.exports = mongoose.model('Publication', publicationSchema)
