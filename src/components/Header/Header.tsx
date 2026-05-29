import type { ReactElement } from 'react';
import { NavLink } from 'react-router';

import { useTheme } from '../../hooks/useTheme';

function Header(): ReactElement {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <nav className="navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
          }
          title={
            theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
          }
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}

export default Header;
