import { afterEach, describe, expect, it, vi } from 'vitest';

import { mockCharactersResponse } from '../test-utils/mockCharacters';
import { fetchCharacters } from './charactersApi';

describe('fetchCharacters', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches characters without search term', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockCharactersResponse),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchCharacters('', 1);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?page=1',
    );
    expect(result).toEqual(mockCharactersResponse);
  });

  it('fetches characters with search term and page', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockCharactersResponse),
    });

    vi.stubGlobal('fetch', fetchMock);

    await fetchCharacters('rick', 2);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?name=rick&page=2',
    );
  });

  it('throws an error when response is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn(),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchCharacters('unknown', 1)).rejects.toThrow(
      'Characters not found',
    );
  });
});
