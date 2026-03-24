import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

function SearchHarness({ onSearch }) {
  const [query, setQuery] = useState('');

  return (
    <SearchBar value={query} onChange={setQuery} onSearch={onSearch} />
  );
}

describe('Search interactions', () => {
  it('handles search input typing', async () => {
    const user = userEvent.setup();
    render(<SearchHarness onSearch={jest.fn()} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Inception');

    expect(input).toHaveValue('Inception');
  });

  it('triggers search on button click with typed value', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchHarness onSearch={onSearch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Search' });

    await user.type(input, 'Avatar');
    await user.click(button);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('Avatar');
  });
});
