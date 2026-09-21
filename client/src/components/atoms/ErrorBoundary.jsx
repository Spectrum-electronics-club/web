import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err, info) { console.error('ErrorBoundary:', err, info) }

  render() {
    if (this.state.hasError) return (
      <div style={{
        minHeight: '100vh', background: '#070b11', color: '#e2e8f0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '1rem', padding: '2rem', textAlign: 'center',
      }}>
        <p style={{ fontSize: '3.5rem' }}>💥</p>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", color:'#ef4444', fontWeight:700 }}>Something went wrong</h1>
        <p style={{ color:'#64748b', maxWidth:'400px' }}>An unexpected error occurred. Try refreshing or go back home.</p>
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', justifyContent:'center' }}>
          <button onClick={() => this.setState({ hasError: false })} className="btn-glow">Try again</button>
          <Link to="/" className="btn-outline">Go home</Link>
        </div>
      </div>
    )
    return this.props.children
  }
}
