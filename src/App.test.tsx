import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from './App';
import { toggleSelectedItem } from './store/selectedItemsSlice';
import { type AppStore, createAppStore } from './store/store';
import {
  mockCharactersResponse,
  mockRick,
  mockSelectedRick,
} from './test-utils/mockCharacters';
import { renderWithProviders } from './test-utils/renderWithProviders';

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

  return String(request);
};

const mockAppFetch = (): ReturnType<typeof vi.fn> => {
  const fetchMock = vi.fn<typeof fetch>((request) => {
    const requestUrl = getRequestUrl(request);

    if (requestUrl.includes('/character/1')) {
      return Promise.resolve(createJsonResponse(mockRick));
    }

    return Promise.resolve(createJsonResponse(mockCharactersResponse));
  });

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

const renderApp = (initialEntry = '/?page=1', store?: AppStore) => {
  return renderWithProviders(<App />, {
    route: initialEntry,
    store,
  });
};

describe('App routes', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();

    mockAppFetch();
  });

  it('renders main page on root route', async () => {
    renderApp('/?page=1');

    expect(
      screen.getByRole('heading', { name: /rick and morty characters/i }),
    ).toBeInTheDocument();

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('renders about page on /about route', () => {
    renderApp('/about');

    expect(
      screen.getByRole('heading', { name: /about this app/i }),
    ).toBeInTheDocument();
  });

  it('renders not found page on unknown route', () => {
    renderApp('/some-wrong-page');

    expect(
      screen.getByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
  });

  it('keeps selected items flyout available outside the main page route', () => {
    const store = createAppStore();

    store.dispatch(toggleSelectedItem(mockSelectedRick));

    renderApp('/about', store);

    expect(screen.getByLabelText(/selected items panel/i)).toBeInTheDocument();
    expect(screen.getByText(/selected items:/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders character details route inside main page', async () => {
    const fetchMock = vi.mocked(fetch);

    renderApp('/characters/1?page=1');

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /character details/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      const urls = fetchMock.mock.calls.map(([request]) =>
        getRequestUrl(request),
      );

      expect(urls.some((url) => url.includes('/character/1'))).toBe(true);
    });
  });
});
