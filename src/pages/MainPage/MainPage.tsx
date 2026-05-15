import { type ReactElement, useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router';

import { fetchCharacters } from '../../api/charactersApi';
import CardList from '../../components/CardList';
import ErrorMessage from '../../components/ErrorMessage';
import Loader from '../../components/Loader';
import Search from '../../components/Search';
import { SEARCH_TERM_STORAGE_KEY } from '../../constants/storage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Character, CharactersResponse } from '../../types/character';

function MainPage(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam: string | null = searchParams.get('page');
  const parsedPage: number = Number(pageParam);

  const page: number =
    !pageParam || Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const [searchTerm, setSearchTerm] = useLocalStorage(
    SEARCH_TERM_STORAGE_KEY,
    '',
  );

  const [appliedSearchTerm, setAppliedSearchTerm] = useState(searchTerm);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCrash, setHasCrash] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (pageParam !== String(page)) {
      setSearchParams(
        (prevParams: URLSearchParams): URLSearchParams => {
          const nextParams = new URLSearchParams(prevParams);
          nextParams.set('page', String(page));
          return nextParams;
        },
        { replace: true },
      );
    }
  }, [page, pageParam, setSearchParams]);

  const hasPageParam: boolean = pageParam === String(page);

  useEffect(() => {
    if (!hasPageParam) return;

    let isMounted: boolean = true;

    const loadCharacters = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const data: CharactersResponse = await fetchCharacters(
          appliedSearchTerm,
          page,
        );

        if (!isMounted) return;

        setCharacters(data.results);
        setTotalPages(data.info.pages);
      } catch {
        if (!isMounted) return;

        setCharacters([]);
        setError('Characters not found. Try another search term.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCharacters();

    return () => {
      isMounted = false;
    };
  }, [appliedSearchTerm, page, hasPageParam]);

  const handleSearchSubmit = (): void => {
    const trimmed = searchTerm.trim();

    if (trimmed === appliedSearchTerm) {
      setSearchTerm(trimmed);
      return;
    }

    setSearchTerm(trimmed);
    setAppliedSearchTerm(trimmed);

    setSearchParams((prevParams: URLSearchParams): URLSearchParams => {
      const nextParams = new URLSearchParams(prevParams);
      nextParams.set('page', '1');
      return nextParams;
    });
  };

  const handleNextPage = (): void => {
    setSearchParams((prevParams: URLSearchParams): URLSearchParams => {
      const nextParams = new URLSearchParams(prevParams);
      nextParams.set('page', String(page + 1));
      return nextParams;
    });
  };

  const handlePrevPage = (): void => {
    if (page === 1) return;

    setSearchParams((prevParams: URLSearchParams): URLSearchParams => {
      const nextParams = new URLSearchParams(prevParams);
      nextParams.set('page', String(page - 1));
      return nextParams;
    });
  };

  const triggerError = (): void => {
    setHasCrash(true);
  };

  if (hasCrash) {
    throw new Error('Test error for ErrorBoundary');
  }

  const hasCharacters: boolean = characters.length > 0;

  return (
    <main>
      <h1>Rick and Morty Characters</h1>

      <section className="search-section">
        <Search
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />
      </section>

      <section className="results-section">
        {loading && <Loader />}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && hasCharacters && (
          <CardList characters={characters} />
        )}

        {!loading && !error && !hasCharacters && (
          <p className="empty-message">No results</p>
        )}

        <div className="bottom-controls">
          {!loading && !error && hasCharacters && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={page === 1}>
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button onClick={handleNextPage} disabled={page >= totalPages}>
                Next
              </button>
            </div>
          )}

          <button onClick={triggerError}>Throw Error</button>
        </div>
      </section>

      <Outlet />
    </main>
  );
}

export default MainPage;
