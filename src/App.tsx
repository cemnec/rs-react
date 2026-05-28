import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router';

import Header from './components/Header';
import SelectedItemsFlyout from './components/SelectedItemsFlyout';
import AboutPage from './pages/AboutPage';
import CharacterDetailsPage from './pages/CharacterDetailsPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';

function App(): ReactElement {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route path="characters/:id" element={<CharacterDetailsPage />} />
        </Route>

        <Route path="/about" element={<AboutPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <SelectedItemsFlyout />
    </>
  );
}

export default App;
