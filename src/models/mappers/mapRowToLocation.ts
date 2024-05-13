import { GridRowModel } from '@mui/x-data-grid-pro';
import { LocationInTrip } from '@/app/hooks/useTripForm';
import { Columns } from '@/app/components/constants/constants';

export const mapRowToLocation = (row: GridRowModel): LocationInTrip => {
  return {
    id: row.id,
    duration: row[Columns.Duration],
    date: row[Columns.Date],
    AdditionalInfo: row[Columns.AdditionalInfo],
    cost: row[Columns.Cost],
  };
};
