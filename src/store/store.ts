import { configureStore } from '@reduxjs/toolkit';

import selectedItemsReducer from './selectedItemsSlice';

export const createAppStore = () => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });
};

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
