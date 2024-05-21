import { screen } from '@testing-library/react';
import { DataTestIds } from '@/app/components/constants/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import { tripsDriver } from '@/app/trips/__tests__/app.driver';
import { TripsPaginationResponse } from '@/lib/types';
import { Types } from 'mongoose';
import { Visibility } from '@/models/constants';

describe('Trips', () => {
  let driver: tripsDriver;

  beforeEach(() => {
    driver = new tripsDriver();
  });

  it('should show one trip when there is one trip available', async () => {
    const dummyTripsPaginationResponse: TripsPaginationResponse = {
      trips: [
        {
          name: 'Discover Italy',
          participants_ids: [new Types.ObjectId()],
          permissions: [],
          locations: [],
          visibility: Visibility.Public,
          transportations: [],
          reviews: [],
        },
      ],
      page: 0,
      limit: 10,
      totalCount: 200,
      totalPages: 10,
    };
    driver.givenFetchTripsMock(dummyTripsPaginationResponse);
    await driver.created();
    driver.clickOnTabAt(1);

    expect(screen.getByTestId(DataTestIds.savedTripAt(0))).toBeInTheDocument();
  });
});
