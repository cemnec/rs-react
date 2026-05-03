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

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong.</h2>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
