// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { initDB, getInvoices } from '../db';

export default function HomeScreen() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    const router = useRouter();

    useEffect(() => {
        initDB();
        setIsMounted(true);
        fetchInvoices();

        return () => setIsMounted(false); // Nettoyage lors du démontage du composant
    }, []);

    const fetchInvoices = async () => {
        const data = await getInvoices();
        if (isMounted) {
            setInvoices(data);
        }
    };

    return (
        <View>
            <FlatList
                data={invoices}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push(`/invoice/${item.id}`)}>
                        <View style={{ padding: 10, borderBottomWidth: 1 }}>
                            <Text>Invoice {item.number}</Text>
                            <Text>{item.client}</Text>
                            <Text>Total: {item.total} €</Text>
                            <Text>Status: {item.status}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <Button title="Add Invoice" onPress={() => router.push('/add')} />
        </View>
    );
}
