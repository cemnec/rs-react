import type { ChangeEvent, FormEvent, ReactElement } from 'react';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

function Search({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}: Props): ReactElement {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search characters"
      />

      <button type="submit">Search</button>
    </form>
  );
}

export default Search;
