import { GridRowModel } from '@mui/x-data-grid-pro';
import { LocationInTripFormData } from '@/app/hooks/forms/useTripForm';
import { Columns } from '@/app/components/constants/constants';

export const mapRowToLocation = (row: GridRowModel): LocationInTripFormData => {
  return {
    id: row.id,
    connectedLocationData: row[Columns.ConnectedLocationData],
    duration: row[Columns.Duration],
    date: row[Columns.Date],
    additionalInfo: row[Columns.AdditionalInfo],
    cost: row[Columns.Cost],
  };
};
