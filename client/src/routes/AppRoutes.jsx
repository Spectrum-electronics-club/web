import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PageLoader from '@/components/atoms/PageLoader'
import ProtectedRoute from '@/components/atoms/ProtectedRoute'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'

// ── Public pages (lazy) ────────────────────────────────────────────────────
const Home         = lazy(() => import('@/pages/Home'))
const About        = lazy(() => import('@/pages/About'))
const Team         = lazy(() => import('@/pages/Team'))
const Projects     = lazy(() => import('@/pages/Projects'))
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'))
const Events       = lazy(() => import('@/pages/Events'))
const Competitions = lazy(() => import('@/pages/Competitions'))
const Gallery      = lazy(() => import('@/pages/Gallery'))
const Publications = lazy(() => import('@/pages/Publications'))
const Contact      = lazy(() => import('@/pages/Contact'))
const JoinClub     = lazy(() => import('@/pages/JoinClub'))
const NotFound     = lazy(() => import('@/pages/NotFound'))
const StyleGuide   = lazy(() => import('@/pages/StyleGuide'))

// ── Admin pages (lazy) ────────────────────────────────────────────────────
const AdminLogin     = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminProjects  = lazy(() => import('@/pages/admin/AdminProjects'))
const AdminEvents    = lazy(() => import('@/pages/admin/AdminEvents'))
const AdminGallery   = lazy(() => import('@/pages/admin/AdminGallery'))
const AdminTeam      = lazy(() => import('@/pages/admin/AdminTeam'))
const AdminPublications = lazy(() => import('@/pages/admin/AdminPublications'))
const AdminAnnouncements = lazy(() => import('@/pages/admin/AdminAnnouncements'))
const AdminRecruitment   = lazy(() => import('@/pages/admin/AdminRecruitment'))
const AdminContacts      = lazy(() => import('@/pages/admin/AdminContacts'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/"              element={<Home />} />
          <Route path="/about"         element={<About />} />
          <Route path="/team"          element={<Team />} />
          <Route path="/projects"      element={<Projects />} />
          <Route path="/projects/:id"  element={<ProjectDetail />} />
          <Route path="/events"        element={<Events />} />
          <Route path="/competitions"  element={<Competitions />} />
          <Route path="/gallery"       element={<Gallery />} />
          <Route path="/publications"  element={<Publications />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/join"          element={<JoinClub />} />
          <Route path="/styleguide"    element={<StyleGuide />} />
        </Route>

        {/* Admin login (no layout wrapper) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"                  element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard"        element={<AdminDashboard />} />
            <Route path="/admin/projects"         element={<AdminProjects />} />
            <Route path="/admin/events"           element={<AdminEvents />} />
            <Route path="/admin/gallery"          element={<AdminGallery />} />
            <Route path="/admin/team"             element={<AdminTeam />} />
            <Route path="/admin/publications"     element={<AdminPublications />} />
            <Route path="/admin/announcements"    element={<AdminAnnouncements />} />
            <Route path="/admin/recruitment"      element={<AdminRecruitment />} />
            <Route path="/admin/contacts"         element={<AdminContacts />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
