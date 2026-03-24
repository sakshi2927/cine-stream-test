import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders without crashing', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays the default placeholder', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
  });

  it('displays custom placeholder from props', () => {
    const mockOnChange = jest.fn();
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        placeholder="Find your movie"
      />
    );
    expect(screen.getByPlaceholderText('Find your movie')).toBeInTheDocument();
  });

  it('displays value from props', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar value="Inception" onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('Inception')).toBeInTheDocument();
  });

  it('renders a search button next to input', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('calls onSearch with the current value when clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const mockOnSearch = jest.fn();

    render(<SearchBar value="Avatar" onChange={mockOnChange} onSearch={mockOnSearch} />);

    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(mockOnSearch).toHaveBeenCalledWith('Avatar');
  });
});
