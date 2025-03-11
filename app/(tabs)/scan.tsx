import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import jsQR from 'jsqr';

export default function ScanScreen() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [galleryPermission, setGalleryPermission] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [useCamera, setUseCamera] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!cameraPermission?.granted) {
            requestCameraPermission();
        }
        requestGalleryPermissionAsync();
    }, []);

    // 📌 Demande de permission pour accéder aux images
    const requestGalleryPermissionAsync = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setGalleryPermission(status === 'granted');
    };

    // 📌 Scanner un QR code depuis une image
    const scanQRCodeFromImage = async (imageUri: string) => {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (ctx) {
                canvas.width = imageBitmap.width;
                canvas.height = imageBitmap.height;
                ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    Alert.alert("QR Code Scanned", `Invoice ID: ${code.data}`, [
                        { text: "OK", onPress: () => router.push(`/${code.data}`) }
                    ]);
                } else {
                    Alert.alert("No QR Code Detected", "Try another image.");
                }
            }
        } catch (error) {
            console.error("QR Code Scan Error:", error);
            Alert.alert("Error", "Failed to scan QR code from image.");
        }
    };

    // 📌 Fonction pour sélectionner une image depuis la galerie
    const pickImage = async () => {
        if (!galleryPermission) {
            Alert.alert("Permission required", "Allow access to gallery in your settings.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setSelectedImage(result.assets[0].uri);
            scanQRCodeFromImage(result.assets[0].uri);
        }
    };

    // 📌 Fonction pour scanner un QR code en direct avec la caméra
    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (!scanned) {
            setScanned(true);
            Alert.alert("QR Code Scanned", `Invoice ID: ${data}`, [
                { text: "OK", onPress: () => router.push(`/${data}`) }
            ]);
        }
    };

    if (!cameraPermission) {
        return <Text>Requesting camera permission...</Text>;
    }

    if (!cameraPermission.granted) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scan Invoice QR Code</Text>

            {/* Choix entre caméra et galerie */}
            {useCamera === null && (
                <View style={styles.buttonsContainer}>
                    <Button title="Use Camera" onPress={() => setUseCamera(true)} />
                    <Button title="Select Image" onPress={() => setUseCamera(false)} />
                </View>
            )}

            {/* Aperçu de l'image sélectionnée */}
            {selectedImage && !useCamera && (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}

            {/* Caméra active seulement si sélectionnée */}
            {useCamera && (
                <CameraView
                    style={styles.camera}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
            )}

            <View style={styles.buttonsContainer}>
                {!useCamera && <Button title="Pick Image from Gallery" onPress={pickImage} />}
                {scanned && <Button title="Scan Again" onPress={() => setScanned(false)} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    camera: { flex: 1, width: '100%', justifyContent: 'center' },
    previewImage: { width: 250, height: 250, resizeMode: 'contain', marginBottom: 20 },
    buttonsContainer: { flexDirection: 'row', gap: 10, marginTop: 20 },
});