import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCharacterById } from '@/services/characters';
import { mockRick } from '@/test-utils/mockCharacters';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import CharacterDetails from './CharacterDetails';

vi.mock('@/services/characters', () => ({
  getCharacterById: vi.fn(),
}));

const getCharacterByIdMock = vi.mocked(getCharacterById);

describe('CharacterDetails', () => {
  beforeEach(() => {
    getCharacterByIdMock.mockReset();
  });

  it('renders character details', async () => {
    getCharacterByIdMock.mockResolvedValue(mockRick);

    renderWithProviders(
      await CharacterDetails({
        selectedId: '1',
        query: 'rick',
        page: 2,
      }),
    );

    expect(
      screen.getByRole('heading', { name: 'Rick Sanchez' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();

    expect(screen.getByLabelText('Close details')).toHaveAttribute(
      'href',
      '/?page=2&query=rick',
    );

    expect(getCharacterByIdMock).toHaveBeenCalledWith('1');
  });

  it('renders not found message when character does not exist', async () => {
    getCharacterByIdMock.mockResolvedValue(null);

    renderWithProviders(
      await CharacterDetails({
        selectedId: '999999',
        query: '',
        page: 1,
      }),
    );

    expect(screen.getByText('Character was not found.')).toBeInTheDocument();
  });
});
