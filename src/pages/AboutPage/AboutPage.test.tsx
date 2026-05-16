import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders about page content', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();

    expect(
      screen.getByText(
        /this application was created for the rs school react course/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/search rick and morty characters/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/view character details/i)).toBeInTheDocument();
  });
});
