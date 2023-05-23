import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    AsyncStorage,
    Dimensions
} from 'react-native';

import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export default class ObtenerClave extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            phone: '',
            sending: false,
        };
    }

    render() {

        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={ styles.formSignup }>
                    <FormLabel>Ingrese el número de teléfono registrado</FormLabel>
                    <FormInput
                        value={this.state.phone}
                        onChangeText={ (phone) => this.setState({phone}) }
                        keyboardAppearance='dark'
                        keyboardType='numeric'
                        clearButtonMode='always'
                        inputStyle={styles.inputBox}
                        textAlign={'center'}
                        containerStyle={{ borderBottomWidth: 0}}
                        underlineColorAndroid={'transparent'}
                    />

                    <Button 
                        buttonStyle={{

                            width: 200,
                            borderRadius: 25,
                            backgroundColor: 'rgb(18, 37, 204)',
                            marginVertical: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 10

                        }}
                        fontSize={18}
                        fontWeight="bold"
                        title="Enviar Contraseña"
                        loadingRight={true}
                        loading={ this.state.sending }
                        disabled={ this.state.sending }
                        onPress={ (this.onEnviarClave.bind(this)) }
                    />

                </View>
                </ScrollView>


            </View>
        );
    }

    onEnviarClave(){

        this.setState({
            sending: true
        })

        let body = JSON.stringify(
            {
                name: 'sendPassword',
                param: {
                    phone: this.state.phone,
                }
            }
        )

        return fetch('https://udicat.muniguate.com/apps/ave_api/', {
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
                sending: false
            })

            if (responseJson.response.status != 200) {
                
                Alert.alert(
                    'Error',
                    responseJson.response.message,
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

            }else{

                if (responseJson.response.result.id_send_email == 1) {
                    
                    //Se envio el correo electronico
                    Alert.alert(
                        'AVE',
                        "La contraseña ha sido enviada al correo electrónico registrado",
                        [
                            {text: 'OK'}
                        ],
                        {
                            cancelable: false
                        }
                    )
                    

                }else{

                    //No se envio
                    Alert.alert(
                        'Error',
                        "No se pudo enviar el correo electronico",
                        [
                            {text: 'OK'}
                        ],
                        {
                            cancelable: false
                        }
                    )

                }

            }

        })
        .catch((error) => {

            this.setState({
                sending: false
            })

            Alert.alert(
                'Error',
                "No se pudo enviar el correo electronico",
                [
                    {text: 'OK'}
                ],
                {
                    cancelable: false
                }
            )

        });

    }

}

const styles = StyleSheet.create({

    container: {

        flex: 1,
        justifyContent: 'center',

    },
    inputBox: {

        width: (Dimensions.get('window').width - 20),
        backgroundColor: 'rgb(175, 175, 175)',
        borderRadius: 25,
        fontSize: 24,
        color: '#ffffff',
        borderBottomWidth: 0

    },
    button: {

        borderRadius: 25,
        backgroundColor: 'rgb(18, 37, 204)',
        marginVertical: 20,

    },
    buttonText: {

        fontSize: 24,
        fontWeight: '500',
        color: 'rgb(255, 255, 255)',
        textAlign: 'center',
        alignContent: 'center'

    },
    formLogin: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        flex: 0.1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    formSignup: {
        alignItems: 'center',
        justifyContent: 'center',
    },

});
