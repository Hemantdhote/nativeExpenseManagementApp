import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type ExpenseModalProps = {
    visible: boolean;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
    categoriesList: string[];
    name: string;
    setName: (val: string) => void;
    amount: string;
    setAmount: (val: string) => void;
    onCancel: () => void;
    onSave: () => void;
    showCategoryPicker?: boolean;
    categoryName?: string;
};

export const ExpenseModal = ({
    visible,
    selectedCategory,
    setSelectedCategory,
    categoriesList,
    name,
    setName,
    amount,
    setAmount,
    onCancel,
    onSave,
    showCategoryPicker = true,
    categoryName = ""
}: ExpenseModalProps) => {
    if (!visible) return null;

    return (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "85%", backgroundColor: "#2C2C2C", borderRadius: 20, padding: 20 }}>
                <Text style={{ color: "white", fontSize: 20, marginBottom: 15 }}>
                    {showCategoryPicker ? "Add Expense" : `Add Expense to ${categoryName}`}
                </Text>

                {showCategoryPicker && (
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
                    placeholder={showCategoryPicker ? "Expense name" : "Expense name"}
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
                    <Button title="Cancel" onPress={onCancel} />
                    <Button title="Save" onPress={onSave} />
                </View>
            </View>
        </View>
    );
};

export default ExpenseModal;
