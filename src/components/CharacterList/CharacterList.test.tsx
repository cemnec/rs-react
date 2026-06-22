import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockCharacters } from '@/test-utils/mockCharacters';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import CharacterList from './CharacterList';

describe('CharacterList', () => {
  it('renders all provided characters', async () => {
    renderWithProviders(
      await CharacterList({
        characters: mockCharacters,
        page: 1,
        query: '',
      }),
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('renders empty state when characters list is empty', async () => {
    renderWithProviders(
      await CharacterList({
        characters: [],
        page: 1,
        query: '',
      }),
    );

    expect(
      screen.getByText('No characters found. Try another search query.'),
    ).toBeInTheDocument();
  });
});
