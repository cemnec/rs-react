import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCharacterById } from '../../api/charactersApi';
import { mockRick } from '../../test-utils/mockCharacters';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import CharacterDetailsPage from './CharacterDetailsPage';

vi.mock('../../api/charactersApi', () => ({
  fetchCharacterById: vi.fn(),
}));

const mockedFetchCharacterById = vi.mocked(fetchCharacterById);

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
    mockedFetchCharacterById.mockReset();
    mockedFetchCharacterById.mockResolvedValue(mockRick);
  });

  it('loads and displays character details by route id', async () => {
    renderCharacterDetailsPage('/characters/1?page=2');

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    expect(mockedFetchCharacterById).toHaveBeenCalledWith('1');
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
    mockedFetchCharacterById.mockRejectedValueOnce(
      new Error('Character details not found'),
    );

    renderCharacterDetailsPage('/characters/999?page=1');

    expect(
      await screen.findByText(/character details not found/i),
    ).toBeInTheDocument();

    expect(mockedFetchCharacterById).toHaveBeenCalledWith('999');
  });

  it('does not fetch character details when id is missing', () => {
    renderWithProviders(
      <Routes>
        <Route path="/characters" element={<CharacterDetailsPage />} />
      </Routes>,
      {
        route: '/characters',
      },
    );

    expect(mockedFetchCharacterById).not.toHaveBeenCalled();
  });
});
