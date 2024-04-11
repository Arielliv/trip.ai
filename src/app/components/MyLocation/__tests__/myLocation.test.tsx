import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyLocation from '@/app/components/MyLocation/MyLocation';

describe('MyLocation', () => {
  it('renders correctly', () => {
    // create mock focusMarker

    render(<MyLocation />);

    const loadScriptElements = screen.getAllByTestId('load-script');
    expect(loadScriptElements).toHaveLength(2);
  });
});
