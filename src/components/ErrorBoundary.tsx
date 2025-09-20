import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | undefined;
  errorInfo?: ErrorInfo | undefined;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-1">
          <div className="max-w-md w-full bg-surface-2 shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-danger-100 dark:bg-danger-900 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-danger-600 dark:text-danger-400" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary text-center mb-2">
              Something went wrong
            </h2>
            <p className="text-text-secondary text-center mb-6">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 border border-surface-3 text-text-secondary rounded-md hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors"
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-text-muted">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-surface-1 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
