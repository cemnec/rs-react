import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { toggleSelectedItem } from '../../store/selectedItemsSlice';
import { mockSelectedRick } from '../../test-utils/mockCharacters';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import SelectedItemsFlyout from './SelectedItemsFlyout';

describe('SelectedItemsFlyout', () => {
  it('does not render when there are no selected items', () => {
    renderWithProviders(<SelectedItemsFlyout />);

    expect(
      screen.queryByLabelText(/selected items panel/i),
    ).not.toBeInTheDocument();
  });

  it('displays selected items count', () => {
    const { store } = renderWithProviders(<SelectedItemsFlyout />);

    act(() => {
      store.dispatch(toggleSelectedItem(mockSelectedRick));
    });

    expect(screen.getByText(/selected items:/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('clears selected items when Unselect all is clicked', async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<SelectedItemsFlyout />);

    act(() => {
      store.dispatch(toggleSelectedItem(mockSelectedRick));
    });

    expect(screen.getByLabelText(/selected items panel/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(store.getState().selectedItems.items).toHaveLength(0);
    expect(
      screen.queryByLabelText(/selected items panel/i),
    ).not.toBeInTheDocument();
  });
});
