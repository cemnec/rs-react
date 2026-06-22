import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { toggleSelectedItem } from '@/store/selectedItemsSlice';
import { mockSelectedRick } from '@/test-utils/mockCharacters';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import SelectedItemsFlyout from './SelectedItemsFlyout';

describe('SelectedItemsFlyout', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

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

  it('downloads CSV from server route', async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response('id,name\r\n1,Rick Sanchez', {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
        },
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const createObjectUrlMock = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-url');

    const revokeObjectUrlMock = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined);

    const anchorClickMock = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    const { store } = renderWithProviders(<SelectedItemsFlyout />);

    act(() => {
      store.dispatch(toggleSelectedItem(mockSelectedRick));
    });

    await user.click(screen.getByRole('button', { name: 'Download CSV' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/selected-items-csv', {
        body: JSON.stringify({ items: [mockSelectedRick] }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
    });

    expect(createObjectUrlMock).toHaveBeenCalledTimes(1);
    expect(anchorClickMock).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:mock-url');
  });
});
