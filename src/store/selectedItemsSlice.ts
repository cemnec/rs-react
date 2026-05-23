import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Character } from '../types/character';

export interface SelectedItem extends Character {
  detailsUrl: string;
}

export interface SelectedItemsState {
  items: SelectedItem[];
}

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelectedItem: (state, action: PayloadAction<SelectedItem>) => {
      const item: SelectedItem = action.payload;
      const isAlreadySelected: boolean = state.items.some(
        (selectedItem) => selectedItem.id === item.id,
      );

      if (isAlreadySelected) {
        state.items = state.items.filter(
          (selectedItem) => selectedItem.id !== item.id,
        );
        return;
      }

      state.items = [...state.items, item];
    },

    removeSelectedItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (selectedItem) => selectedItem.id !== action.payload,
      );
    },

    clearSelectedItems: (state) => {
      state.items = [];
    },
  },
});

export const { toggleSelectedItem, removeSelectedItem, clearSelectedItems } =
  selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;
