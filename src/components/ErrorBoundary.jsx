import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Atmos encountered an unexpected error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="error-boundary" role="alert" aria-label="Application error">
          <h2 className="error-boundary__title">Something went wrong</h2>
          <p className="error-boundary__message">
            An unexpected error occurred while rendering Atmos.
          </p>
          <button type="button" className="error-boundary__retry" onClick={this.handleReset}>
            Try again
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
