import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { addInvoice, Invoice } from '../db';

export default function AddInvoiceScreen() {
    const router = useRouter();
    const [invoice, setInvoice] = useState<Invoice>({
        date: new Date().toISOString().split('T')[0],
        client: '',
        company: '',
        description: '',
        unit_price: 0,
        quantity: 0,
        total: 0,
        status: 'unpaid',
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleAddInvoice = async () => {
        await addInvoice(invoice);
        alert('Invoice added!');
        router.push('/');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Date:</Text>
            <Button title={invoice.date} onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={new Date(invoice.date)}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            setInvoice({ ...invoice, date: selectedDate.toISOString().split('T')[0] });
                        }
                    }}
                />
            )}

            <Text style={styles.label}>Client:</Text>
            <TextInput style={styles.input} value={invoice.client} onChangeText={(text) => setInvoice({ ...invoice, client: text })} />

            <Text style={styles.label}>Company:</Text>
            <TextInput style={styles.input} value={invoice.company} onChangeText={(text) => setInvoice({ ...invoice, company: text })} />

            <Text style={styles.label}>Description:</Text>
            <TextInput style={styles.input} value={invoice.description} onChangeText={(text) => setInvoice({ ...invoice, description: text })} />

            <Text style={styles.label}>Unit Price:</Text>
            <TextInput
                style={styles.input}
                value={invoice.unit_price.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setInvoice({ ...invoice, unit_price: parseFloat(text) || 0 })}
            />

            <Text style={styles.label}>Quantity:</Text>
            <TextInput
                style={styles.input}
                value={invoice.quantity.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setInvoice({ ...invoice, quantity: parseInt(text) || 0 })}
            />

            <Text style={styles.label}>Total:</Text>
            <TextInput
                style={styles.input}
                value={invoice.total.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setInvoice({ ...invoice, total: parseFloat(text) || 0 })}
            />

            <Button title="Add Invoice" onPress={handleAddInvoice} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginBottom: 10,
    },
});
