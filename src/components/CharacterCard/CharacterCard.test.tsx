import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { mockRick } from '@/test-utils/mockCharacters';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import CharacterCard from './CharacterCard';

describe('CharacterCard', () => {
  it('renders character information and details link', () => {
    renderWithProviders(
      <CharacterCard character={mockRick} page={2} query="rick" />,
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Alive — Human')).toBeInTheDocument();

    expect(screen.getByRole('img', { name: /rick sanchez/i })).toHaveAttribute(
      'src',
      mockRick.image,
    );

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/?page=2&selectedId=1&query=rick',
    );
  });

  it('selects and unselects character using checkbox', async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(
      <CharacterCard character={mockRick} page={1} query="" />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: /select rick sanchez/i,
    });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(store.getState().selectedItems.items).toHaveLength(1);
    expect(store.getState().selectedItems.items[0].id).toBe(mockRick.id);

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(store.getState().selectedItems.items).toHaveLength(0);
  });
});
