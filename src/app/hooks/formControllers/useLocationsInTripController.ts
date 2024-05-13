import { useFieldArray } from 'react-hook-form';
import { LocationInTrip, TripFormData } from '@/app/hooks/useTripForm';
import { TripFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export const useLocationsInTripController = () => {
  const { fields, append, remove, move, update } = useFieldArray<TripFormData, TripFormFieldPath.Locations>({
    name: TripFormFieldPath.Locations,
    // @ts-expect-error: prevents react-hook-form from changing the id
    keyName: 'customId',
  });

  const getRowIndexById = (id: string) => {
    return fields.findIndex((location) => location.id === id);
  };

  const updateLocationById = (id: string, updatedLocation: LocationInTrip) => {
    const index = getRowIndexById(id);
    if (index !== -1) {
      update(index, updatedLocation);
    }
  };

  const deleteLocationById = (id: string) => {
    const index = getRowIndexById(id);
    if (index !== -1) {
      remove(index);
    }
  };

  return {
    fields,
    append,
    deleteLocationById,
    updateLocationById,
    moveLocationInArray: move,
  };
};
