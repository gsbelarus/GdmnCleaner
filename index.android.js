'use strict';
import React, {Component} from 'react'
import Dialog from './Dialog'
import ProgressDialog from './ProgressDialog'
import SharedPreferences from 'react-native-shared-preferences'
import {
    Image,
    AppRegistry,
    StatusBar,
    Dimensions,
    StyleSheet,
    Text,
    Alert,
    Button,
    TouchableNativeFeedback,
    TouchableOpacity,
    TextInput,
    TouchableHighlight,
    BackAndroid,
    View
} from 'react-native';
import Camera from 'react-native-camera';

export default class Cleaner_new extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            showDialogURL: false,
            isFirstStart: false,
            fetching: false,
            barCode: "",
            textURL: "",
            dialogType: null,
            errorMessage: ""
        };
    }

    componentDidMount = () => {
        SharedPreferences.getItem("URL", (value) => {
            if (!value) this.setState({showDialogURL: true});
            else this.setState({textURL: value})
        });

        if (!this.state.isFirstStart) {
            Alert.alert("Сообщение", "Для корректной работы приложения включите интернет и передачу геоданных", [
                {text: 'OK'}
            ]);
            this.setState({isFirstStart: true});
        }

    };

    render() {

        return (
            <View style={styles.container}>
                <StatusBar
                    animated
                    hidden
                />

                <ProgressDialog
                    visible={this.state.fetching}
                    text={"Идет загрузка"}
                />

                <Dialog
                    disableConfirmButton={false}
                    showCancelButton={true}
                    visible={this.state.showDialog}
                    onRequestClose={() => {
                        this.setState({showDialog:false});
                        this.setState({barCode: ""});
                    }}
                    onPressCancel={() => {
                        this.setState({showDialog:false});
                        this.setState({barCode: ""});
                    }}
                    onPressConfirm={this.getOnPressConfirm()}>
                    <Text style={{margin: 22, color: '#000000', fontSize: 16}}>
                        {this.getTextDilog()}
                    </Text>
                </Dialog>

                <Dialog
                    visible={this.state.showDialogURL}
                    disableConfirmButton={!this.state.textURL}
                    showCancelButton={false}
                    onRequestClose={() => {}}
                    onPressConfirm={() => {
                        SharedPreferences.setItem("URL", this.state.textURL);
                        this.setState({showDialogURL:false});
                    }}>
                    <Text style={{margin: 22, color: '#000000', fontSize: 16}}>
                        {'Введите адрес сервера'}
                    </Text>
                    <TextInput
                        style={{marginLeft: 22, marginRight: 22}}
                        onChangeText={(text) => {
                            this.setState({textURL: text});
                        }}
                        value={this.state.textURL}
                        underlineColorAndroid="#F44336"
                        selectionColor="#F44336"
                    />
                </Dialog>

                <Camera
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}
                    captureTarget={Camera.constants.CaptureTarget.cameraRoll}
                    type={Camera.constants.Type.back}
                    flashMode={ Camera.constants.FlashMode.auto}
                    onBarCodeRead={(data, bounds) => {
                        if(!this.state.showDialogURL) {
                            if(this.state.barCode == "") {
                                this.setState({barCode: data.data});
                                this.setState({dialogType: "main"});
                                this.setState({showDialog: true});
                            }
                        }
                    }}
                    defaultTouchToFocus
                    mirrorImage={false}
                />


                <View style={[styles.overlay, styles.topOverlay]}>

                    <TouchableOpacity
                        style={styles.typeTouchableOpacity}
                        onPress={() => {this.setState({showDialogURL: true})}}
                    >
                        <Text style={styles.typeButton}>
                            ИЗМЕНИТЬ АДРЕС СЕРВЕРА
                        </Text>
                    </TouchableOpacity>

                </View>


            </View>
        );
    }

    getTextDilog = () => {
        switch (this.state.dialogType) {
            case "main":
                return ('Отправить данные с баркода ?\n' + this.state.barCode);
            case "success":
                return ('Данные отправлены успешно');
            case "error":
                return ('Ошибка! ' + this.state.errorMessage);
        }
    };

    getOnPressConfirm = () => {
        switch (this.state.dialogType) {
            case "main":

                return () => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            new Promise((resolve, reject) => {
                                let timeout = setTimeout(() => {
                                        reject(new Error("Нет соединения с сервером"))
                                    },
                                    15000);
                                this.setState({fetching: true});
                                fetch('http://' + this.state.textURL + '/?token=garbit&barcode=' + this.state.barCode +
                                    '&lngn=' + position.coords.longitude + '&latn=' + position.coords.latitude, {
                                    method: 'get'
                                })
                                    .then((response) => {
                                        clearTimeout(timeout);
                                        return response;
                                    })
                                    .then(checkStatus)
                                    .then((response) => response.text())
                                    .then((response) => {
                                        this.setState({fetching: false});
                                        if (response == 'done') {
                                            this.setState({showDialog: false});
                                            this.setState({dialogType: "success"});
                                            this.setState({showDialog: true});
                                        } else {
                                            reject(new Error("Failed"))
                                        }
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    })
                            })
                                .catch((error) => {
                                    this.setState({errorMessage: error.message});
                                    this.setState({fetching: false});
                                    this.setState({showDialog: false});
                                    this.setState({dialogType: "error"});
                                    this.setState({showDialog: true});
                                });
                        }, (error) => {
                            error = "Не предоставлен доступ к геолокации";
                            this.setState({errorMessage: error});
                            this.setState({showDialog: false});
                            this.setState({dialogType: "error"});
                            this.setState({showDialog: true});
                        },
                        {enableHighAccuracy: false});
                    this.setState({showDialog: false});
                };
            case "success":
                return () => {
                    this.setState({barCode: ""});
                    this.setState({showDialog: false});
                };
            case "error":
                return () => {
                    this.setState({barCode: ""});
                    this.setState({showDialog: false});
                };

        }
    }
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    }
    else if (response.status == 400) {
        throw new Error("Ошибочный запрос");
    }
    else if (response.status == 500) {
        throw new Error("Неверный штрихкод");
    }
    else {
        throw new Error("Неизвестная ошибка");
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    preview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    topOverlay: {
        bottom: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeTouchableOpacity: {
        padding: 5
    },
    typeButton: {
        padding: 15,
        backgroundColor: "#F44336",
        fontSize: 16,
        color: "#FFFFFF",
    },
});

AppRegistry.registerComponent('Cleaner_new', () => Cleaner_new);
