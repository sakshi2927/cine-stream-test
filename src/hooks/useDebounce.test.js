import { renderHook, waitFor } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce Hook', () => {
  it('initializes with the initial value', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('returns debounced value when prop changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 100 } }
    );

    expect(result.current).toBe('hello');

    rerender({ value: 'world', delay: 100 });
    expect(result.current).toBe('hello');

    await waitFor(
      () => {
        expect(result.current).toBe('world');
      },
      { timeout: 200 }
    );
  });

  it('cancels previous timeout when value changes quickly', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 200 } }
    );

    rerender({ value: 'ab', delay: 200 });
    await new Promise((resolve) => setTimeout(resolve, 100));

    rerender({ value: 'abc', delay: 200 });
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current).toBe('a');

    await waitFor(
      () => {
        expect(result.current).toBe('abc');
      },
      { timeout: 300 }
    );
  });

  it('works with numbers', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 5, delay: 100 } }
    );

    expect(result.current).toBe(5);

    rerender({ value: 42, delay: 100 });

    await waitFor(
      () => {
        expect(result.current).toBe(42);
      },
      { timeout: 200 }
    );
  });

  it('works with custom delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'start', delay: 50 } }
    );

    rerender({ value: 'end', delay: 50 });

    await waitFor(
      () => {
        expect(result.current).toBe('end');
      },
      { timeout: 150 }
    );
  });

  it('handles null values', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 100 } }
    );

    rerender({ value: null, delay: 100 });

    await waitFor(
      () => {
        expect(result.current).toBe(null);
      },
      { timeout: 200 }
    );
  });

  it('handles undefined values', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 100 } }
    );

    rerender({ value: undefined, delay: 100 });

    await waitFor(
      () => {
        expect(result.current).toBe(undefined);
      },
      { timeout: 200 }
    );
  });
});
