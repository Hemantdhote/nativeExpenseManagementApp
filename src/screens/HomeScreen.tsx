import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Plus } from 'lucide-react-native'
import CategoryCard from '../components/CategoryCard'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/types';
import DateScroller from '../components/DateScroller';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseModal from '../components/ExpenseModal';
import CategoryModal from '../components/CategoryModal';

const HomeScreen = () => {
    const {
        categories,
        total,
        categoriesList,
        addCategory,
        addExpense,
    } = useExpenses();

    const [modalType, setModalType] = useState<"expense" | "category" | null>(null);
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const onAddExpense = (catName: string) => {
        setSelectedCategory(catName);
        setModalType("expense");
    };

    const handleCategoryPress = (catName: string) => {
        const cat = categories.find(c => c.cat === catName);
        const items = cat?.items ?? [];

        navigation.navigate('CategoryDetail', {
            categoryName: catName,
            items,
            totalBalance: total,
            selectedDate,
        });
    };

    const handleSaveClick = () => {
        if (modalType === "category") {
            if (!name.trim()) return;
            addCategory(name.trim());
            setName("");
            setModalType(null);
        }

        if (modalType === "expense") {
            const amt = parseFloat(amount);
            if (!selectedCategory || !name.trim() || isNaN(amt) || amt <= 0) return;

            addExpense(selectedCategory, name.trim(), amt, selectedDate);
            setName("");
            setAmount("");
            setSelectedCategory("");
            setModalType(null);
        }
    };

    const filteredCategories = useMemo(() => {
        return categories
            .map(category => ({
                ...category,
                items: category.items.filter(
                    item => item.date === selectedDate
                ),
            }))
            .filter(category => category.items.length > 0);
    }, [categories, selectedDate]);

    return (
        <View style={{ flex: 1, backgroundColor: "#3C3C3C", paddingHorizontal: 20, paddingBottom: 20 }}>
            <View style={{ paddingBottom: 10 }}>
                <DateScroller
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </View>

            <View style={{ backgroundColor: "#4E4E4E", paddingHorizontal: 30, paddingVertical: 10, borderRadius: 40, alignItems: "flex-end" }}>
                <View>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>Balance</Text>
                    <Text style={{ color: "white", fontSize: 25, fontWeight: "900" }}>
                        ${total}
                    </Text>
                </View>
            </View>

            <View style={{ paddingTop: 400, flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
                    <Text style={{ color: "white", fontSize: 25 }}>Create new category</Text>
                    <Plus onPress={() => setModalType("category")} size={30} color="white" />
                </View>

                <ScrollView
                    style={{ flex: 1, }}
                    contentContainerStyle={{ paddingTop: 20, paddingBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ gap: 20 }}>
                        {filteredCategories.length === 0 ? (
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ color: "white", textAlign: "center" }}>No Category Available</Text>
                            </View>
                        ) : (
                            <View style={{ gap: 10 }}>
                                {filteredCategories.map((elem, index) => (
                                    <CategoryCard
                                        key={index}
                                        elem={elem}
                                        onAddExpense={onAddExpense}
                                        onPress={() => handleCategoryPress(elem.cat)}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>

            <View style={{ position: "absolute", bottom: 30, right: 30, backgroundColor: "#4E4E4E", padding: 15, borderRadius: 50 }}>
                <Plus onPress={() => { setSelectedCategory(""); setModalType("expense"); }} size={30} color="white" />
            </View>

            <CategoryModal
                visible={modalType === "category"}
                name={name}
                setName={setName}
                onCancel={() => setModalType(null)}
                onSave={handleSaveClick}
            />

            <ExpenseModal
                visible={modalType === "expense"}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categoriesList={categoriesList}
                name={name}
                setName={setName}
                amount={amount}
                setAmount={setAmount}
                onCancel={() => { setModalType(null); setSelectedCategory(""); }}
                onSave={handleSaveClick}
            />
        </View>
    );
};

export default HomeScreen;