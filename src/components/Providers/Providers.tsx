'use client';

import { type ReactNode, useState } from 'react';
import { Provider } from 'react-redux';

import { type AppStore, createAppStore } from '@/store/store';

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  const [store] = useState<AppStore>(() => createAppStore());

  return <Provider store={store}>{children}</Provider>;
}
