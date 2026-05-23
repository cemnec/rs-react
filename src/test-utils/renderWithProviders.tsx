import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

import { type AppStore, createAppStore } from '../store/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  store?: AppStore;
}

interface WrapperProps {
  children: ReactNode;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    route = '/?page=1',
    store = createAppStore(),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  function Wrapper({ children }: WrapperProps): ReactElement {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
