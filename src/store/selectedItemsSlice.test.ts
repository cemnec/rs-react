import { describe, expect, it } from 'vitest';

import { mockSelectedRick } from '../test-utils/mockCharacters.ts';
import selectedItemsReducer, {
  clearSelectedItems,
  removeSelectedItem,
  type SelectedItemsState,
  toggleSelectedItem,
} from './selectedItemsSlice';

describe('selectedItemsSlice', () => {
  it('adds an item when it is not selected', () => {
    const state: SelectedItemsState = selectedItemsReducer(
      undefined,
      toggleSelectedItem(mockSelectedRick),
    );

    expect(state.items).toEqual([mockSelectedRick]);
  });

  it('removes an item when it is already selected', () => {
    const initialState = {
      items: [mockSelectedRick],
    };

    const state: SelectedItemsState = selectedItemsReducer(
      initialState,
      toggleSelectedItem(mockSelectedRick),
    );

    expect(state.items).toEqual([]);
  });

  it('removes selected item by id', () => {
    const initialState = {
      items: [mockSelectedRick],
    };

    const state: SelectedItemsState = selectedItemsReducer(
      initialState,
      removeSelectedItem(mockSelectedRick.id),
    );

    expect(state.items).toEqual([]);
  });

  it('clears all selected items', () => {
    const initialState = {
      items: [mockSelectedRick],
    };

    const state: SelectedItemsState = selectedItemsReducer(
      initialState,
      clearSelectedItems(),
    );

    expect(state.items).toEqual([]);
  });
});
