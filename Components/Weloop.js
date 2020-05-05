import { WebView } from "react-native-webview";
import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import SvgRenderer from "react-native-svg-renderer";
import { captureScreen } from "react-native-view-shot";
import { getStatusBarHeight } from "react-native-status-bar-height";
import CryptoJS from "react-native-crypto-js";

export default class Weloop extends Component {
    state = {
        isButtonVisible: true,
        isWebView: false,
        isLoading: true,
        primaryColor: "#000",
        positionRight: true,
        icon: null,
        notifNb: "?",
        invocationMethod: ".fab",
        base64Img: null,
        isCaptured: false,
        token: null,
    };

    constructor(props) {
        super();
        this.webView = React.createRef();
        this.state.isButtonVisible =
            props.isCustom === false || props.isCustom === undefined;
    }

    componentDidMount() {
        fetch(
            "https://staging-api.30kg-rice.cooking/widget/" + this.props.appGuid
        )
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    primaryColor: `rgba(${json.Widget_PrimaryColor.r}, ${json.Widget_PrimaryColor.g}, ${json.Widget_PrimaryColor.b}, ${json.Widget_PrimaryColor.a})`,
                    positionRight: json.Widget_Position === "Right",
                    icon: json.Widget_Icon,
                    isLoading: false,
                    token: this.props.user
                        ? this.initToken(this.props.user)
                        : null,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    invoke() {
        this.setState({ isLoading: true }, () => {
            captureScreen({
                result: "base64",
                quality: 1,
            }).then(
                (base64Img) => {
                    this.setState(
                        {
                            isLoading: false,
                            base64Img,
                        },
                        () => {
                            this.setState({
                                isWebView: true,
                            });
                        }
                    );
                },
                (error) => console.error("Snapshot failed", error)
            );
        });
    }

    initToken = (user) => {
        let msg =
            user.email +
            "|" +
            user.firstname +
            "|" +
            user.lastname +
            "|" +
            user.key;
        let token = CryptoJS.AES.encrypt(msg, this.props.appGuid).toString();
        console.log(
            "MSG: " +
                msg +
                " // KEY: " +
                this.props.appGuid +
                " // TOKEN: " +
                token
        );
        return token;
    };

    handleOnMessage(event) {
        switch (JSON.parse(event.nativeEvent.data).data.name) {
            case "get-screenshot":
                if (this.state.isCaptured) return;
                this.setState({ isCaptured: true }, () => {
                    this.webView.current.injectJavaScript(
                        `window.getCapture('data:image/jpg;base64, ${this.state.base64Img}');true;`
                    );
                });
                break;
            case "mode-panel-close":
                this.setState({
                    isWebView: false,
                });
                break;
            case "mode-panel":
                this.setState({ isCaptured: false });
                break;
            case "setNotificationCount":
                console.log(JSON.parse(event.nativeEvent.data).data.value);
                if (JSON.parse(event.nativeEvent.data).data.value !== undefined)
                    this.setState({
                        notifNb: JSON.parse(event.nativeEvent.data).data.value,
                    });
                break;
            default:
                break;
        }
    }

    render() {
        if (this.state.isWebView) {
            return (
                <View
                    style={{ ...styles.root, paddingTop: getStatusBarHeight() }}
                >
                    <WebView
                        ref={this.webView}
                        source={{
                            uri:
                                "https://staging-widget.30kg-rice.cooking/home?appGuid=" +
                                this.props.appGuid,
                        }}
                        javaScriptEnabled
                        domStorageEnabled
                        userAgent="Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19"
                        onLoadStart={() => {
                            this.setState({ isLoading: true });
                        }}
                        onLoadEnd={() => {
                            if (
                                this.state.token != null &&
                                this.state.token != null
                            ) {
                                setTimeout(() => {
                                    console.log(
                                        this.props.appGuid +
                                            " " +
                                            this.state.token
                                    );
                                    this.webView.current.injectJavaScript(
                                        `window.GetCurrentUser({ appGuid: '${this.props.appGuid}', token: '${this.state.token}'});true;`
                                    );
                                }, 5000);
                            }
                            this.setState({ isLoading: false });
                        }}
                        injectedJavaScript={`
                        window.addEventListener("message", function (event) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({data: event.data } ));
                          });
                          true;
                            `}
                        onMessage={(event) => this.handleOnMessage(event)}
                        startInLoadingState
                        incognitotimes
                    />
                </View>
            );
        } else if (!this.state.isButtonVisible) {
            return <View style={styles.root} />;
        }
        return (
            <View style={styles.root}>
                {this.state.isLoading ? null : (
                    <TouchableOpacity
                        style={{
                            ...styles.button,
                            backgroundColor: this.state.primaryColor,
                            ...(this.state.positionRight
                                ? styles.right
                                : styles.left),
                        }}
                        onPress={() => {
                            this.invoke();
                        }}
                    >
                        {this.state.icon ? (
                            <Image
                                source={{ uri: this.state.icon }}
                                resizeMode="cover"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 75,
                                }}
                            />
                        ) : (
                            <SvgRenderer
                                width="25"
                                height="25"
                                source={require("./../assets/images/logo.svg")}
                            />
                        )}
                        {this.state.notifNb !== "?" &&
                        this.state.notifNb > 0 ? (
                            <View style={styles.label}>
                                <Text style={styles.labelText}>
                                    {this.state.notifNb}
                                </Text>
                            </View>
                        ) : null}
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        borderRadius: 75,
        position: "absolute",
        bottom: 20,
        elevation: 5,
    },
    loader: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    loaderAction: {
        position: "absolute",
        bottom: 20,
    },
    label: {
        backgroundColor: "#ff2e8d",
        alignItems: "center",
        justifyContent: "center",
        right: 0,
        top: -5,
        width: 20,
        height: 20,
        borderRadius: 75,
        position: "absolute",
    },
    labelText: {
        color: "#fff",
    },
    right: {
        right: 20,
    },
    left: {
        left: 20,
    },
});
