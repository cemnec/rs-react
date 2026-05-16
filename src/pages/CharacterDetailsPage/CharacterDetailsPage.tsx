import type { ReactElement } from 'react';
import { useParams } from 'react-router';

function CharacterDetailsPage(): ReactElement {
  const { id } = useParams<{ id: string }>();

  return (
    <aside>
      <h2>Character details</h2>
      <p>Selected character ID: {id}</p>
    </aside>
  );
}

export default CharacterDetailsPage;
