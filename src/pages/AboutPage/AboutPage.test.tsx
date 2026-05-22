import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders about page content', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('heading', { name: /about this app/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /this application was created as part of the rs school react course/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/author:/i)).toBeInTheDocument();
    expect(screen.getByText(/cemnec/i)).toBeInTheDocument();
  });

  it('renders RS School React course link', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('link', { name: /open rs school react course/i }),
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });
});
