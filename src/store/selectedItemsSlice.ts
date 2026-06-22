import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SelectedItem } from '@/types/selectedItem';

type SelectedItemsState = {
  items: SelectedItem[];
};

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelectedItem(state, action: PayloadAction<SelectedItem>) {
      const item = action.payload;
      const existingIndex = state.items.findIndex(
        (selectedItem) => selectedItem.id === item.id,
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
        return;
      }

      state.items.push(item);
    },
    clearSelectedItems(state) {
      state.items = [];
    },
  },
});

export const { clearSelectedItems, toggleSelectedItem } =
  selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;
