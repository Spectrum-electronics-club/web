const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true, index: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } })

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

module.exports = mongoose.model('User', userSchema)
