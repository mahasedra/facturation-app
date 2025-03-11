
// app/[id].tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { updateInvoiceStatus } from '../db';

export default function InvoiceDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const handleMarkAsPaid = async () => {
        await updateInvoiceStatus(Number(id));
        alert('Invoice marked as paid!');
        router.push('/');
    };

    return (
        <View>
            <Text>Invoice {id}</Text>
            <QRCode value={id?.toString() || ''} size={150} />
            <Button title="Mark as Paid" onPress={handleMarkAsPaid} />
        </View>
    );
}
