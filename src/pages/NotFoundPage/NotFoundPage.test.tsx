import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils/renderWithProviders';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('renders 404 page', () => {
    renderWithProviders(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the page you are looking for does not exist/i),
    ).toBeInTheDocument();
  });

  it('renders link back to home page', () => {
    renderWithProviders(<NotFoundPage />);

    expect(
      screen.getByRole('link', { name: /back to home page/i }),
    ).toHaveAttribute('href', '/?page=1');
  });
});
