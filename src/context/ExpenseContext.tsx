import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryType, ExpenseItem } from '../routes/types';

interface ExpenseContextType {
    categories: CategoryType[];
    total: number;
    categoriesList: string[];
    addCategory: (name: string) => void;
    addExpense: (categoryName: string, name: string, amount: number, date?: string) => void;
    isLoaded: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const CATEGORIES_KEY = "CATEGORIES";
const TOTAL_KEY = "TOTAL";
const CATEGORIES_LIST_KEY = "CATEGORIES_LIST";
const DEFAULT_CATEGORIES = ["Food", "Shopping", "Grocery", "Sports"];
const DEFAULT_TOTAL = 5000;

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [total, setTotal] = useState<number>(DEFAULT_TOTAL);
    const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_CATEGORIES);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const storedCategories = await AsyncStorage.getItem(CATEGORIES_KEY);
                const storedTotal = await AsyncStorage.getItem(TOTAL_KEY);
                const storedCategoriesList = await AsyncStorage.getItem(CATEGORIES_LIST_KEY);

                if (storedCategories) {
                    setCategories(JSON.parse(storedCategories));
                }
                if (storedTotal) {
                    setTotal(JSON.parse(storedTotal));
                } else {
                    await AsyncStorage.setItem(TOTAL_KEY, JSON.stringify(DEFAULT_TOTAL));
                }
                if (storedCategoriesList) {
                    setCategoriesList(JSON.parse(storedCategoriesList));
                } else {
                    await AsyncStorage.setItem(CATEGORIES_LIST_KEY, JSON.stringify(DEFAULT_CATEGORIES));
                }
            } catch (error) {
                console.error("Error loading data from AsyncStorage:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        const saveData = async () => {
            try {
                await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
                await AsyncStorage.setItem(TOTAL_KEY, JSON.stringify(total));
                await AsyncStorage.setItem(CATEGORIES_LIST_KEY, JSON.stringify(categoriesList));
            } catch (error) {
                console.error("Error saving data to AsyncStorage:", error);
            }
        };

        saveData();
    }, [categories, total, categoriesList, isLoaded]);

    const addCategory = (name: string) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        setCategoriesList(prev => {
            if (prev.some(c => c.toLowerCase() === trimmedName.toLowerCase())) {
                return prev;
            }
            return [...prev, trimmedName];
        });

        setCategories(prev => {
            if (prev.some(c => c.cat.toLowerCase() === trimmedName.toLowerCase())) {
                return prev;
            }
            return [...prev, { cat: trimmedName, items: [] }];
        });
    };

    const addExpense = (categoryName: string, name: string, amount: number, date?: string) => {
        const trimmedName = name.trim();
        if (!categoryName || !trimmedName || isNaN(amount) || amount <= 0) return;

        const dateStr = date ?? new Date().toDateString();
        const newItem: ExpenseItem = { name: trimmedName, amount, date: dateStr };

        setCategories(prev => {
            const existingCategory = prev.find(c => c.cat === categoryName);
            if (existingCategory) {
                return prev.map(c =>
                    c.cat === categoryName
                        ? { ...c, items: [...c.items, newItem] }
                        : c
                );
            } else {
                return [...prev, { cat: categoryName, items: [newItem] }];
            }
        });

        setTotal(prev => prev - amount);
    };

    return (
        <ExpenseContext.Provider value={{
            categories,
            total,
            categoriesList,
            addCategory,
            addExpense,
            isLoaded
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error("useExpenses must be used within an ExpenseProvider");
    }
    return context;
};
