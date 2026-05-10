import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders provided error message', () => {
    render(<ErrorMessage message="Characters not found" />);

    expect(screen.getByText('Characters not found')).toBeInTheDocument();
  });
});
