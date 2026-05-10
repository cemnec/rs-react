import { render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundary from './ErrorBoundary';

class BrokenComponent extends React.Component {
  render(): React.ReactNode {
    throw new Error('Test render error');
  }
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>Application content</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Application content')).toBeInTheDocument();
  });

  it('renders fallback UI when child component throws an error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
