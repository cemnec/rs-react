import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockRick } from '../../test-utils/mockCharacters';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import CharacterDetailsPage from './CharacterDetailsPage';

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

const mockFetchCharacter = (body: unknown, status = 200) => {
  const fetchMock = vi.fn<typeof fetch>();

  fetchMock.mockImplementation(() =>
    Promise.resolve(createJsonResponse(body, status)),
  );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

const renderCharacterDetailsPage = (initialEntry = '/characters/1?page=2') => {
  return renderWithProviders(
    <Routes>
      <Route path="/characters/:id" element={<CharacterDetailsPage />} />
    </Routes>,
    {
      route: initialEntry,
    },
  );
};

describe('CharacterDetailsPage', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();

    mockFetchCharacter(mockRick);
  });

  it('loads and displays character details by route id', async () => {
    const fetchMock = vi.mocked(fetch);

    renderCharacterDetailsPage('/characters/1?page=2');

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    const requestUrl = getRequestUrl(fetchMock.mock.calls[0][0]);

    expect(requestUrl).toContain('/character/1');
    expect(screen.getByText(/status:/i)).toBeInTheDocument();
    expect(screen.getByText(/species:/i)).toBeInTheDocument();
    expect(screen.getByText(/gender:/i)).toBeInTheDocument();
  });

  it('renders close details link and preserves current page query', async () => {
    renderCharacterDetailsPage('/characters/1?page=2');

    await screen.findByText('Rick Sanchez');

    expect(
      screen.getByRole('link', { name: /close character details/i }),
    ).toHaveAttribute('href', '/?page=2');
  });

  it('shows error message when character details request fails', async () => {
    const fetchMock = mockFetchCharacter({ error: 'Not found' }, 404);

    renderCharacterDetailsPage('/characters/999?page=1');

    expect(
      await screen.findByText(/character details not found/i),
    ).toBeInTheDocument();

    const requestUrl = getRequestUrl(fetchMock.mock.calls[0][0]);

    expect(requestUrl).toContain('/character/999');
  });

  it('does not fetch character details when id is missing', () => {
    const fetchMock = vi.mocked(fetch);

    renderWithProviders(
      <Routes>
        <Route path="/characters" element={<CharacterDetailsPage />} />
      </Routes>,
      {
        route: '/characters',
      },
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('manually refreshes character details when Refresh details button is clicked', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchCharacter(mockRick);

    renderCharacterDetailsPage('/characters/1?page=2');

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /refresh details/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    const requestUrl = getRequestUrl(fetchMock.mock.calls[1][0]);

    expect(requestUrl).toContain('/character/1');
  });
});
