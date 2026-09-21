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
const AdminSettings      = lazy(() => import('@/pages/admin/AdminSettings'))

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

        </Route>

        {/* Admin login (no layout wrapper) */}
        <Route path="/spectrum-manage/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/spectrum-manage"                  element={<Navigate to="/spectrum-manage/dashboard" replace />} />
            <Route path="/spectrum-manage/dashboard"        element={<AdminDashboard />} />
            <Route path="/spectrum-manage/projects"         element={<AdminProjects />} />
            <Route path="/spectrum-manage/events"           element={<AdminEvents />} />
            <Route path="/spectrum-manage/gallery"          element={<AdminGallery />} />
            <Route path="/spectrum-manage/team"             element={<AdminTeam />} />
            <Route path="/spectrum-manage/publications"     element={<AdminPublications />} />
            <Route path="/spectrum-manage/announcements"    element={<AdminAnnouncements />} />
            <Route path="/spectrum-manage/recruitment"      element={<AdminRecruitment />} />
            <Route path="/spectrum-manage/contacts"         element={<AdminContacts />} />
            <Route path="/spectrum-manage/settings"         element={<AdminSettings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
