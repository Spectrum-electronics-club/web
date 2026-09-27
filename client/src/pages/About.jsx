import { motion } from 'framer-motion'
import PageTransition from '@/components/molecules/PageTransition'

const VALUES = [
  { title: 'Curiosity', desc: 'We ask why. Then we build the answer.' },
  { title: 'Collaboration', desc: 'Diverse minds building one vision together.' },
  { title: 'Innovation', desc: 'We push limits and create what did not exist before.' },
  { title: 'Excellence', desc: 'Good enough is never enough. We iterate until it is great.' },
]

export default function About() {
  return (
    <PageTransition>
      <div style={{ background: '#070b11', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{ position: 'relative', padding: '7rem 0 4rem', overflow: 'hidden' }}>
          <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>About Spectrum</p>
              <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#f1f5f9', marginBottom: '1.25rem' }}>
                Who <span className="gradient-text">We Are</span>
              </h1>
              <div style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ margin: 0 }}>
                  Spectrum is a student-led electronics and engineering club built around one simple idea: learn by building. We bring together students who are curious about technology and excited to turn ideas into something real.
                </p>
                <p style={{ margin: 0 }}>
                  Our work spans electronics, embedded systems, robotics, automation, and autonomous systems. From designing circuits and programming microcontrollers to building robots and developing complete systems, we get hands-on experience that goes beyond the classroom.
                </p>
                <p style={{ margin: 0 }}>
                  We believe engineering is best learned through experimentation. Not every prototype works on the first attempt, and that's where the real learning happens. We encourage our members to ask questions, try new approaches, solve problems, and learn from every failure along the way.
                </p>
                <p style={{ margin: 0 }}>
                  Beyond projects, Spectrum gives students a platform to challenge themselves through <strong style={{ color: '#e2e8f0', fontWeight: 600 }}>competitions, technical events, and real-world engineering challenges</strong>, including opportunities to compete at national levels. More than just a club, Spectrum is a community of students who build, learn, collaborate, and push each other to see what's possible.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Story + Mission */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container-main" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2rem' }}>
            {[
              { icon: '📖', title: 'Our Story', text: "Spectrum started in 2024 as a small group of engineering students passionate about building things. Today, we're a growing community of 50+ students exploring robotics, electronics, embedded systems, and more, with projects that take our learning beyond the classroom and into the real world." },
              { icon: '🎯', title: 'Our Mission', text: "To create a space where students can learn, collaborate, experiment, and grow, while using their skills to build meaningful solutions, take on real-world challenges, and make a positive impact through technology and innovation." },
              { icon: '🔭', title: 'Our Vision', text: "A club where every member gets the chance to become an innovator, researcher, and leader. We hope to see Spectrum alumni go on to build, lead, and drive meaningful technological change in industry and academia." },
            ].map((item) => (
              <div key={item.title} className="card-glass" style={{ padding: '2rem', height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.75, margin: 0, fontSize: '0.9rem' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section style={{ background: '#0a0e17', padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="container-main">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Core Values</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.25rem)', color: '#f1f5f9' }}>
                What drives <span className="gradient-text">everything we do</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
              {VALUES.map((v) => (
                <div key={v.title} className="card-glass" style={{ padding: '1.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>{v.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
