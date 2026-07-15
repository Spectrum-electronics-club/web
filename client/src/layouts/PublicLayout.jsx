import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/organisms/Navbar'
import Footer from '@/components/organisms/Footer'

export default function PublicLayout() {
  const location = useLocation()
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#070b11', color:'#e2e8f0' }}>
      <Navbar />
      <main style={{ flex:1 }} id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
