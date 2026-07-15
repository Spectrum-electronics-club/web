export default function PageLoader() {
  return (
    <div role="status" aria-label="Loading page" style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#070b11', zIndex: 9999,
    }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#06b6d4,#7c3aed)',
            animation: 'bounce 1s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(-12px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
