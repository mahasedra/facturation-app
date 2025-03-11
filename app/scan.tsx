import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (!scanned) {
            setScanned(true);
            Alert.alert("QR Code Scanned", `Invoice ID: ${data}`, [
                { text: "OK", onPress: () => router.push(`/invoice/${data}`) }
            ]);
        }
    };

    if (!permission) {
        return <Text>Requesting camera permission...</Text>;
    }

    if (!permission.granted) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />
            {scanned && <Text style={styles.scanAgain} onPress={() => setScanned(false)}>Tap to scan again</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1, justifyContent: "center" },
    scanAgain: { textAlign: "center", padding: 20, color: "blue", fontSize: 16 }
});