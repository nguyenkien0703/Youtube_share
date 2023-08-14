import { format } from "date-fns";
export const formatDate = (date: string): string => {
  if (!date) return "";
  return format(new Date(date), "dd MMM yyyy HH:MM:SS");
};
