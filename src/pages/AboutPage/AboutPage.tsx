import type { ReactElement } from 'react';

function AboutPage(): ReactElement {
  return (
    <main className="about-page">
      <section className="about-card">
        <p className="about-eyebrow">RS School React Course</p>

        <h1>About this app</h1>

        <p className="about-description">
          This application was created as part of the RS School React course. It
          allows users to search Rick and Morty characters, navigate through
          pages, and view detailed information about selected characters.
        </p>

        <div className="about-info">
          <p>
            <span>Author:</span> cemnec
          </p>

          <p>
            <span>Stack:</span> React, TypeScript, React Router, Vitest
          </p>
        </div>

        <a
          className="about-link"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          Open RS School React course
        </a>
      </section>
    </main>
  );
}

export default AboutPage;
