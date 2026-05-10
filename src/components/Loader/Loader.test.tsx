import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Loader from './Loader';

describe('Loader', () => {
  it('renders loading message', () => {
    render(<Loader />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
