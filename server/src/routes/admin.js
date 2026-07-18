const express      = require('express')
const multer       = require('multer')
const path         = require('path')
const fs           = require('fs')
const cloudinary   = require('cloudinary').v2
const { Readable } = require('stream')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
const authMiddleware = require('../middleware/authMiddleware')
const Project      = require('../models/Project')
const Event        = require('../models/Event')
const Gallery      = require('../models/Gallery')
const TeamMember   = require('../models/TeamMember')
const Publication  = require('../models/Publication')
const Announcement = require('../models/Announcement')
const Recruitment  = require('../models/Recruitment')
const Contact      = require('../models/Contact')
const { paginateQuery } = require('../utils/paginate')

const router = express.Router()
router.use(authMiddleware)

// ── Image upload (memory → Cloudinary stream) ─────────────────────────────
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE     = 10 * 1024 * 1024 // 10 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true)
    else cb(Object.assign(new Error('Unsupported file type.'), { statusCode: 415 }))
  },
})

// Helper: upload a buffer to Cloudinary and return the secure_url
function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'ngnd_uploads', ...options },
      (err, result) => {
        if (err) return reject(err)
        resolve(result)
      }
    )
    Readable.from(buffer).pipe(uploadStream)
  })
}

router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded', code: 400 })
    const result = await uploadToCloudinary(req.file.buffer)
    res.json({ url: result.secure_url })
  } catch (err) {
    next(err)
  }
})

// ── Dashboard summary ─────────────────────────────────────────────────────
router.get('/summary', async (_req, res, next) => {
  try {
    const [totalProjects, upcomingEvents, pendingApps, unreadContacts, totalTeamMembers] = await Promise.all([
      Project.countDocuments(),
      Event.countDocuments({ isUpcoming: true }),
      Recruitment.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ isRead: false }),
      TeamMember.countDocuments({ isActive: true }),
    ])
    res.json({ totalProjects, upcomingEvents, pendingApps, unreadContacts, totalTeamMembers })
  } catch (err) { next(err) }
})

// ── Projects CRUD ─────────────────────────────────────────────────────────
router.get('/projects', async (req, res, next) => {
  try {
    const { page, limit } = req.query
    res.json(await paginateQuery(Project, {}, { createdAt: -1 }, page, limit))
  } catch (err) { next(err) }
})
router.post('/projects', async (req, res, next) => {
  try { res.status(201).json({ data: await Project.create(req.body) }) } catch (err) { next(err) }
})
router.put('/projects/:id', async (req, res, next) => {
  try {
    const doc = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.json({ data: doc })
  } catch (err) { next(err) }
})
router.delete('/projects/:id', async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
})

// ── Events CRUD ────────────────────────────────────────────────────────────
router.get('/events', async (req, res, next) => {
  try {
    const { page, limit } = req.query
    res.json(await paginateQuery(Event, {}, { createdAt: -1 }, page, limit))
  } catch (err) { next(err) }
})
router.post('/events', async (req, res, next) => {
  try { res.status(201).json({ data: await Event.create(req.body) }) } catch (err) { next(err) }
})
router.put('/events/:id', async (req, res, next) => {
  try {
    const doc = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.json({ data: doc })
  } catch (err) { next(err) }
})
router.delete('/events/:id', async (req, res, next) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id)
    if (ev?.galleryRef?.length) {
      await Gallery.deleteMany({ _id: { $in: ev.galleryRef } })
    }
    res.status(204).end()
  } catch (err) { next(err) }
})

