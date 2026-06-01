import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundary from '../../components/ErrorBoundary';
import { SEARCH_TERM_STORAGE_KEY } from '../../constants/storage';
import {
  mockCharactersResponse,
  mockMorty,
  mockSinglePageResponse,
} from '../../test-utils/mockCharacters';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import MainPage from './MainPage';

interface MockResponseConfig {
  body: unknown;
  status?: number;
}

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

const getFetchUrls = (fetchMock: ReturnType<typeof vi.fn>): string[] => {
  return fetchMock.mock.calls.map(([request]) => getRequestUrl(request));
};

const mockFetchResponses = (
  ...responses: MockResponseConfig[]
): ReturnType<typeof vi.fn> => {
  const fetchMock = vi.fn<typeof fetch>();
  const fallbackResponse: MockResponseConfig = responses.at(-1) ?? {
    body: mockCharactersResponse,
  };

  for (const { body, status = 200 } of responses) {
    fetchMock.mockResolvedValueOnce(createJsonResponse(body, status));
  }

  fetchMock.mockImplementation(() =>
    Promise.resolve(
      createJsonResponse(fallbackResponse.body, fallbackResponse.status),
    ),
  );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

const mockFetchCharacters = (body: unknown, status = 200) => {
  return mockFetchResponses({ body, status });
};

const renderMainPage = (initialEntry = '/?page=1') => {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>,
    {
      route: initialEntry,
    },
  );
};

const renderMainPageWithErrorBoundary = (initialEntry = '/?page=1') => {
  return renderWithProviders(
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </ErrorBoundary>,
    {
      route: initialEntry,
    },
  );
};

describe('MainPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();

    mockFetchCharacters(mockCharactersResponse);
  });

  it('loads and displays characters on initial render', async () => {
    const fetchMock = vi.mocked(fetch);

    renderMainPage();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();

    const requestUrl = getRequestUrl(fetchMock.mock.calls[0][0]);

    expect(requestUrl).toContain('/character');
    expect(requestUrl).toContain('page=1');
  });

  it('shows an error message when API request fails', async () => {
    mockFetchCharacters({ error: 'API error' }, 500);

    renderMainPage();

    expect(
      await screen.findByText(/characters not found/i),
    ).toBeInTheDocument();
  });

  it('restores search term from localStorage on page start', async () => {
    localStorage.setItem(SEARCH_TERM_STORAGE_KEY, 'morty');

    renderMainPage();

    expect(await screen.findByDisplayValue('morty')).toBeInTheDocument();

    await waitFor(() => {
      const fetchMock = vi.mocked(fetch);
      const urls = getFetchUrls(fetchMock);

      expect(urls.some((url) => url.includes('/character'))).toBe(true);
      expect(urls.some((url) => url.includes('page=1'))).toBe(true);
      expect(urls.some((url) => url.includes('name=morty'))).toBe(true);
    });
  });

  it('submits trimmed search term and saves it to localStorage', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchResponses(
      { body: mockCharactersResponse },
      { body: mockSinglePageResponse },
    );

    renderMainPage();

    await screen.findByText('Rick Sanchez');

    fetchMock.mockClear();

    const input = screen.getByPlaceholderText(/search characters/i);

    await user.clear(input);
    await user.type(input, '  rick  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      const urls = getFetchUrls(fetchMock);

      expect(urls.some((url) => url.includes('/character'))).toBe(true);
      expect(urls.some((url) => url.includes('page=1'))).toBe(true);
      expect(urls.some((url) => url.includes('name=rick'))).toBe(true);
    });

    expect(localStorage.getItem(SEARCH_TERM_STORAGE_KEY)).toBe('rick');
    expect(input).toHaveValue('rick');
  });

  it('does not make a new request when submitted search term has not changed', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch);

    localStorage.setItem(SEARCH_TERM_STORAGE_KEY, 'rick');

    renderMainPage();

    await screen.findByDisplayValue('rick');
    await screen.findByText('Rick Sanchez');

    fetchMock.mockClear();

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sets default page query parameter when it is missing from URL', async () => {
    renderMainPage('/');

    await waitFor(() => {
      const fetchMock = vi.mocked(fetch);
      const urls = getFetchUrls(fetchMock);

      expect(urls.some((url) => url.includes('/character'))).toBe(true);
      expect(urls.some((url) => url.includes('page=1'))).toBe(true);
    });
  });

  it('loads page from URL search params', async () => {
    renderMainPage('/?page=2');

    await waitFor(() => {
      const fetchMock = vi.mocked(fetch);
      const urls = getFetchUrls(fetchMock);

      expect(urls.some((url) => url.includes('/character'))).toBe(true);
      expect(urls.some((url) => url.includes('page=2'))).toBe(true);
    });
  });

  it('resets page to 1 when search input changes', async () => {
    const user = userEvent.setup();

    renderMainPage('/?page=2');

    await waitFor(() => {
      const fetchMock = vi.mocked(fetch);
      const urls = getFetchUrls(fetchMock);

      expect(urls.some((url) => url.includes('/character'))).toBe(true);
      expect(urls.some((url) => url.includes('page=2'))).toBe(true);
    });

    await user.type(screen.getByRole('textbox'), 'r');

    await waitFor(() => {
      const fetchMock = vi.mocked(fetch);
      const urls = getFetchUrls(fetchMock);

      expect(urls.some((url) => url.includes('page=1'))).toBe(true);
    });
  });

  it('handles pagination with next and previous buttons', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchResponses(
      { body: mockCharactersResponse },
      {
        body: {
          info: {
            count: 1,
            pages: 2,
            next: null,
            prev: 'https://rickandmortyapi.com/api/character?page=1',
          },
          results: [mockMorty],
        },
      },
      { body: mockCharactersResponse },
    );

    renderMainPage();

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      const urls = getFetchUrls(fetchMock);

      expect(urls.some((url) => url.includes('page=2'))).toBe(true);
    });

    expect(await screen.findByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();

    const callsBeforeReturningToPageOne = fetchMock.mock.calls.length;

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(callsBeforeReturningToPageOne);
  });

  it('renders ErrorBoundary fallback when Throw Error button is clicked', async () => {
    const user = userEvent.setup();

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    renderMainPageWithErrorBoundary();

    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('manually refreshes characters list when Refresh button is clicked', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchResponses(
      { body: mockCharactersResponse },
      {
        body: {
          info: {
            count: 1,
            pages: 1,
            next: null,
            prev: null,
          },
          results: [mockMorty],
        },
      },
    );

    renderMainPage();

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    const urls = getFetchUrls(fetchMock);

    expect(urls.at(-1)).toContain('/character');
    expect(urls.at(-1)).toContain('page=1');
  });
});
