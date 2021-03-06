import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Weloop from "react-native-weloop";

export default class App extends Component {
    constructor(props) {
        super();
        this.weloop = React.createRef();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text>Une application parfaite pour weloop !</Text>
                    <Button
                        title="WebView"
                        onPress={() => {
                            this.weloop.current.invoke();
                        }}
                    />
                </View>
                <Weloop
                    ref={this.weloop}
                    custom={true}
                    appGuid="e13f3070-69c5-11ea-9a63-811eefcd2144"
                    user={{
                        email: "delon@yopmail.com",
                        firstname: "lucas",
                        lastname: "delon",
                        key: "wZcD1",
                    }}
                />
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
