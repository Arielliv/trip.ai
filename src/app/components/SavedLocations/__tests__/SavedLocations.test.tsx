import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SavedLocationsDriver } from '@/app/components/SavedLocations/__tests__/SavedLocations.driver';
import { ObjectId } from 'mongodb';
import { LocationPermissionEnum } from '@/models/enums/permissionsEnums';

describe('SavedLocations', () => {
  let driver: SavedLocationsDriver;

  beforeEach(() => {
    driver = new SavedLocationsDriver();
  });

  it('renders locations if present in the database', async () => {
    const mockLocations = [
      {
        id: 1,
        name: 'Location 1',
        imageUrl: 'http://example.com/img1.jpg',
        permissions: [
          { userId: new ObjectId('6621274fe078e5a753823333'), permissionType: LocationPermissionEnum.edit },
        ],
      },
      {
        id: 2,
        name: 'Location 2',
        imageUrl: 'http://example.com/img2.jpg',
        permissions: [
          { userId: new ObjectId('6621274fe078e5a7538250cd'), permissionType: LocationPermissionEnum.edit },
        ],
      },
    ];

    driver.givenFetchLocationMock({
      locations: mockLocations as any,
      page: 0,
      limit: 10,
      totalCount: 2,
      totalPages: 1,
    });

    await driver.created(mockLocations);
    const Location = screen.getAllByTestId('saved-location');

    expect(Location).toHaveLength(2);
    expect(await screen.findByText('Location 2')).toBeInTheDocument();
  });

  it('does not render locations if none are present in the database', async () => {
    driver.givenFetchLocationMock({
      locations: [],
      page: 0,
      limit: 10,
      totalCount: 0,
      totalPages: 0,
    });

    await driver.created([]);

    const message = await screen.findByText('No more locations');
    expect(message).toBeInTheDocument(); // Should show end message
    expect(screen.queryByText('Location 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Location 2')).not.toBeInTheDocument();
  });
});
