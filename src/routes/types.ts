export type RootStackParamList = {
    Home: undefined;
    CategoryDetail: {
        categoryName: string;
        items?: ExpenseItem[];
        selectedDate: string;
        onAddItem?: (name: string, amount: number, date?: string) => void;
        totalBalance?: number;
    };
};

export type ExpenseItem = {
    name: string;
    amount: number;
    date: string;
};

export type CategoryType = {
    cat: string;
    items: ExpenseItem[];
};