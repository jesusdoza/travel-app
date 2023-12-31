import React, { useState } from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { OpenTrip as PlacesService } from "../services/openTrip";
import { View, Text, FlatList } from "react-native";
import { PlaceCard } from "./PlaceCard/PlaceCard";
import Carousel from "react-native-snap-carousel";
import PlaceCardContainer from "../container/PlaceCardContainer";

export default function FindPlaces({
    location,
    setMapLocation,
    setAttractions,
    setMapZoom,
}) {
    //get list of places  form places service

    const [listOfPlaces, setListOfPlaces] = useState([]);

    //TODO got to attraction on map base on index
    function goToAttraction(index) {
        const attraction = listOfPlaces[index];

        //change map marker to location
        setMapLocation({
            lat: attraction.cords.coordinates[1],
            lng: attraction.cords.coordinates[0],
        });
        setMapZoom((zoom) => {
            return 10;
        });
    }

    async function getPlaces() {
        try {
            //get nearby attractions
            const listOfPlaces = await PlacesService.getPlacesByRadius(
                location.lat,
                location.lng,
                10000,
                20
            );

            //format data to fit the placeCard component props
            const placeCardFormat = listOfPlaces.map((data) => {
                return {
                    id: data.id,
                    name: data.properties.name
                        ? data.properties.name
                        : "Nearby",
                    type: data.type,
                    cords: data.geometry,
                    wikidata: data.properties.wikidata,
                };
            });
            setListOfPlaces(placeCardFormat);
        } catch (error) {
            console.log("error using places service from foundplacesButton");
        }
    }
    return (
        <View>
            <View style={styles.carouselContainer}>
                <Text>places list here</Text>
                <Carousel
                    onSnapToItem={goToAttraction}
                    sliderWidth={400}
                    // sliderHeight={200}
                    itemWidth={250}
                    // itemHeight={200}
                    data={listOfPlaces}
                    renderItem={(data, index) => {
                        // return <PlaceCard placeData={data.item} />;
                        return <PlaceCardContainer placeData={data.item} />;
                    }}></Carousel>
            </View>
            <Button onPress={getPlaces} mode="contained" style={styles.button}>
                get places
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        bottom: 1,
        // position: "absolute",
        width: "100%",
    },
    carouselContainer: {
        borderBottomColor: "green",
        width: "100%",
        zIndex: 20,
    },
});
