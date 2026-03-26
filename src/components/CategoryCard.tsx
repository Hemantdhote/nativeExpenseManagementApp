import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Plus } from 'lucide-react-native'
import { CategoryType } from '../routes/types';

type Props = {
  elem: CategoryType;
  onAddExpense: (cat: string) => void;
  onPress: () => void;
};

const CategoryCard = ({ elem, onAddExpense, onPress }: Props) => {
  const total = elem.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
        flexDirection: "row",
        backgroundColor: "#4E4E4E",
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Text style={{ color: "white", fontSize: 25 }}>
          {elem.cat}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 25 }}>
          <Text style={{ fontSize: 20, color: "white", fontWeight: "600" }}>
            -${total}
          </Text>

          <Plus
            color="white"
            size={20}
            onPress={(e) => {
              e.stopPropagation?.();
              onAddExpense(elem.cat);
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;