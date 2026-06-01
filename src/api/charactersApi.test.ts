import { configureStore } from '@reduxjs/toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mockCharactersResponse, mockRick } from '../test-utils/mockCharacters';
import { charactersApi } from './charactersApi';

const createTestStore = () =>
  configureStore({
    reducer: {
      [charactersApi.reducerPath]: charactersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(charactersApi.middleware),
  });

const createJsonResponse = (body: unknown, status = 200): Response => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getRequestUrl = (request: unknown): string => {
  if (request instanceof Request) {
    return request.url;
  }

  if (request instanceof URL) {
    return request.toString();
  }

  if (typeof request === 'string') {
    return request;
  }

  return String(request);
};

describe('charactersApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches characters without search term', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createJsonResponse(mockCharactersResponse));

    vi.stubGlobal('fetch', fetchMock);

    const store = createTestStore();

    const result = await store.dispatch(
      charactersApi.endpoints.getCharacters.initiate({
        searchTerm: '',
        page: 1,
      }),
    );

    expect(result.data).toEqual(mockCharactersResponse);

    const requestUrl = getRequestUrl(fetchMock.mock.calls[0][0]);

    expect(requestUrl).toContain('/character');
    expect(requestUrl).toContain('page=1');
    expect(requestUrl).not.toContain('name=');
  });

  it('fetches characters with search term and page', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createJsonResponse(mockCharactersResponse));

    vi.stubGlobal('fetch', fetchMock);

    const store = createTestStore();

    await store.dispatch(
      charactersApi.endpoints.getCharacters.initiate({
        searchTerm: 'rick',
        page: 2,
      }),
    );

    const requestUrl = getRequestUrl(fetchMock.mock.calls[0][0]);

    expect(requestUrl).toContain('/character');
    expect(requestUrl).toContain('page=2');
    expect(requestUrl).toContain('name=rick');
  });

  it('returns an error when characters request fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createJsonResponse({ error: 'Not found' }, 404));

    vi.stubGlobal('fetch', fetchMock);

    const store = createTestStore();

    const result = await store.dispatch(
      charactersApi.endpoints.getCharacters.initiate({
        searchTerm: 'unknown',
        page: 1,
      }),
    );

    expect(result.error).toBeDefined();
  });

  it('fetches character details by id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createJsonResponse(mockRick));

    vi.stubGlobal('fetch', fetchMock);

    const store = createTestStore();

    const result = await store.dispatch(
      charactersApi.endpoints.getCharacterById.initiate('1'),
    );

    expect(result.data).toEqual(mockRick);

    const requestUrl = getRequestUrl(fetchMock.mock.calls[0][0]);

    expect(requestUrl).toContain('/character/1');
  });

  it('returns an error when character details request fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createJsonResponse({ error: 'Not found' }, 404));

    vi.stubGlobal('fetch', fetchMock);

    const store = createTestStore();

    const result = await store.dispatch(
      charactersApi.endpoints.getCharacterById.initiate('999999'),
    );

    expect(result.error).toBeDefined();
  });
});
