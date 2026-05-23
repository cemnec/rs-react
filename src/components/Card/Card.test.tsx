import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { mockRick } from '../../test-utils/mockCharacters';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import Card from './Card';

describe('Card', () => {
  it('renders character information', () => {
    renderWithProviders(<Card character={mockRick} />);

    expect(
      screen.getByRole('heading', { name: /rick sanchez/i }),
    ).toBeInTheDocument();

    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();

    expect(screen.getByRole('img', { name: /rick sanchez/i })).toHaveAttribute(
      'src',
      mockRick.image,
    );
  });

  it('selects and unselects character using checkbox', async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<Card character={mockRick} />);

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

  it('keeps character details link with current page query', () => {
    renderWithProviders(<Card character={mockRick} />, {
      route: '/?page=2',
    });

    expect(screen.getByRole('link', { name: /rick sanchez/i })).toHaveAttribute(
      'href',
      '/characters/1?page=2',
    );
  });
});
