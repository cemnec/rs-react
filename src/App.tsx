import { type ReactElement } from 'react';
import { Route, Routes } from 'react-router';

import MainPage from './pages/MainPage';

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
}

export default App;
