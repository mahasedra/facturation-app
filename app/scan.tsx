// app/scan.tsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <Text>Requesting permission...</Text>;
    }

    return (
        <BarCodeScanner
            onBarCodeScanned={({ data }) => router.push(`/invoice/${data}`)}
            style={{ flex: 1 }}
        />
    );
}
