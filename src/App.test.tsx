import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCharacterById, fetchCharacters } from './api/charactersApi';
import App from './App';
import { mockCharactersResponse, mockRick } from './test-utils/mockCharacters';

vi.mock('./api/charactersApi', () => ({
  fetchCharacters: vi.fn(),
  fetchCharacterById: vi.fn(),
}));

const mockedFetchCharacters = vi.mocked(fetchCharacters);
const mockedFetchCharacterById = vi.mocked(fetchCharacterById);

const renderApp = (initialEntry = '/?page=1') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  );
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

  it('renders character details route inside main page', async () => {
    renderApp('/characters/1?page=1');

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /character details/i }),
    ).toBeInTheDocument();

    expect(mockedFetchCharacterById).toHaveBeenCalledWith('1');
  });
});
