import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import type { Character } from '../../types/character';
import Card from './Card';

const character: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
};

describe('Card', () => {
  it('renders character information', () => {
    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <Card character={character} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /rick sanchez/i }),
    ).toBeInTheDocument();

    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();

    expect(screen.getByRole('img', { name: /rick sanchez/i })).toHaveAttribute(
      'src',
      character.image,
    );
  });
});
