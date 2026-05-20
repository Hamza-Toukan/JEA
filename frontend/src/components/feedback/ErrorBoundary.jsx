import { Component } from "react";
import { ErrorState } from "./ErrorState";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6">
          <ErrorState
            error={this.state.error}
            title="حدث خطأ في الواجهة"
            onRetry={this.handleRetry}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
