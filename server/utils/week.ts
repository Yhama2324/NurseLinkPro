export const startOfWeek = (d = new Date(), weekStartsOn = 1): Date => {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

export const formatWeekStart = (d: Date): string => {
  return d.toISOString().split('T')[0];
};
