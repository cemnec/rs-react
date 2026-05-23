import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { useTheme } from '../hooks/useTheme';
import { ThemeProvider } from './ThemeProvider';

function ThemeConsumer(): ReactElement {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <p>Current theme: {theme}</p>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
    </>
  );
}

describe('ThemeContext', () => {
  it('provides light theme by default', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText(/current theme: light/i)).toBeInTheDocument();
  });

  it('toggles theme value', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /toggle theme/i }));

    expect(screen.getByText(/current theme: dark/i)).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
