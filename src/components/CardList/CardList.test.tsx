import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Character } from '../../types/character';
import CardList from './CardList';

const characters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: 'https://example.com/rick.png',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: 'https://example.com/morty.png',
  },
];

describe('CardList', () => {
  it('renders all provided characters', () => {
    render(<CardList characters={characters} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('renders one image for each character', () => {
    render(<CardList characters={characters} />);

    expect(screen.getAllByRole('img')).toHaveLength(characters.length);
  });
});
