import type { ReactElement } from 'react';
import { Link } from 'react-router';

function NotFoundPage(): ReactElement {
  return (
    <main>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go to home page</Link>
    </main>
  );
}

export default NotFoundPage;
