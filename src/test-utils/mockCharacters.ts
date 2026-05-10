import type { Character, CharactersResponse } from '../types/character';

export const mockRick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
};

export const mockMorty: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/morty.png',
};

export const mockCharactersResponse: CharactersResponse = {
  info: {
    count: 2,
    pages: 2,
    next: 'https://rickandmortyapi.com/api/character?page=2',
    prev: null,
  },
  results: [mockRick, mockMorty],
};

export const mockSinglePageResponse: CharactersResponse = {
  info: {
    count: 1,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [mockRick],
};
