import { TripFormData } from '@/app/hooks/forms/useTripForm';
import { Control, useFieldArray } from 'react-hook-form';
import { TripFormFieldPath } from '@/app/components/constants/locationFormFieldPath';

export const usePermissionsController = (control?: Control<TripFormData>) => {
  const { fields, append, remove, update } = useFieldArray<TripFormData, TripFormFieldPath.Permissions>({
    name: TripFormFieldPath.Permissions,
    control,
  });

  const deletePermissionById = (id: string) => {
    const index = fields.findIndex((permission) => permission.id === id);
    if (index !== -1) {
      remove(index);
    }
  };

  return {
    fields,
    append,
    remove,
    update,
    deletePermissionById,
  };
};
