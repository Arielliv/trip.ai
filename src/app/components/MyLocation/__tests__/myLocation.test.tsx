import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Map from '@/app/components/Map/Map';
import MyLocation from '@/app/components/MyLocation/MyLocation';

describe('MyLocation', () => {
  it('renders correctly', () => {
    // create mock focusMarker

    render(<MyLocation />);
    expect(screen.getByTestId('load-script')).toBeInTheDocument();
  });
});
