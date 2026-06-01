import { type ReactElement, useEffect, useState } from 'react';
import { Outlet, useMatch, useSearchParams } from 'react-router';

import { charactersApi, useGetCharactersQuery } from '../../api/charactersApi';
import CardList from '../../components/CardList';
import ErrorMessage from '../../components/ErrorMessage';
import Loader from '../../components/Loader';
import Search from '../../components/Search';
import { SEARCH_TERM_STORAGE_KEY } from '../../constants/storage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAppDispatch } from '../../store/hooks';

function MainPage(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const pageParam: string | null = searchParams.get('page');
  const parsedPage: number = Number(pageParam);

  const page: number =
    !pageParam || Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const [searchTerm, setSearchTerm] = useLocalStorage(
    SEARCH_TERM_STORAGE_KEY,
    '',
  );

  const [appliedSearchTerm, setAppliedSearchTerm] = useState(searchTerm);
  const [hasCrash, setHasCrash] = useState(false);

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

  const { data, isLoading, isFetching, isError } = useGetCharactersQuery(
    {
      searchTerm: appliedSearchTerm,
      page,
    },
    {
      skip: !hasPageParam,
    },
  );

  const characters = data?.results ?? [];
  const totalPages = data?.info.pages ?? 1;
  const hasCharacters: boolean = characters.length > 0;
  const isInitialLoading: boolean = isLoading || (isFetching && !data);
  const errorMessage: string | null = isError
    ? 'Characters not found. Try another search term.'
    : null;

  const detailsMatch = useMatch('/characters/:id');
  const hasDetails = Boolean(detailsMatch);

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

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);

    if (page !== 1) {
      setSearchParams((prevParams: URLSearchParams): URLSearchParams => {
        const nextParams = new URLSearchParams(prevParams);
        nextParams.set('page', '1');
        return nextParams;
      });
    }
  };

  const handleRefresh = (): void => {
    dispatch(
      charactersApi.util.invalidateTags([{ type: 'Characters', id: 'LIST' }]),
    );
  };

  const triggerError = (): void => {
    setHasCrash(true);
  };

  if (hasCrash) {
    throw new Error('Test error for ErrorBoundary');
  }

  return (
    <main>
      <h1>Rick and Morty Characters</h1>

      <section className="search-section">
        <Search
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
      </section>

      <section className="results-section">
        {isInitialLoading && <Loader />}

        {errorMessage && <ErrorMessage message={errorMessage} />}

        {!isInitialLoading && !errorMessage && hasCharacters && (
          <div
            className={
              hasDetails ? 'content-layout with-details' : 'content-layout'
            }
          >
            <CardList characters={characters} />

            {hasDetails && (
              <section className="details-section">
                <Outlet />
              </section>
            )}
          </div>
        )}

        {!isInitialLoading && !errorMessage && !hasCharacters && (
          <p className="empty-message">No results</p>
        )}

        <div className="bottom-controls">
          {!isInitialLoading && !errorMessage && hasCharacters && (
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

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching || !hasPageParam}
          >
            {isFetching && !isInitialLoading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button type="button" onClick={triggerError}>
            Throw Error
          </button>
        </div>
      </section>
    </main>
  );
}

export default MainPage;
