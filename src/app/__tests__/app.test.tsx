import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { appDriver } from '@/app/__tests__/app.driver';

describe('Page', () => {
  let driver: appDriver;

  beforeEach(() => {
    driver = new appDriver();
  });

  it('renders a heading', async () => {
    render(await Home());

    const main = screen.getByRole('main');

    expect(main).toBeDefined();
  });
});
