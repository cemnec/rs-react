import { configureStore } from '@reduxjs/toolkit';

import { charactersApi } from '../api/charactersApi';
import selectedItemsReducer from './selectedItemsSlice';

export const createAppStore = () => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [charactersApi.reducerPath]: charactersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(charactersApi.middleware),
  });
};

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
