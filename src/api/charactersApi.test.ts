import { afterEach, describe, expect, it, vi } from 'vitest';

import { CHARACTERS_API_URL } from '../constants/api';
import { mockCharactersResponse, mockRick } from '../test-utils/mockCharacters';
import { fetchCharacterById, fetchCharacters } from './charactersApi';

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

    expect(fetchMock).toHaveBeenCalledWith(`${CHARACTERS_API_URL}?page=1`);
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
      `${CHARACTERS_API_URL}?name=rick&page=2`,
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

  it('fetches character details by id', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockRick),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchCharacterById('1');

    expect(fetchMock).toHaveBeenCalledWith(`${CHARACTERS_API_URL}/1`);
    expect(result).toEqual(mockRick);
  });

  it('throws an error when character details request fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn(),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchCharacterById('999999')).rejects.toThrow(
      'Character details not found',
    );
  });
});
