import type { ReactElement } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';

import {
  charactersApi,
  useGetCharacterByIdQuery,
} from '../../api/charactersApi';
import ErrorMessage from '../../components/ErrorMessage';
import Loader from '../../components/Loader';
import { useAppDispatch } from '../../store/hooks';

function CharacterDetailsPage(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const {
    data: character,
    isLoading,
    isFetching,
    isError,
  } = useGetCharacterByIdQuery(id ?? '', {
    skip: !id,
  });

  const handleRefresh = (): void => {
    if (!id) return;

    dispatch(charactersApi.util.invalidateTags([{ type: 'Character', id }]));
  };

  const backSearch: string = searchParams.toString();

  return (
    <aside className="character-details">
      <Link
        className="character-details__close"
        to={{
          pathname: '/',
          search: backSearch,
        }}
        aria-label="Close character details"
      />

      <h2>Character details</h2>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={isFetching || !id}
      >
        {isFetching && !isLoading ? 'Refreshing...' : 'Refresh details'}
      </button>

      {isLoading && <Loader />}

      {isError && <ErrorMessage message="Character details not found." />}

      {!isLoading && !isError && character && (
        <>
          <img src={character.image} alt={character.name} />
          <h3>{character.name}</h3>
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
          <p>Gender: {character.gender}</p>
        </>
      )}
    </aside>
  );
}

export default CharacterDetailsPage;
