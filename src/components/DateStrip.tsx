import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

type Props = {
    selectedDate: string;
    onDateChange: (date: string) => void;
};

const generateDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = -30; i <= 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
    }
    return dates;
};

export const formatDate = (d: Date): string => {
    const dd = d.getDate().toString().padStart(2, '0');
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const yy = d.getFullYear().toString().slice(2);
    return `${dd}.${mm}.${yy}`;
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const ITEM_WIDTH = 52;
const dates = generateDates();

const DateStrip = ({ selectedDate, onDateChange }: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const [visibleMonth, setVisibleMonth] = React.useState<number>(() => new Date().getMonth());

    useEffect(() => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                x: 30 * ITEM_WIDTH - 150,
                animated: false,
            });
        }, 100);
    }, []);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        const centerIndex = Math.round((x + 150) / ITEM_WIDTH);
        const clampedIndex = Math.max(0, Math.min(centerIndex, dates.length - 1));
        setVisibleMonth(dates[clampedIndex].getMonth());
    };

    return (
        <View style={{ marginBottom: 10 }}>

            <Text style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 12,
            }}>
                {MONTHS[visibleMonth]}
            </Text>

            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            >
                {dates.map((date, index) => {
                    const dateStr = formatDate(date);
                    const isSelected = dateStr === selectedDate;
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onDateChange(dateStr)}
                            style={{
                                width: ITEM_WIDTH - 4,
                                alignItems: "center",
                                marginHorizontal: 2,
                                paddingVertical: 8,
                                borderRadius: 20,
                                backgroundColor: isSelected ? "#fff" : "transparent",
                            }}
                        >
                            <Text style={{
                                color: isSelected ? "#3C3C3C" : "#888",
                                fontSize: 11,
                                marginBottom: 4,
                            }}>
                                {DAYS[date.getDay()]}
                            </Text>
                            <Text style={{
                                color: isSelected ? "#3C3C3C" : "white",
                                fontSize: 16,
                                fontWeight: isSelected ? "700" : "400",
                            }}>
                                {date.getDate()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>

    );
};

export default DateStrip;