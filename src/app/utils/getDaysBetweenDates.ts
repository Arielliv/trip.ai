export const getDaysBetweenDates = (startDate: Date | undefined, endDate: Date | undefined) => {
  if (!startDate || !endDate) {
    return 365;
  }

  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

  const differenceInTime = endDate.getTime() - startDate.getTime();
  return Math.round(differenceInTime / oneDay);
};
