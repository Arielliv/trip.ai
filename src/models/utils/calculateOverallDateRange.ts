export const calculateOverallDateRange = (timeFilters: string[]): { $gte: number; $lte: number } | null => {
  let minDays = Infinity; // Start with the highest possible number
  let maxDays = -Infinity; // Start with the lowest possible number

  const dayMap = {
    'One day': 1,
    'Three days': 3,
    'Five days': 5,
    'One week': 7,
    'Two weeks': 14,
    'One month': 30,
    'Two months': 60,
    'Half a year': 182,
  };

  timeFilters.forEach((timeDescription) => {
    // @ts-ignore
    const durationDays = dayMap[timeDescription];
    if (durationDays) {
      const tolerance = Math.max(1, Math.floor(durationDays * 0.2));
      const minRange = durationDays - tolerance;
      const maxRange = durationDays + tolerance;

      if (minRange < minDays) {
        minDays = minRange; // Update minimum days if this range's minimum is smaller
      }
      if (maxRange > maxDays) {
        maxDays = maxRange; // Update maximum days if this range's maximum is larger
      }
    }
  });

  if (minDays === Infinity || maxDays === -Infinity) {
    return null; // Return null if no valid time descriptions were processed
  }

  return { $gte: minDays, $lte: maxDays };
};
