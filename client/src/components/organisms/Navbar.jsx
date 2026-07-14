import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { IoMoon, IoSunny } from 'react-icons/io5'
import { useTheme } from '@/context/ThemeContext'

const navLinks = [
  { to: '/about',        label: 'About' },
  { to: '/team',         label: 'Team' },
  { to: '/projects',     label: 'Projects' },
  { to: '/events',       label: 'Events' },
  { to: '/competitions', label: 'Competitions' },
  { to: '/gallery',      label: 'Gallery' },
  { to: '/publications', label: 'Publications' },
  { to: '/contact',      label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <nav
        aria-label="Main navigation"
        className="container-main flex items-center justify-between h-16"
      >
        {/* Logo */}
        <Link to="/" className="font-heading font-bold text-xl text-primary-600 hover:text-primary-700">
          NGND
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6" role="list">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-primary-600'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-on-surface'
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/join"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Join Club
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-lg text-neutral-500 hover:text-on-surface hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {theme === 'dark' ? <IoSunny size={20} /> : <IoMoon size={20} />}
          </button>

          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-on-surface hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-surface">
          <ul className="container-main py-4 flex flex-col gap-3" role="list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'block py-2 text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'text-primary-600'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-on-surface'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/join"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mt-2"
              >
                Join Club
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
