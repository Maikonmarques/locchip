import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Keyboard,
  BackHandler,
  Alert,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import config from "./config";
import MapViewDirections from "react-native-maps-directions";

export default function App() {
  const origem = {
    latitude: -23.206164601092002,
    longitude: -49.37670077590586,
  };
  const destino = { 
    latitude: 37.771707, 
    longitude: -122.4053769
  };
  const mapEl = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
          function exitApp() {
            Alert.alert(
              'Access denied',
              'Access to location denied!!'
              [
                {text: 'Exit', onPress: () => BackHandler.exitApp()}
              ]
            )
            return true;
          } 
        return exitApp();
      }
    })();
  }, []);
  
  return (
    <View style={styles.container}>
      <Pressable onPress={Keyboard.dismiss} style={styles.press}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          zoomEnabled={false}
          loadingEnabled={true}
          ref={mapEl}
        >
          {destination &&(
            function getLoc(){
              const location = Location.getCurrentPositionAsync({});
              setOrigin(location);
              console.log(origin);
              {<MapViewDirections
                origin={origin}
                destination={destination}
                apikey={config.googleApi}
                strokeWidth={3}
                onReady={(result) => {
                  mapEl.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      top: 50,
                      bottom: 50,
                      left: 50,
                      right: 50,
                    },
                  });
                }}
              />}
            }
            )}
        </MapView>
      </Pressable>

      <View style={styles.search}>
        <GooglePlacesAutocomplete
          placeholder="Para onde vamos?"
          onPress={(data, details = null) => {
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.000922,
              longitudeDelta: 0.000421,
            });
            // }
          }}
          query={{
            key: config.googleApi,
            language: "pt-BR",
          }}
          fetchDetails={true}
          styles={{ listView: { height: 100 } }}
        ></GooglePlacesAutocomplete>
      </View>
    </View>
  );
}
// Api Key - Directions Api = 'AIzaSyA6XnuzCzchnanqHS_Ra6HbZvEDnvcUe1g'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    height: "100%",
  },
  press: {
    height: "65%",
  },
  search: {
    height: "35%",
    backgroundColor: "#EDEEE9",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});
