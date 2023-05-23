import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Dimensions,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';

import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

export default class DetallesNotificacion extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            message: '',
            protocolName: ''
        };
    }

    componentDidMount(){

        this.getNotification()

    }

    UNSAFE_componentWillReceiveProps(props){

        this.getNotification()

    }

    getNotification(){

        this.setState({ isLoading: true })

        AsyncStorage.getItem('@AVE2:NOTIFICATION_ID')
        .then((notificationID) => {

            let body = JSON.stringify(
                {
                    name: 'getNotification',
                    param: {
                        notificationID: notificationID
                    }
                }
            )

            fetch('https://udicat.muniguate.com/apps/ave_api/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'CONTENT-TYPE': 'application/json'
                },
                body: body
            })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    message: responseJson.response.result.MENSAJE,
                    protocolName: responseJson.response.result.NOMBRE
                })

            })
            .catch((error) => {

                console.warn(error);
                this.setState({ isLoading: false })

            });

        })
        .catch((error) => {
            console.warn(error);
            this.setState({ isLoading: false })

        })

        {/*

        let body = JSON.stringify(
            {
                name: 'getNotification',
                param: {
                    notificationID: this.props.notificationID
                }
            }
        )

        fetch('https://udicat.muniguate.com/apps/ave_api/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'CONTENT-TYPE': 'application/json'
            },
            body: body
        })
        .then((response) => response.json())
        .then((responseJson) => {

            console.warn(responseJson.response.result);

            this.setState({
                isLoading: false,
                message: responseJson.response.result.MENSAJE,
                protocolName: responseJson.response.result.NOMBRE
            })

        })
        .catch((error) => {

            console.warn(error);
            this.setState({ isLoading: false })

        });
        */}

    }

    render() {

        if (this.state.isLoading) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

        }else{

            return (
                <TouchableWithoutFeedback onPress={ Keyboard.dismiss } style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}} ref="foo" accesible={false}>
                    <View style={styles.container}>
                        <View >
                            <FormLabel>Mensaje</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <FormInput
                                    value={this.state.message}
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    multiline
                                    editable={this.state.isEditable}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
                        <Button
                            large
                            icon={{name: this.state.isEditable ? 'check' : 'edit', type: 'font-awesome'}}
                            title={ this.state.buttonText }
                            rounded={true}
                            backgroundColor='#2089dc'
                            buttonStyle={ this.state.isEditable ? styles.buttonPress : styles.button }
                            loadingRight={true}
                            disabled={ this.state.isSaving }
                            loading={ this.state.isSaving }
                            loadingRight={true}
                        />
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            )

        }


    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)'

    },
    inputBox: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#2089dc',
    },
    inputMultiline: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#2089dc',
        alignItems: 'flex-start'
    },
    inputContainer: {
        width: (Dimensions.get('window').width) - 50,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 10,
        borderTopColor: '#2089dc',
        borderRightColor: '#2089dc',
        borderBottomColor: '#2089dc',
        borderLeftColor: '#2089dc'

    },
    inputContainerDisabled: {
        width: (Dimensions.get('window').width) - 50,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 10,
        borderTopColor: '#2089dc',
        borderRightColor: '#2089dc',
        borderBottomColor: '#2089dc',
        borderLeftColor: '#2089dc',
        backgroundColor: 'rgb(228, 228, 228)'

    },
    button: {
        width: 160,
        backgroundColor: '#2089dc'
    },
    buttonDesactivar: {
        width: 160,
        backgroundColor: 'rgb(212, 55, 55)'
    },
    buttonPress: {
        width: 200,
        backgroundColor: 'rgb(85, 185, 16)'
    }

});
