export type RootStackParamList = {
    Home: undefined;
    CategoryDetail: {
    category: {
      cat: string;
      amount: number;
    };
  };
}

export type ExpenseItem = {
    name: string;
    amount: number;
    date: string;
};

export type CategoryType = {
    cat: string;
    items: ExpenseItem[];
};