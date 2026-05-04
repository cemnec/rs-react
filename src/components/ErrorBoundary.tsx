import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <main>
          <section className="error-boundary">
            <h1>Something went wrong.</h1>
            <p>Please reload the page and try again.</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
