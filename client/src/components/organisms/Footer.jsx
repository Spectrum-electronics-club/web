import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

const footerLinks = {
  Club: [
    { to: '/about',   label: 'About' },
    { to: '/team',    label: 'Team' },
    { to: '/join',    label: 'Join Club' },
    { to: '/contact', label: 'Contact' },
  ],
  Work: [
    { to: '/projects',     label: 'Projects' },
    { to: '/events',       label: 'Events' },
    { to: '/competitions', label: 'Competitions' },
  ],
  Content: [
    { to: '/gallery',      label: 'Gallery' },
    { to: '/publications', label: 'Publications' },
  ],
}

const socials = [
  { Icon: FaGithub,   href: '#', label: 'GitHub' },
  { Icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { Icon: FaTwitter,  href: '#', label: 'Twitter/X' },
  { Icon: FaInstagram, href: '#', label: 'Instagram' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="font-heading font-bold text-2xl text-white">
              NGND
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Innovating together through engineering, research, and community.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <nav key={group} aria-label={`${group} links`}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {group}
              </h3>
              <ul className="space-y-2" role="list">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          <p>© {year} NGND Club. All rights reserved.</p>
          <p>Built with React + Node.js</p>
        </div>
      </div>
    </footer>
  )
}
