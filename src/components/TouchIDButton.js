import React from 'react';
import {
    StyleSheet,
    Alert,
    AsyncStorage,
    View
} from 'react-native';

import { Icon } from 'react-native-elements';

import { Actions } from 'react-native-router-flux';

import TouchID from 'react-native-touch-id'

const optionalConfigObject = {
    title: "Authentication Required", // Android
    imageColor: "#e00606", // Android
    imageErrorColor: "#ff0000", // Android
    sensorDescription: "Touch sensor", // Android
    sensorErrorDescription: "Failed", // Android
    cancelText: "Cancel", // Android
    fallbackLabel: "Show Passcode", // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false // iOS
  }
  
export default class TouchIDButton extends React.Component {

    constructor(props){
        super(props);

        // console.warn(props)

        this.state = {
            isTouchID: props.touchID,
            biometryType: props.type_touch_id
        };

    }

    UNSAFE_componentWillReceiveProps(nextProps){

         this.setState({
            isTouchID: nextProps.touchID,
            biometryType: nextProps.type_touch_id
        })

    }

    loginBiometric(){

        TouchID.authenticate('Inicio de Sesión', optionalConfigObject)
        .then(success => {

            AsyncStorage.multiGet(['@AVE2:APP_TOKEN', '@AVE2:USER_PHONE', '@AVE2:USER_PASS'])
            .then((valor) => {

            console.log(valor)    

            let token = valor[0][1]
            let phone = valor[1][1]
            let pass = valor[2][1]

            let body = JSON.stringify(
                {
                    name: 'login',
                    param: {
                        phone: phone,
                        pass: pass,
                        token: token
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
                /* Se obtiene respuesta safistactoria del API */

                if (responseJson.response.status != 200) {

                    Alert.alert(
                        'Error Código ' + responseJson.response.status,
                        responseJson.response.message,
                        [
                            {text: 'OK'}
                        ],
                        {
                            cancelable: false
                        }
                    )

                }else{

                    if (responseJson.response.result.ADMINISTRADOR) {

                        AsyncStorage.setItem('@AVE2:USER_ADMIN', 'S')
                        .then((valor) => {

                        })
                        .catch((error) => {
                        })

                    }else{

                        console.warn('El usuario no es Administrador');

                    }


                    AsyncStorage.setItem('@AVE2:USER_ID', (responseJson.response.result.ID_PERSONA).toString())
                    .then((valor) => {

                        Actions.reset('home_routes')
                    })
                    .catch((error) => {
                    })

                }

            })
            .catch((error) => {

                console.warn(error)

                /* Ocurre un error */

                Alert.alert(
                    'AVE',
                    'Existen problemas con la conexión al servicio.',
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

            });

        })
        .catch((error) => {

            Alert.alert(
                'Error',
                error,
                [
                    {text: 'OK'}
                ],
                {
                    cancelable: false
                }
            )

        });

        })
        .catch(error => {

        })

    }

    render() {

        if(this.state.isTouchID){

            // console.warn(this.state.biometryType)

            return (
                <Icon
                    reverse={true}
                    raised
                    name={ this.state.biometryType == 'FaceID' ? 'emoji-happy' : 'fingerprint' }
                    type='entypo'
                    color='#caccce'
                    size={40}
                    onPress={() => 
        
                        this.loginBiometric()
                    } 
                />
            )

        }else{

            return(
                <View>
                </View>
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

});
