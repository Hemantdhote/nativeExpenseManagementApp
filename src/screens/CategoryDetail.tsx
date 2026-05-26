import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ArrowLeft } from 'lucide-react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';

import DateScroller from '../components/DateScroller';
import ExpenseModal from '../components/ExpenseModal';
import { useExpenses } from '../context/ExpenseContext';
import { RootStackParamList } from '../routes/types';
import { filterItemsByDate } from '../utils/dateFilter';

type CategoryDetailRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;

const CategoryDetail = () => {
    const navigation = useNavigation();
    const route = useRoute<CategoryDetailRouteProp>();
    const { categoryName, selectedDate } = route.params;

    const {
        categories,
        total,
        categoriesList,
        addExpense
    } = useExpenses();

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [currentDate, setCurrentDate] = useState(selectedDate);

    // Dynamic resolution of category data from global context
    const categoryData = categories.find(c => c.cat === categoryName);
    const items = categoryData?.items ?? [];

    const filteredItems = filterItemsByDate(items, currentDate);
    const categoryTotal = filteredItems.reduce((sum, item) => sum + item.amount, 0);

    const handleSave = () => {
        const amt = parseFloat(amount);
        if (!name.trim() || isNaN(amt) || amt <= 0) return;

        addExpense(categoryName, name.trim(), amt, currentDate);
        setName("");
        setAmount("");
        setModalVisible(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#3C3C3C" }}>
            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <DateScroller
                    selectedDate={currentDate}
                    setSelectedDate={setCurrentDate}
                />
            </View>

            <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 20, marginBottom: 60 }}>
                <View style={{ backgroundColor: "#4E4E4E", paddingHorizontal: 30, paddingVertical: 10, borderRadius: 40, alignItems: "flex-end" }}>
                    <View>
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>Balance</Text>
                        <Text style={{ color: "white", fontSize: 25, fontWeight: "900" }}>${total}</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: "#4E4E4E", borderRadius: 20, paddingHorizontal: 20, marginTop: 90, flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 30, marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeft color="white" size={22} />
                        </TouchableOpacity>

                        <Text style={{ color: "white", fontSize: 22, marginLeft: 15, fontWeight: "600" }}>
                            {categoryName}
                        </Text>

                        <Text style={{ color: "white", marginLeft: "auto", fontSize: 18 }}>
                            -${categoryTotal}
                        </Text>
                    </View>

                    <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
                        {filteredItems.length === 0 ? (
                            <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
                                No expenses yet
                            </Text>
                        ) : (
                            filteredItems.map((item, index) => (
                                <View key={index} style={{ marginBottom: 20 }}>
                                    <Text style={{ color: "white", fontSize: 16 }}>{item.name}</Text>
                                    <Text style={{ color: "#aaa", fontSize: 12 }}>{item.date}</Text>
                                    <Text style={{ color: "white", position: "absolute", right: 0, top: 0 }}>
                                        -${item.amount}
                                    </Text>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>

            <View style={{ position: "absolute", bottom: 30, right: 30, backgroundColor: "#4E4E4E", padding: 15, borderRadius: 50 }}>
                <Plus onPress={() => setModalVisible(true)} size={30} color="white" />
            </View>

            <ExpenseModal
                visible={modalVisible}
                selectedCategory={categoryName}
                setSelectedCategory={() => {}}
                categoriesList={categoriesList}
                name={name}
                setName={setName}
                amount={amount}
                setAmount={setAmount}
                onCancel={() => setModalVisible(false)}
                onSave={handleSave}
                showCategoryPicker={false}
                categoryName={categoryName}
            />
        </View>
    );
};

export default CategoryDetail;
