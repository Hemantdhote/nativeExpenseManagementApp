import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

type Props = {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
};

const DateScroller = ({
    selectedDate,
    setSelectedDate,
}: Props) => {

    const dates = Array.from({ length: 61 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 30 + i);
        return date;
    });

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20 }}
        >
            {dates.map((date, index) => {

                const currentDate = date.toDateString();

                const isSelected =
                    selectedDate === currentDate;

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedDate(currentDate)}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 20,
                            backgroundColor: isSelected
                                ? "white"
                                : "#4E4E4E",
                            marginRight: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: isSelected
                                    ? "black"
                                    : "white",
                                fontWeight: "600",
                            }}
                        >
                            {date.toDateString().slice(4, 10)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

export default DateScroller;