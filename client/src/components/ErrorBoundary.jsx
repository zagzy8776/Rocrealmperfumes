import { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#fffaf1] p-4">
          <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h1 className="font-display text-2xl font-semibold text-stone-950">Something went wrong</h1>
            <p className="mt-2 text-stone-600">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-amber-700"
            >
              <RefreshCw size={18} /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const withErrorBoundary = (Component) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};
