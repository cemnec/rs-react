import './index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { store } from './store/store';

const routerBasename: string | undefined =
  import.meta.env.BASE_URL === '/'
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={routerBasename}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
