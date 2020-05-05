import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Weeloop from "react-native-weloop";

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text>Une application parfaite pour weloop !</Text>
                </View>
                <Weeloop appGuid="67540390-b3c1-11e9-a487-43674d54ecce" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffa",
        alignItems: "center",
        justifyContent: "center",
    },
});
