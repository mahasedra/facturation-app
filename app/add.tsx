// app/add.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { addInvoice, Invoice } from '../db';

export default function AddInvoiceScreen() {
    const router = useRouter();
    const [invoice, setInvoice] = useState<Invoice>({
        number: '',
        date: '',
        client: '',
        company: '',
        description: '',
        unit_price: 0,
        quantity: 0,
        total: 0,
        status: 'unpaid',
    });

    const handleAddInvoice = async () => {
        await addInvoice(invoice);
        alert('Invoice added!');
        router.push('/');
    };

    return (
        <View>
            <Text>Invoice Number:</Text>
            <TextInput value={invoice.number} onChangeText={(text) => setInvoice({ ...invoice, number: text })} />
            <Text>Date:</Text>
            <TextInput value={invoice.date} onChangeText={(text) => setInvoice({ ...invoice, date: text })} />
            <Text>Client:</Text>
            <TextInput value={invoice.client} onChangeText={(text) => setInvoice({ ...invoice, client: text })} />
            <Text>Company:</Text>
            <TextInput value={invoice.company} onChangeText={(text) => setInvoice({ ...invoice, company: text })} />
            <Text>Description:</Text>
            <TextInput value={invoice.description} onChangeText={(text) => setInvoice({ ...invoice, description: text })} />
            <Text>Unit Price:</Text>
            <TextInput
                value={invoice.unit_price.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setInvoice({ ...invoice, unit_price: parseFloat(text) || 0 })}
            />
            <Text>Quantity:</Text>
            <TextInput
                value={invoice.quantity.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setInvoice({ ...invoice, quantity: parseInt(text) || 0 })}
            />
            <Text>Total:</Text>
            <TextInput
                value={invoice.total.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setInvoice({ ...invoice, total: parseFloat(text) || 0 })}
            />
            <Button title="Add Invoice" onPress={handleAddInvoice} />
        </View>
    );
}
