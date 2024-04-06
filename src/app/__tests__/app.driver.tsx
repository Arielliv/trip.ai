import { fetchTrips } from '@/lib/data';
import { ITrip } from '@/models/Trip';
import { useSession } from 'next-auth/react';

export class appDriver {
  // Method to setup mock resolved value for fetchTrips
  givenFetchTripsMock(data: Partial<ITrip>[]) {
    (fetchTrips as jest.Mock).mockResolvedValue(data);
  }

  givenSession(session: any) {
    (useSession as jest.Mock).mockReturnValue(session);
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
