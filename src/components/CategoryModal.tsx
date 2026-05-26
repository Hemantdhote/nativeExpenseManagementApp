import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

type CategoryModalProps = {
    visible: boolean;
    name: string;
    setName: (val: string) => void;
    onCancel: () => void;
    onSave: () => void;
};

export const CategoryModal = ({
    visible,
    name,
    setName,
    onCancel,
    onSave
}: CategoryModalProps) => {
    if (!visible) return null;

    return (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "85%", backgroundColor: "#2C2C2C", borderRadius: 20, padding: 20 }}>
                <Text style={{ color: "white", fontSize: 20, marginBottom: 15 }}>
                    Add Category
                </Text>

                <TextInput
                    placeholder="Category name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#aaa"
                    style={{ backgroundColor: "#4E4E4E", borderRadius: 10, padding: 12, color: "white", marginBottom: 10 }}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Button title="Cancel" onPress={onCancel} />
                    <Button title="Save" onPress={onSave} />
                </View>
            </View>
        </View>
    );
};

export default CategoryModal;
