const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const morgan     = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit  = require('express-rate-limit')
const path       = require('path')

const errorHandler = require('./middleware/errorHandler')

// Route imports
const authRoutes         = require('./routes/auth')
const projectRoutes      = require('./routes/projects')
const eventRoutes        = require('./routes/events')
const competitionRoutes  = require('./routes/competitions')
const galleryRoutes      = require('./routes/gallery')
const publicationRoutes  = require('./routes/publications')
const teamRoutes         = require('./routes/team')
const contactRoutes      = require('./routes/contact')
const recruitmentRoutes  = require('./routes/recruitment')
const adminRoutes        = require('./routes/admin')
const settingsRoutes     = require('./routes/settings')

const app = express()

// ── Security ─────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins dynamically since Vercel generates multiple aliases
    callback(null, true)
  },
  credentials: true,
}))
app.use(mongoSanitize())

// ── Logging ───────────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Static uploads ────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ── Public rate limiter (5 req / 1 min) ───────────────────────────────────
const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests. Please try again later.', code: 429 },
})

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',         authRoutes)
app.use('/api/v1/projects',     publicLimiter, projectRoutes)
app.use('/api/v1/events',       publicLimiter, eventRoutes)
app.use('/api/v1/competitions', publicLimiter, competitionRoutes)
app.use('/api/v1/gallery',      publicLimiter, galleryRoutes)
app.use('/api/v1/publications', publicLimiter, publicationRoutes)
app.use('/api/v1/team',         publicLimiter, teamRoutes)
app.use('/api/v1/contact',      publicLimiter, contactRoutes)
app.use('/api/v1/recruitment',  publicLimiter, recruitmentRoutes)
app.use('/api/v1/settings',     settingsRoutes)
app.use('/api/v1/admin',        adminRoutes)

// ── Health check ─────────────────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok' }))

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ status: 'error', message: 'Route not found', code: 404 }))

// ── Central error handler ────────────────────────────────────────────────
app.use(errorHandler)

module.exports = app
