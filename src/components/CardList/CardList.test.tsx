import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockCharacters } from '../../test-utils/mockCharacters';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import CardList from './CardList';

describe('CardList', () => {
  it('renders all provided characters', () => {
    renderWithProviders(<CardList characters={mockCharacters} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('renders one image for each character', () => {
    renderWithProviders(<CardList characters={mockCharacters} />);

    expect(screen.getAllByRole('img')).toHaveLength(mockCharacters.length);
  });
});
