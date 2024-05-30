import { DateRange } from '@mui/x-date-pickers-pro';

export const getFormatDateDuration = (dateRange?: Date[]): DateRange<Date> | any => {
  if (!dateRange) {
    return [];
  }
  return dateRange.map((date) => new Date(date)) as DateRange<Date>;
};
