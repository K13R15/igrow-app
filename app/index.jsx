import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants'; 
import { CustomButton, Loader } from '../components';

const Welcome = () => {
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView style={styles.container}> 
            <Loader isLoading={loading} />

            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.innerContainer}>
                    {/* Logo */}
                    <Image
                        source={images.logo} // Replace with your app's logo
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* Smart Garden Graphic */}
                    <Image
                        source={images.smartGarden} // Replace with a smart garden-related image
                        style={styles.smartGarden}
                        resizeMode="contain"
                    />

                    {/* Intro Text */}
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>
                            Grow Smarter{'\n'}
                            with <Text style={styles.highlightedText}>iGROW</Text>
                        </Text>

                        <Image
                            source={images.plantPath} // Replace with a garden-related decorative image
                            style={styles.plantPath}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Subtext */}
                    <Text style={styles.subText}>
                        Experience the Future of Gardening with Smart Technology
                    </Text>

                    {/* Continue Button */}
                    <CustomButton
                        title="Get Started with iGROW"
                        handlePress={() => router.push('/sign-in')} // Navigate to sign-in screen
                        containerStyles={styles.buttonContainer}
                        textStyles={styles.buttonText}
                    />
                </View>
            </ScrollView>

            <StatusBar backgroundColor="#84CC16" style="light" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#84CC16',
        height: '100%',
    },
    scrollViewContainer: {
        height: '100%',
    },
    innerContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: 16,
    },
    logo: {
        width: 270,
        height: 100,
        marginBottom: 8,
        borderWidth: 4,
        borderColor: '#2F855A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    smartGarden: {
        maxWidth: 380,
        width: '100%',
        height: 298,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#2F855A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    textContainer: {
        marginTop: 20,
        position: 'relative',
    },
    titleText: {
        fontSize: 24,
        color: '#A7F3D0',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    highlightedText: {
        color: '#34D399',
    },
    plantPath: {
        width: 136,
        height: 15,
        position: 'absolute',
        bottom: -8,
        right: -32,
    },
    subText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#D1FAE5',
        marginTop: 28,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 28,
        backgroundColor: '#2F855A',
        borderRadius: 9999,
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    buttonText: {
        color: '#FFFFFF',
    },
});

export default Welcome;
