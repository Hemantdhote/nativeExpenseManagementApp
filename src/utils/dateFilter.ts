import { ExpenseItem } from "../routes/types";


export const filterItemsByDate = (
  items: ExpenseItem[],
  selectedDate: string
) => {
  return items.filter(
    item => item.date === selectedDate
  );
};