import type { ReactElement } from 'react';
import { NavLink } from 'react-router';

function Header(): ReactElement {
  return (
    <header className="app-header">
      <nav className="navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  );
}

export default Header;
