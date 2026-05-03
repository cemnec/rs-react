import React from 'react';

import { fetchCharacters } from './api/charactersApi';
import CardList from './components/CardList';
import ErrorMessage from './components/ErrorMessage';
import Loader from './components/Loader';
import Search from './components/Search';
import { SEARCH_TERM_STORAGE_KEY } from './constants/storage';
import type { Character } from './types/character';

interface State {
  searchTerm: string;
  appliedSearchTerm: string;
  characters: Character[];
  page: number;
  loading: boolean;
  error: string | null;
}

class App extends React.Component<object, State> {
  state: State = {
    searchTerm: '',
    appliedSearchTerm: '',
    characters: [],
    page: 1,
    loading: false,
    error: null,
  };

  componentDidMount(): void {
    const saved = localStorage.getItem(SEARCH_TERM_STORAGE_KEY) ?? '';

    this.setState(
      {
        searchTerm: saved,
        appliedSearchTerm: saved,
      },
      () => {
        void this.loadCharacters();
      },
    );
  }

  handleSearchChange = (value: string): void => {
    this.setState({ searchTerm: value });
  };

  handleSearchSubmit = (): void => {
    const trimmed = this.state.searchTerm.trim();

    if (trimmed === this.state.appliedSearchTerm) return;

    localStorage.setItem(SEARCH_TERM_STORAGE_KEY, trimmed);

    this.setState(
      {
        appliedSearchTerm: trimmed,
        searchTerm: trimmed,
        page: 1,
      },
      () => {
        void this.loadCharacters();
      },
    );
  };

  loadCharacters = async (): Promise<void> => {
    this.setState({ loading: true, error: null });

    try {
      const data = await fetchCharacters(
        this.state.appliedSearchTerm,
        this.state.page,
      );

      this.setState({
        characters: data.results,
        loading: false,
      });
    } catch {
      this.setState({
        characters: [],
        loading: false,
        error: 'Characters not found. Try another search term.',
      });
    }
  };

  handleNextPage = (): void => {
    this.setState(
      (prevState) => ({
        page: prevState.page + 1,
      }),
      () => {
        void this.loadCharacters();
      },
    );
  };

  handlePrevPage = (): void => {
    if (this.state.page === 1) return;

    this.setState(
      (prevState) => ({
        page: prevState.page - 1,
      }),
      () => {
        void this.loadCharacters();
      },
    );
  };

  render(): React.ReactNode {
    return (
      <main>
        <h1>Rick and Morty Characters</h1>

        <Search
          searchTerm={this.state.searchTerm}
          onSearchChange={this.handleSearchChange}
          onSearchSubmit={this.handleSearchSubmit}
        />

        {this.state.loading && <Loader />}

        {this.state.error && <ErrorMessage message={this.state.error} />}

        {!this.state.loading && !this.state.error && (
          <CardList characters={this.state.characters} />
        )}

        {!this.state.loading && !this.state.error && (
          <>
            <CardList characters={this.state.characters} />

            <div>
              <button
                onClick={this.handlePrevPage}
                disabled={this.state.page === 1}
              >
                Prev
              </button>

              <span> Page {this.state.page} </span>

              <button onClick={this.handleNextPage}>Next</button>
            </div>
          </>
        )}
      </main>
    );
  }
}

export default App;
