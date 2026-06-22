import { configureStore } from '@reduxjs/toolkit';

import selectedItemsReducer from './selectedItemsSlice';

export function createAppStore() {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
