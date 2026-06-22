import { afterEach, describe, expect, it, vi } from 'vitest';

import { mockCharactersResponse, mockRick } from '@/test-utils/mockCharacters';

import { getCharacterById, getCharacters } from './characters';

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function getRequestUrl(request: unknown): string {
  if (request instanceof Request) {
    return request.url;
  }

  if (request instanceof URL) {
    return request.toString();
  }

  return String(request);
}

describe('characters service', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches characters with page and trimmed search query', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(createJsonResponse(mockCharactersResponse));

    vi.stubGlobal('fetch', fetchMock);

    const result = await getCharacters({
      query: '  rick  ',
      page: 2,
    });

    expect(result).toEqual(mockCharactersResponse);

    const requestUrl = getRequestUrl(fetchMock.mock.calls[0][0]);

    expect(requestUrl).toContain('/character');
    expect(requestUrl).toContain('page=2');
    expect(requestUrl).toContain('name=rick');
  });

  it('returns empty response when characters API returns 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(createJsonResponse({}, 404)),
    );

    const result = await getCharacters({
      query: 'unknown',
      page: 1,
    });

    expect(result.results).toEqual([]);
    expect(result.info.count).toBe(0);
  });

  it('fetches character details by id', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(createJsonResponse(mockRick));

    vi.stubGlobal('fetch', fetchMock);

    const result = await getCharacterById('1');

    expect(result).toEqual(mockRick);
    expect(getRequestUrl(fetchMock.mock.calls[0][0])).toContain('/character/1');
  });

  it('returns null for invalid character id without fetch', async () => {
    const fetchMock = vi.fn<typeof fetch>();

    vi.stubGlobal('fetch', fetchMock);

    await expect(getCharacterById('abc')).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
