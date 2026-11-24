import { Component, type ReactNode } from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// If the app ever crashes, show a readable message (with the reason) instead of a blank page.
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif', color: '#1b2430', background: '#f3f5f9', minHeight: '100vh' }}>
        <h2 style={{ margin: 0 }}>Tata Motors Workshop Service Status</h2>
        <p>Sorry, the screen could not be shown. Please reload the page (Ctrl+F5). If it happens again, send this message to the project team:</p>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#ffffff', border: '1px solid #e6e9f0', padding: 12, borderRadius: 6 }}>{String(this.state.error.message || this.state.error)}</pre>
      </div>
    );
  }
}

createRoot(document.getElementById('root')!).render(<ErrorBoundary><App /></ErrorBoundary>);
