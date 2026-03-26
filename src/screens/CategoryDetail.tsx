import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, CategoryType, ExpenseItem } from '../routes/types';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import { Plus, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

type RouteParams = {
    categoryName: string;
    items: ExpenseItem[];
    onAddItem: (name: string, amount: number) => void;
    totalBalance: number;
};

const CategoryDetail = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<{ CategoryDetail: RouteParams }, 'CategoryDetail'>>();
    const { categoryName, items = [], onAddItem, totalBalance = 0 } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");

    const categoryTotal = items.reduce((sum, item) => sum + item.amount, 0);

    const handleSave = () => {
        const amt = parseFloat(amount);
        if (!name.trim() || isNaN(amt) || amt <= 0) return;
        onAddItem(name.trim(), amt);
        setName("");
        setAmount("");
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#3C3C3C" }}>
            <View style={{ flex: 1, padding: 20, marginBottom: 60 }}>

                <View style={{ backgroundColor: "#4E4E4E", paddingHorizontal: 30, paddingVertical: 10, borderRadius: 40, alignItems: "flex-end" }}>
                    <View>
                        <Text style={{ color: "white", fontSize: 16 }}>Balance</Text>
                        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>${totalBalance}</Text>
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
                        {items.length === 0 ? (
                            <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
                                No expenses yet
                            </Text>
                        ) : (
                            items.map((item, index) => (
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

            {modalVisible && (
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "85%", backgroundColor: "#2C2C2C", borderRadius: 20, padding: 20 }}>

                        <Text style={{ color: "white", fontSize: 20, marginBottom: 15 }}>
                            Add Expense to {categoryName}
                        </Text>

                        <TextInput
                            placeholder="Expense name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#aaa"
                            style={{ backgroundColor: "#4E4E4E", borderRadius: 10, padding: 12, color: "white", marginBottom: 10 }}
                        />

                        <TextInput
                            placeholder="Enter amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholderTextColor="#aaa"
                            style={{ backgroundColor: "#4E4E4E", borderRadius: 10, padding: 12, color: "white", marginBottom: 20 }}
                        />

                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button title="Save" onPress={handleSave} />
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default CategoryDetail;
