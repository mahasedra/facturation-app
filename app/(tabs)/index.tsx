import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { initDB, getInvoices } from '../../db';

export default function HomeScreen() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        initDB().then(() => {
            console.log('Database initialized in HomeScreen');
            fetchInvoices();
        });
    }, []);

    const fetchInvoices = async () => {
        const data = await getInvoices();
        console.log("Fetched invoices:", data);
        setInvoices(data);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Invoice List</Text>
            <Button title="Refresh List" onPress={fetchInvoices} />
            <FlatList
                data={invoices}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.invoiceItem} onPress={() => router.push(`/${item.id}`)}>
                        <Text style={styles.invoiceTitle}>Invoice n° {item.id}</Text>
                        <Text>{item.client}</Text>
                        <Text>Total: {item.total} €</Text>
                        <Text>Status: {item.status}</Text>
                    </TouchableOpacity>
                )}
            />
            <Button title="Add Invoice" onPress={() => router.push('/add')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    invoiceItem: {
        padding: 15,
        marginVertical: 8,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    invoiceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
