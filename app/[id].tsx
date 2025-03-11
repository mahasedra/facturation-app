import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { updateInvoiceStatus, getInvoices, Invoice } from '../db';

export default function InvoiceDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        fetchInvoiceDetails();
    }, []);

    const fetchInvoiceDetails = async () => {
        const invoices = await getInvoices();
        const selectedInvoice = invoices.find(inv => inv.id === Number(id));
        setInvoice(selectedInvoice || null);
    };

    const handleMarkAsPaid = async () => {
        if (!id) return;
        await updateInvoiceStatus(Number(id));
        Alert.alert('Success', 'Invoice marked as paid!');
        fetchInvoiceDetails(); // Rafraîchir les détails après modification
    };

    if (!invoice) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Loading Invoice...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Invoice Details</Text>
            <Text style={styles.info}>Invoice ID: {invoice.id}</Text>
            <Text style={styles.info}>Client: {invoice.client}</Text>
            <Text style={styles.info}>Company: {invoice.company}</Text>
            <Text style={styles.info}>Total: {invoice.total} €</Text>
            <Text style={[styles.info, { fontWeight: 'bold' }]}>Status: {invoice.status}</Text>

            <QRCode value={id?.toString() || ''} size={150} />
            {invoice.status != "paid" && <Button title="Mark as Paid" onPress={handleMarkAsPaid} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
    },
});
