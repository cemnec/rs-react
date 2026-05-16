import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router';

import AboutPage from './pages/AboutPage';
import CharacterDetailsPage from './pages/CharacterDetailsPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}>
        <Route path="characters/:id" element={<CharacterDetailsPage />} />
      </Route>

      <Route path="/about" element={<AboutPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