// ── Gallery CRUD ──────────────────────────────────────────────────────────
router.get('/gallery', async (req, res, next) => {
  try {
    const { page, limit } = req.query
    res.json(await paginateQuery(Gallery, {}, { uploadedAt: -1 }, page, limit))
  } catch (err) { next(err) }
})
router.post('/gallery', async (req, res, next) => {
  try { res.status(201).json({ data: await Gallery.create(req.body) }) } catch (err) { next(err) }
})
router.delete('/gallery/:id', async (req, res, next) => {
  try {
    const img = await Gallery.findByIdAndDelete(req.params.id)
    if (img?.imageUrl) {
      if (img.imageUrl.includes('res.cloudinary.com')) {
        const urlParts = img.imageUrl.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const publicId = `ngnd_uploads/${filenameWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } else if (img.imageUrl.startsWith('/uploads/')) {
        const file = path.join(__dirname, '../..', img.imageUrl)
        if (fs.existsSync(file)) fs.unlinkSync(file)
      }
    }
    res.status(204).end()
  } catch (err) { next(err) }
})

// ── Team CRUD ─────────────────────────────────────────────────────────────
router.get('/team', async (req, res, next) => {
  try {
    const { page, limit } = req.query
    res.json(await paginateQuery(TeamMember, {}, { order: 1 }, page, limit))
  } catch (err) { next(err) }
})
router.post('/team', async (req, res, next) => {
  try { res.status(201).json({ data: await TeamMember.create(req.body) }) } catch (err) { next(err) }
})
router.put('/team/:id', async (req, res, next) => {
  try {
    const doc = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.json({ data: doc })
  } catch (err) { next(err) }
})
router.delete('/team/:id', async (req, res, next) => {
  try { await TeamMember.findByIdAndDelete(req.params.id); res.status(204).end() } catch (err) { next(err) }
})

// ── Publications CRUD ─────────────────────────────────────────────────────
router.get('/publications', async (req, res, next) => {
  try {
    const { page, limit } = req.query
    res.json(await paginateQuery(Publication, {}, { publishedDate: -1 }, page, limit))
  } catch (err) { next(err) }
})
router.post('/publications', async (req, res, next) => {
  try { res.status(201).json({ data: await Publication.create(req.body) }) } catch (err) { next(err) }
})
router.put('/publications/:id', async (req, res, next) => {
  try {
    const doc = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!doc) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.json({ data: doc })
  } catch (err) { next(err) }
})
router.delete('/publications/:id', async (req, res, next) => {
  try { await Publication.findByIdAndDelete(req.params.id); res.status(204).end() } catch (err) { next(err) }
})

// ── Announcements CRUD ────────────────────────────────────────────────────
router.get('/announcements', async (req, res, next) => {
  try {
    const { page, limit } = req.query
    res.json(await paginateQuery(Announcement, {}, { createdAt: -1 }, page, limit))
  } catch (err) { next(err) }
})
router.post('/announcements', async (req, res, next) => {
  try { res.status(201).json({ data: await Announcement.create(req.body) }) } catch (err) { next(err) }
})
router.put('/announcements/:id', async (req, res, next) => {
  try {
    const doc = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!doc) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.json({ data: doc })
  } catch (err) { next(err) }
})
router.delete('/announcements/:id', async (req, res, next) => {
  try { await Announcement.findByIdAndDelete(req.params.id); res.status(204).end() } catch (err) { next(err) }
})

// ── Recruitment management ────────────────────────────────────────────────
router.get('/recruitment', async (req, res, next) => {
  try {
    const { page, limit, status } = req.query
    const filter = {}
    if (status && status !== 'all') filter.status = status
    res.json(await paginateQuery(Recruitment, filter, { submittedAt: -1 }, page, limit))
  } catch (err) { next(err) }
})
router.patch(['/recruitment/:id', '/recruitment/:id/status'], async (req, res, next) => {
  try {
    const doc = await Recruitment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!doc) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.json({ data: doc })
  } catch (err) { next(err) }
})
router.delete('/recruitment/:id', async (req, res, next) => {
  try {
    const doc = await Recruitment.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.status(204).end()
  } catch (err) { next(err) }
})

// ── Contact queries ───────────────────────────────────────────────────────
router.get('/contacts', async (req, res, next) => {
  try {
    const { page, limit } = req.query
    res.json(await paginateQuery(Contact, {}, { submittedAt: -1 }, page, limit))
  } catch (err) { next(err) }
})
router.patch(['/contacts/:id', '/contacts/:id/read'], async (req, res, next) => {
  try {
    const doc = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
    if (!doc) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.json({ data: doc })
  } catch (err) { next(err) }
})
router.delete('/contacts/:id', async (req, res, next) => {
  try {
    const doc = await Contact.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.status(204).end()
  } catch (err) { next(err) }
})

module.exports = router
