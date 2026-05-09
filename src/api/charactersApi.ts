import type { CharactersResponse } from '../types/character';

const API_URL = 'https://rickandmortyapi.com/api/character';

export const fetchCharacters = async (
  searchTerm: string,
  page: number,
): Promise<CharactersResponse> => {
  const params = new URLSearchParams();

  if (searchTerm) {
    params.set('name', searchTerm);
  }

  params.set('page', String(page));

  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Characters not found');
  }

  return (await response.json()) as Promise<CharactersResponse>;
};
