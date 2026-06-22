import { API_ENDPOINTS } from '@/constants/api';
import type { Character, CharactersResponse } from '@/types/character';

const EMPTY_CHARACTERS_RESPONSE: CharactersResponse = {
  info: {
    count: 0,
    pages: 0,
    next: null,
    prev: null,
  },
  results: [],
};

type GetCharactersParams = {
  query: string;
  page: number;
};

export async function getCharacters({
  query,
  page,
}: GetCharactersParams): Promise<CharactersResponse> {
  const params = new URLSearchParams({
    page: String(page),
  });

  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set('name', trimmedQuery);
  }

  const response = await fetch(`${API_ENDPOINTS.characters}?${params}`, {
    cache: 'no-store',
  });

  if (response.status === 404) {
    return EMPTY_CHARACTERS_RESPONSE;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }

  return (await response.json()) as CharactersResponse;
}

export async function getCharacterById(id: string): Promise<Character | null> {
  const characterId = Number(id);

  if (!Number.isInteger(characterId) || characterId <= 0) {
    return null;
  }

  const response = await fetch(`${API_ENDPOINTS.characters}/${characterId}`, {
    cache: 'no-store',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch character details');
  }

  return (await response.json()) as Character;
}
