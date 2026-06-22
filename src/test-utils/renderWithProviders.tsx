import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';

import { type AppStore, createAppStore } from '@/store/store';

type ExtendedRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  store?: AppStore;
};

type WrapperProps = {
  children: ReactNode;
};

export function renderWithProviders(
  ui: ReactElement,
  { store = createAppStore(), ...renderOptions }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: WrapperProps): ReactElement {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
