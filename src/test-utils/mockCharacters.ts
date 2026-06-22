import type { Character, CharactersResponse } from '@/types/character';
import type { SelectedItem } from '@/types/selectedItem';

export const mockRick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'Earth (C-137)',
    url: '',
  },
  location: {
    name: 'Citadel of Ricks',
    url: '',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

export const mockMorty: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'unknown',
    url: '',
  },
  location: {
    name: 'Citadel of Ricks',
    url: '',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/2',
  created: '2017-11-04T18:50:21.651Z',
};

export const mockCharacters: Character[] = [mockRick, mockMorty];

export const mockCharactersResponse: CharactersResponse = {
  info: {
    count: 2,
    pages: 2,
    next: 'https://rickandmortyapi.com/api/character?page=2',
    prev: null,
  },
  results: mockCharacters,
};

export const mockSelectedRick: SelectedItem = {
  id: mockRick.id,
  name: mockRick.name,
  status: mockRick.status,
  species: mockRick.species,
  gender: mockRick.gender,
  detailsUrl: '/?page=1&selectedId=1',
};
