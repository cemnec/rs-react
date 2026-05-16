import { type ReactElement, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';

import { fetchCharacterById } from '../../api/charactersApi';
import ErrorMessage from '../../components/ErrorMessage';
import Loader from '../../components/Loader';
import type { Character } from '../../types/character';

function CharacterDetailsPage(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted: boolean = true;

    const loadCharacter = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const data: Character = await fetchCharacterById(id);

        if (!isMounted) return;

        setCharacter(data);
      } catch {
        if (!isMounted) return;

        setCharacter(null);
        setError('Character details not found.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCharacter();

    return () => {
      isMounted = false;
    };
  }, [id]);

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
      ></Link>

      <h2>Character details</h2>

      {loading && <Loader />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && character && (
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
