import { format, parseISO } from 'date-fns';

export const formatISODateTimeToString = (isoString: string): string => {
  try {
    const date = parseISO(isoString);
    return format(date, 'MM/dd/yyyy HH:mm:ss');
  } catch (error) {
    return isoString;
  }
};

export const formatISODateToString = (isoString: string): string => {
  try {
    const date = parseISO(isoString);
    return format(date, 'MM/dd/yyyy');
  } catch (error) {
    return isoString;
  }
};

export const getCurrentDateISO = (): string => {
  return new Date().toISOString();
};

export const addDaysToDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDaysFromDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};