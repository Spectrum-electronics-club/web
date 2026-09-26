const express = require('express')
const router = express.Router()
const Announcement = require('../models/Announcement')

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const now = new Date()
    
    // Only return announcements that haven't expired
    const query = { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] }

    const total = await Announcement.countDocuments(query)
    const announcements = await Announcement.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      success: true,
      data: announcements,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

module.exports = router
