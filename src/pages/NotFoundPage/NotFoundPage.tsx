import type { ReactElement } from 'react';
import { Link } from 'react-router';

function NotFoundPage(): ReactElement {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <p className="not-found-code">404</p>

        <h1>Page not found</h1>

        <p className="not-found-description">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link className="not-found-link" to="/?page=1">
          Back to home page
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
