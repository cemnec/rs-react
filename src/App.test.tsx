import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCharacterById, fetchCharacters } from './api/charactersApi';
import App from './App';
import { toggleSelectedItem } from './store/selectedItemsSlice';
import { type AppStore, createAppStore } from './store/store';
import {
  mockCharactersResponse,
  mockRick,
  mockSelectedRick,
} from './test-utils/mockCharacters';
import { renderWithProviders } from './test-utils/renderWithProviders';

vi.mock('./api/charactersApi', () => ({
  fetchCharacters: vi.fn(),
  fetchCharacterById: vi.fn(),
}));

const mockedFetchCharacters = vi.mocked(fetchCharacters);
const mockedFetchCharacterById = vi.mocked(fetchCharacterById);

const renderApp = (initialEntry = '/?page=1', store?: AppStore) => {
  return renderWithProviders(<App />, {
    route: initialEntry,
    store,
  });
};

describe('App routes', () => {
  beforeEach(() => {
    mockedFetchCharacters.mockReset();
    mockedFetchCharacterById.mockReset();

    mockedFetchCharacters.mockResolvedValue(mockCharactersResponse);
    mockedFetchCharacterById.mockResolvedValue(mockRick);
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
    renderApp('/characters/1?page=1');

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /character details/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedFetchCharacterById).toHaveBeenCalledWith('1');
    });
  });
});
