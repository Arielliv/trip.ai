import { GridRowModel } from '@mui/x-data-grid-pro';
import { LocationInTripFormData } from '@/app/hooks/useTripForm';
import { Columns } from '@/app/components/constants/constants';

export const mapRowToLocation = (row: GridRowModel): LocationInTripFormData => {
  return {
    id: row.id,
    connectedLocationData: row[Columns.connectedLocationData],
    duration: row[Columns.Duration],
    date: row[Columns.Date],
    AdditionalInfo: row[Columns.AdditionalInfo],
    cost: row[Columns.Cost],
  };
};
