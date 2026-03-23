import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: 'white',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem',
        }}>
          <div>
            <p style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span style={{ color: 'white' }}>First</span>
              <span style={{ opacity: 0.5 }}>Touch</span>
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.5, fontWeight: 300, marginBottom: '2rem' }}>
              Something went wrong. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                background: 'white',
                color: 'black',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
