import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import Search from './Search';

describe('Search', () => {
  it('renders input and search button', () => {
    render(
      <Search
        searchTerm=""
        onSearchChange={vi.fn()}
        onSearchSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByPlaceholderText(/search characters/i),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders provided search term in the input', () => {
    render(
      <Search
        searchTerm="rick"
        onSearchChange={vi.fn()}
        onSearchSubmit={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue('rick')).toBeInTheDocument();
  });

  it('calls onSearchChange when user types in the input', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    function SearchWrapper(): React.ReactElement {
      const [searchTerm, setSearchTerm] = React.useState('');

      const handleSearchChange = (value: string): void => {
        setSearchTerm(value);
        onSearchChange(value);
      };

      return (
        <Search
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={vi.fn()}
        />
      );
    }

    render(<SearchWrapper />);

    const input = screen.getByPlaceholderText(/search characters/i);

    await user.type(input, 'rick');

    expect(onSearchChange).toHaveBeenCalled();
    expect(input).toHaveValue('rick');
    expect(onSearchChange).toHaveBeenLastCalledWith('rick');
  });

  it('calls onSearchSubmit when user clicks the search button', async () => {
    const user = userEvent.setup();
    const onSearchSubmit = vi.fn();

    render(
      <Search
        searchTerm="rick"
        onSearchChange={vi.fn()}
        onSearchSubmit={onSearchSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearchSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSearchSubmit when user presses Enter in the input', async () => {
    const user = userEvent.setup();
    const onSearchSubmit = vi.fn();

    render(
      <Search
        searchTerm="rick"
        onSearchChange={vi.fn()}
        onSearchSubmit={onSearchSubmit}
      />,
    );

    const input = screen.getByPlaceholderText(/search characters/i);

    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onSearchSubmit).toHaveBeenCalledTimes(1);
  });
});
