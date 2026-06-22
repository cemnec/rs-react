import { describe, expect, it } from 'vitest';

import { mockSelectedRick } from '@/test-utils/mockCharacters';

import selectedItemsReducer, {
  clearSelectedItems,
  toggleSelectedItem,
} from './selectedItemsSlice';

describe('selectedItemsSlice', () => {
  it('adds an item when it is not selected', () => {
    const state = selectedItemsReducer(
      undefined,
      toggleSelectedItem(mockSelectedRick),
    );

    expect(state.items).toEqual([mockSelectedRick]);
  });

  it('removes an item when it is already selected', () => {
    const state = selectedItemsReducer(
      { items: [mockSelectedRick] },
      toggleSelectedItem(mockSelectedRick),
    );

    expect(state.items).toEqual([]);
  });

  it('clears all selected items', () => {
    const state = selectedItemsReducer(
      { items: [mockSelectedRick] },
      clearSelectedItems(),
    );

    expect(state.items).toEqual([]);
  });
});
