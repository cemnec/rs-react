import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { toggleSelectedItem } from '@/store/selectedItemsSlice';
import { mockSelectedRick } from '@/test-utils/mockCharacters';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import SelectedItemsFlyout from './SelectedItemsFlyout';

describe('SelectedItemsFlyout', () => {
  it('does not render when there are no selected items', () => {
    renderWithProviders(<SelectedItemsFlyout />);

    expect(screen.queryByText(/selected characters/i)).not.toBeInTheDocument();
  });

  it('displays selected items count', () => {
    const { store } = renderWithProviders(<SelectedItemsFlyout />);

    act(() => {
      store.dispatch(toggleSelectedItem(mockSelectedRick));
    });

    expect(screen.getByText('1 selected characters')).toBeInTheDocument();
  });

  it('clears selected items', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<SelectedItemsFlyout />);

    act(() => {
      store.dispatch(toggleSelectedItem(mockSelectedRick));
    });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(store.getState().selectedItems.items).toHaveLength(0);
    expect(screen.queryByText('1 selected characters')).not.toBeInTheDocument();
  });

  it('renders form that posts selected items to server CSV route', () => {
    const { store } = renderWithProviders(<SelectedItemsFlyout />);

    act(() => {
      store.dispatch(toggleSelectedItem(mockSelectedRick));
    });

    const downloadButton = screen.getByRole('button', {
      name: 'Download CSV',
    });

    expect(downloadButton).toHaveAttribute('type', 'submit');

    const form = downloadButton.closest('form');

    if (!form) {
      throw new Error('Download form was not found');
    }

    expect(form).toHaveAttribute('action', '/api/selected-items-csv');
    expect(form).toHaveAttribute('method', 'post');

    const hiddenInput = form.querySelector<HTMLInputElement>(
      'input[name="items"]',
    );

    if (!hiddenInput) {
      throw new Error('Selected items hidden input was not found');
    }

    expect(hiddenInput).toHaveAttribute('type', 'hidden');
    expect(hiddenInput).toHaveValue(JSON.stringify([mockSelectedRick]));
  });
});
