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
                <Weeloop appGuid="e13f3070-69c5-11ea-9a63-811eefcd2144" />
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
