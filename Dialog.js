import React, {Component} from 'react'
import {
    Modal,
    View,
    TouchableNativeFeedback,
    Text
} from 'react-native'

export default class Dialog extends Component {
    constructor(props) {
        super(props);

        this.state = {visible: false};
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({visible: nextProps.visible});
    };

    render() {
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                onRequestClose={this.props.onRequestClose}
                visible={this.state.visible}>
                <View
                    style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)"}}>
                    <View elevation={6} style={{width: 330, backgroundColor: '#FFFFFF', borderRadius: 2}}>
                        {this.props.children}
                        <View
                            style={{alignItems: "center", justifyContent: "flex-end", flexDirection: "row", height: 56}}>
                            <TouchableNativeFeedback
                                disable={this.props.showCancelButton}
                                background={TouchableNativeFeedback.SelectableBackground()}
                                onPress={this.props.showCancelButton ? this.props.onPressCancel : () => {}}>
                                <View
                                    style={this.props.showCancelButton ?
                                     {marginTop: 8, marginBottom: 8, padding: 16, alignItems: "center", justifyContent: "center"} :
                                    {width: 0, height: 0}}>
                                    <Text
                                        style={{fontSize: 14, fontWeight: "bold", color: "#F44336"}}>{"ОТМЕНА"}</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback
                                disable={this.props.disableConfirmButton}
                                background={TouchableNativeFeedback.SelectableBackground()}
                                onPress={this.props.disableConfirmButton ? () => {} : this.props.onPressConfirm}>
                                <View
                                    style={{marginRight: 16, marginTop: 8, marginBottom: 8, padding: 16, alignItems: "center", justifyContent: "center"}}>
                                    <Text
                                        style={{fontSize: 14, fontWeight: "bold", color: this.props.disableConfirmButton ?  "#EF9A9A" : "#F44336"}}>{"OK"}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}