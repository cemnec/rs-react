import { CHARACTERS_API_URL } from '../constants/api';
import type { Character, CharactersResponse } from '../types/character';

export const fetchCharacters = async (
  searchTerm: string,
  page: number,
): Promise<CharactersResponse> => {
  const params = new URLSearchParams();

  if (searchTerm) {
    params.set('name', searchTerm);
  }

  params.set('page', String(page));

  const response = await fetch(`${CHARACTERS_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Characters not found');
  }

  return (await response.json()) as Promise<CharactersResponse>;
};

export const fetchCharacterById = async (id: string): Promise<Character> => {
  const response = await fetch(`${CHARACTERS_API_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Character details not found');
  }

  return response.json();
};
