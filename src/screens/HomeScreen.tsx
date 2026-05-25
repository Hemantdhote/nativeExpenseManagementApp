import { View, Text, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react-native'
import CategoryCard from '../components/CategoryCard'
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CategoryType, ExpenseItem } from '../routes/types';
import DateScroller from '../components/DateScroller';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
const CATEGORY_KEY = "CATEGORIES";
const TOTAL_KEY = "TOTAL";


const HomeScreen = () => {
    const [total, setTotal] = useState(5000);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [modalType, setModalType] = useState<"expense" | "category" | null>(null);
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [categoriesList, setCategoriesList] = useState<string[]>(["Food", "Shopping", "Grocery", "Sports"]);
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
            onAddItem: (name: string, amount: number) => {
                const today = new Date();
                // const dateStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear().toString().slice(2)}`;
                const dateStr = today.toDateString();
                const newItem: ExpenseItem = { name, amount, date: dateStr };

                setCategories(prev =>
                    prev.map(c =>
                        c.cat === catName
                            ? { ...c, items: [...c.items, newItem] }
                            : c
                    )
                );
                setTotal(prev => prev - amount);
            }
        });
    };

    const handleSaveClick = () => {
        if (modalType === "category") {
            if (!name.trim()) return;
            setCategoriesList(prev => [...prev, name.trim()]);
            setName("");
            setModalType(null);
        }

        if (modalType === "expense") {
            const amt = parseFloat(amount);
            if (!selectedCategory || !name.trim() || isNaN(amt) || amt <= 0) return;

            const today = new Date();
            // const dateStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear().toString().slice(2)}`;
            const dateStr = today.toDateString();
            const newItem: ExpenseItem = { name: name.trim(), amount: amt, date: dateStr };

            setCategories(prev => {
                const existing = prev.find(c => c.cat === selectedCategory);
                if (existing) {
                    return prev.map(c =>
                        c.cat === selectedCategory
                            ? { ...c, items: [...c.items, newItem] }
                            : c
                    );
                } else {
                    return [...prev, { cat: selectedCategory, items: [newItem] }];
                }
            });

            setTotal(prev => prev - amt);
            setName("");
            setAmount("");
            setSelectedCategory("");
            setModalType(null);
        }
    };


    const filteredCategories = categories
        .map(category => ({
            ...category,
            items: category.items.filter(
                item => item.date === selectedDate
            ),
        }))
        .filter(category => category.items.length > 0);


    const selectedDateTotal = filteredCategories.reduce(
        (sum, category) =>
            sum +
            category.items.reduce(
                (catSum, item) => catSum + item.amount,
                0
            ),
        0
    );




    const loadData = async () => {
    try {

        const storedCategories =
            await AsyncStorage.getItem(CATEGORY_KEY);

        const storedTotal =
            await AsyncStorage.getItem(TOTAL_KEY);

        if (storedCategories) {
            setCategories(JSON.parse(storedCategories));
        }

        if (storedTotal) {
            setTotal(JSON.parse(storedTotal));
        }

    } catch (error) {
        console.log("Load Error", error);
    }
};

useEffect(() => {
    loadData();
}, []);


const saveData = async () => {
    try {

        await AsyncStorage.setItem(
            CATEGORY_KEY,
            JSON.stringify(categories)
        );

        await AsyncStorage.setItem(
            TOTAL_KEY,
            JSON.stringify(total)
        );

    } catch (error) {
        console.log("Save Error", error);
    }
};

useEffect(() => {
    saveData();
}, [categories, total]);

    return (
        <View style={{ flex: 1, backgroundColor: "#3C3C3C", paddingHorizontal:20, paddingBottom:20 }}>

            <View style={{ paddingBottom: 10 }}>
                <DateScroller
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </View>

            <View style={{ backgroundColor: "#4E4E4E", paddingHorizontal: 30, paddingVertical: 10, borderRadius: 40, alignItems: "flex-end" }}>
                <View>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>Balance</Text>
                    {/* <Text style={{ color: "white", fontSize: 25, fontWeight: "900" }}>${total}</Text> */}
                    <Text style={{ color: "white", fontSize: 25, fontWeight: "900" }}>
                        ${5000 - selectedDateTotal}
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

            {modalType && (
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "85%", backgroundColor: "#2C2C2C", borderRadius: 20, padding: 20 }}>

                        <Text style={{ color: "white", fontSize: 20, marginBottom: 15 }}>
                            {modalType === "category" ? "Add Category" : "Add Expense"}
                        </Text>

                        {modalType === "expense" && (
                            <View style={{ backgroundColor: "#4E4E4E", borderRadius: 10, marginBottom: 10 }}>
                                <Picker
                                    selectedValue={selectedCategory}
                                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                    dropdownIconColor="white"
                                    style={{ color: "white" }}
                                >
                                    <Picker.Item label="Select Category" value="" />
                                    {categoriesList.map((cat, i) => (
                                        <Picker.Item key={i} label={cat} value={cat} />
                                    ))}
                                </Picker>
                            </View>
                        )}

                        <TextInput
                            placeholder={modalType === "category" ? "Category name" : "Expense name"}
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#aaa"
                            style={{ backgroundColor: "#4E4E4E", borderRadius: 10, padding: 12, color: "white", marginBottom: 10 }}
                        />

                        {modalType === "expense" && (
                            <TextInput
                                placeholder="Enter amount"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                                style={{ backgroundColor: "#4E4E4E", borderRadius: 10, padding: 12, color: "white", marginBottom: 20 }}
                            />
                        )}

                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Button title="Cancel" onPress={() => setModalType(null)} />
                            <Button title="Save" onPress={handleSaveClick} />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default HomeScreen;