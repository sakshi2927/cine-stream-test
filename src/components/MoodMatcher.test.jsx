import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoodMatcher from './MoodMatcher';
import * as openaiApi from '../api/openai';

jest.mock('../api/openai', () => ({
  getMoodMovie: jest.fn(),
}));

describe('MoodMatcher Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    openaiApi.getMoodMovie.mockResolvedValue('Inception');
    render(<MoodMatcher onFound={jest.fn()} />);
    expect(screen.getByPlaceholderText('I am feeling ...')).toBeInTheDocument();
  });

  it('displays the input field', () => {
    render(<MoodMatcher onFound={jest.fn()} />);
    expect(screen.getByPlaceholderText('I am feeling ...')).toBeInTheDocument();
  });

  it('displays submit button', () => {
    render(<MoodMatcher onFound={jest.fn()} />);
    expect(screen.getByRole('button', { name: /Get a movie/i })).toBeInTheDocument();
  });

  it('accepts text input', async () => {
    const user = userEvent.setup();
    render(<MoodMatcher onFound={jest.fn()} />);

    const input = screen.getByPlaceholderText('I am feeling ...');
    await user.type(input, 'adventurous');

    expect(input).toHaveValue('adventurous');
  });

  it('calls onFound with movie title on successful submit', async () => {
    const user = userEvent.setup();
    const mockOnFound = jest.fn();
    openaiApi.getMoodMovie.mockResolvedValue('Avatar');

    render(<MoodMatcher onFound={mockOnFound} />);

    const input = screen.getByPlaceholderText('I am feeling ...');
    const button = screen.getByRole('button', { name: /Get a movie/i });

    await user.type(input, 'adventurous');
    await user.click(button);

    expect(openaiApi.getMoodMovie).toHaveBeenCalledWith('adventurous');
    expect(mockOnFound).toHaveBeenCalledWith('Avatar');
  });

  it('shows loading state while fetching', async () => {
    const user = userEvent.setup();
    openaiApi.getMoodMovie.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('Avatar'), 100))
    );

    render(<MoodMatcher onFound={jest.fn()} />);

    const input = screen.getByPlaceholderText('I am feeling ...');
    const button = screen.getByRole('button');

    await user.type(input, 'happy');
    await user.click(button);

    expect(button).toHaveTextContent('Thinking...');
    expect(button).toBeDisabled();
  });

  it('displays error message on API failure', async () => {
    const user = userEvent.setup();
    const errorMessage = 'API request failed';
    openaiApi.getMoodMovie.mockRejectedValue(new Error(errorMessage));

    render(<MoodMatcher onFound={jest.fn()} />);

    const input = screen.getByPlaceholderText('I am feeling ...');
    const button = screen.getByRole('button');

    await user.type(input, 'sad');
    await user.click(button);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();
    openaiApi.getMoodMovie.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('Avatar'), 100))
    );

    render(<MoodMatcher onFound={jest.fn()} />);

    const input = screen.getByPlaceholderText('I am feeling ...');
    const button = screen.getByRole('button');

    await user.type(input, 'curious');
    await user.click(button);

    expect(button).toBeDisabled();
  });

  it('prevents submit with empty input', async () => {
    const user = userEvent.setup();
    const mockOnFound = jest.fn();

    render(<MoodMatcher onFound={mockOnFound} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(openaiApi.getMoodMovie).not.toHaveBeenCalled();
    expect(mockOnFound).not.toHaveBeenCalled();
  });

  it('applies correct CSS class to form', () => {
    const { container } = render(<MoodMatcher onFound={jest.fn()} />);
    expect(container.querySelector('.mood-form')).toBeInTheDocument();
  });

  it('displays error message with correct CSS class', async () => {
    const user = userEvent.setup();
    openaiApi.getMoodMovie.mockRejectedValue(new Error('Test error'));

    const { container } = render(<MoodMatcher onFound={jest.fn()} />);

    const input = screen.getByPlaceholderText('I am feeling ...');
    const button = screen.getByRole('button');

    await user.type(input, 'confused');
    await user.click(button);

    expect(container.querySelector('.error')).toBeInTheDocument();
  });
});
