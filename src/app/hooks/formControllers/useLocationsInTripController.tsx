import { Control, FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { LocationInTripFormData, TripFormData } from '@/app/hooks/forms/useTripForm';
import { TripFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export interface LocationsInTripController {
  fields: FieldArrayWithId<TripFormData, TripFormFieldPath.Locations>[];
  append: (location: LocationInTripFormData) => void;
  deleteLocationById: (id: string) => void;
  updateLocationById: (id: string, updatedLocation: LocationInTripFormData) => void;
  moveLocationInArray: (from: number, to: number) => void;
}

export const useLocationsInTripController = (control?: Control<TripFormData>): LocationsInTripController => {
  const { fields, append, remove, move, update } = useFieldArray<TripFormData, TripFormFieldPath.Locations>({
    name: TripFormFieldPath.Locations,
    // @ts-expect-error: prevents react-hook-form from changing the id
    keyName: 'customId',
    control,
  });

  const getRowIndexById = (id: string) => {
    return fields.findIndex((location) => location.id === id);
  };

  const updateLocationById = (id: string, updatedLocation: LocationInTripFormData) => {
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
