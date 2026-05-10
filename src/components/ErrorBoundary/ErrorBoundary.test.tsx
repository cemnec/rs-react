import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(
      screen.getByText(/please reload the page and try again/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /reload page/i }),
    ).toBeInTheDocument();
  });

  it('logs caught errors to the console', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('reloads the page when reload button is clicked', async () => {
    const user = userEvent.setup();

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const reloadMock = vi.fn();

    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: reloadMock,
      },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    await user.click(screen.getByRole('button', { name: /reload page/i }));

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
