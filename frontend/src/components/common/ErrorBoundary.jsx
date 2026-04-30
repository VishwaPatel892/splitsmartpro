import React from 'react';

/**
 * ErrorBoundary – Catches unhandled JS errors in the component tree
 * and shows a friendly fallback UI instead of a blank screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-3">Something went wrong</h1>
            <p className="text-[#94A3B8] text-sm mb-8 leading-relaxed">
              An unexpected error occurred. Our team has been notified. Please try refreshing the page.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all active:scale-95"
              >
                Refresh Page
              </button>
              <button
                onClick={() => { this.setState({ hasError: false, error: null }); }}
                className="px-6 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] hover:text-white hover:bg-[#334155] font-bold text-sm transition-all active:scale-95"
              >
                Try Again
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-6 text-left text-xs text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 overflow-auto max-h-40">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
