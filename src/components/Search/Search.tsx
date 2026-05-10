import React from 'react';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

class Search extends React.Component<Props> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.props.onSearchChange(event.target.value);
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    this.props.onSearchSubmit();
  };

  render(): React.ReactNode {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.props.searchTerm}
          onChange={this.handleChange}
          placeholder="Search characters"
        />

        <button type="submit">Search</button>
      </form>
    );
  }
}

export default Search;
