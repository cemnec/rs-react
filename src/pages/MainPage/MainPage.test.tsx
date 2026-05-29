import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCharacters } from '../../api/charactersApi';
import ErrorBoundary from '../../components/ErrorBoundary';
import { SEARCH_TERM_STORAGE_KEY } from '../../constants/storage';
import {
  mockCharactersResponse,
  mockMorty,
  mockSinglePageResponse,
} from '../../test-utils/mockCharacters';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import MainPage from './MainPage';

vi.mock('../../api/charactersApi', () => ({
  fetchCharacters: vi.fn(),
}));

const mockedFetchCharacters = vi.mocked(fetchCharacters);

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
    mockedFetchCharacters.mockReset();
    mockedFetchCharacters.mockResolvedValue(mockCharactersResponse);
  });

  it('loads and displays characters on initial render', async () => {
    renderMainPage();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();

    expect(mockedFetchCharacters).toHaveBeenCalledWith('', 1);
  });

  it('shows an error message when API request fails', async () => {
    mockedFetchCharacters.mockRejectedValueOnce(new Error('API error'));

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
      expect(mockedFetchCharacters).toHaveBeenCalledWith('morty', 1);
    });
  });

  it('submits trimmed search term and saves it to localStorage', async () => {
    const user = userEvent.setup();

    mockedFetchCharacters
      .mockResolvedValueOnce(mockCharactersResponse)
      .mockResolvedValueOnce(mockSinglePageResponse);

    renderMainPage();

    await screen.findByText('Rick Sanchez');

    mockedFetchCharacters.mockClear();

    const input = screen.getByPlaceholderText(/search characters/i);

    await user.clear(input);
    await user.type(input, '  rick  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith('rick', 1);
    });

    expect(localStorage.getItem(SEARCH_TERM_STORAGE_KEY)).toBe('rick');
    expect(input).toHaveValue('rick');
  });

  it('does not make a new request when submitted search term has not changed', async () => {
    const user = userEvent.setup();

    localStorage.setItem(SEARCH_TERM_STORAGE_KEY, 'rick');

    renderMainPage();

    await screen.findByDisplayValue('rick');
    await screen.findByText('Rick Sanchez');

    mockedFetchCharacters.mockClear();

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockedFetchCharacters).not.toHaveBeenCalled();
  });

  it('sets default page query parameter when it is missing from URL', async () => {
    renderMainPage('/');

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith('', 1);
    });
  });

  it('loads page from URL search params', async () => {
    renderMainPage('/?page=2');

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith('', 2);
    });
  });

  it('resets page to 1 when search input changes', async () => {
    const user = userEvent.setup();

    renderMainPage('/?page=2');

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith('', 2);
    });

    mockedFetchCharacters.mockClear();

    await user.type(screen.getByRole('textbox'), 'r');

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith('', 1);
    });
  });

  it('handles pagination with next and previous buttons', async () => {
    const user = userEvent.setup();

    mockedFetchCharacters
      .mockResolvedValueOnce(mockCharactersResponse)
      .mockResolvedValueOnce({
        info: {
          count: 1,
          pages: 2,
          next: null,
          prev: 'https://rickandmortyapi.com/api/character?page=1',
        },
        results: [mockMorty],
      })
      .mockResolvedValueOnce(mockCharactersResponse);

    renderMainPage();

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    mockedFetchCharacters.mockClear();

    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith('', 2);
    });

    expect(await screen.findByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();

    mockedFetchCharacters.mockClear();

    await user.click(screen.getByRole('button', { name: /prev/i }));

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith('', 1);
    });

    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
  });

  it('renders ErrorBoundary fallback when Throw Error button is clicked', async () => {
    const user = userEvent.setup();

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    renderMainPageWithErrorBoundary();

    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
