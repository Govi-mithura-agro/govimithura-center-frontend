import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Header from '@/layouts/header';

// Import your API key from a separate file for security
import { GOOGLE_MAPS_APIKEY } from "./googleMapKey";

const Map = () => {
    const [state, setState] = useState({
        pickupCords: {
            latitude: 8.3114,
            longitude: 80.4037,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        dropLocationCoords: {
            latitude: 7.4818,
            longitude: 80.3609,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
    });

    const { pickupCords, dropLocationCoords } = state;

    return (
        <View style={styles.container}>
            <Header />
            <MapView
                style={styles.map}
                initialRegion={pickupCords}
            >
                <MapViewDirections
                    origin={pickupCords}
                    destination={dropLocationCoords}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={30}
                    strokeColor="hotpink"
                    onError={(errorMessage) => {
                        console.log('MapViewDirections Error:', errorMessage);
                    }}
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Map;