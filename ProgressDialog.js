import React, {Component} from 'react'
import {Modal, View, ActivityIndicator, Text} from 'react-native'

export default class ProgressDialog extends Component {
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
                onRequestClose={() => {}}
                visible={this.state.visible}>
                <View
                    style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)"}}>
                    <View elevation={6}
                          style={{height: 100, width: 350, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 2}}>
                        <ActivityIndicator
                            animating={true}
                            style={{height: 60}}
                            size="large"
                            color="#F44336"
                        />
                        <Text
                            style={{fontSize: 16, margin: 16}}>{this.props.text}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
}