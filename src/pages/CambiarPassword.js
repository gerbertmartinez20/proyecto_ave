import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    AsyncStorage
} from 'react-native';

import { FormLabel, FormInput, Button, Icon } from 'react-native-elements'

import AwesomeAlert from 'react-native-awesome-alerts';

import { Actions } from 'react-native-router-flux';

export default class CambiarPassword extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            actual_password: '',
            mostrar_actual_password: false,
            new_password: '',
            mostrar_new_password: false,
            renew_password: '',
            mostrar_renew_password: false,
            pass_incorrecto: false,
            cambiandoPassword: false,
            alertaError: false,
            mensajeError: '',
            passCambiado: false
        };

    }

    render() {

        return (
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss }  accessible={false}>
            <View style={styles.container}>
                <View>
                    <FormLabel>Ingrese la contraseña actual</FormLabel>
                    <View style={styles.inputContainer}>
                        <FormInput
                            value={this.state.actual_password}
                            onChangeText={ (actual_password) => this.setState({actual_password}) }
                            inputStyle={styles.inputBox}
                            containerStyle={{ borderBottomWidth: 0}}
                            underlineColorAndroid={'transparent'}
                            keyboardAppearance='dark'
                            secureTextEntry={!this.state.mostrar_actual_password}
                        />
                        <Icon
                            name={ this.state.mostrar_actual_password ? 'eye-slash' : 'eye' }
                            type='font-awesome'
                            onPress={ () =>  {

                                this.setState({
                                    mostrar_actual_password: !this.state.mostrar_actual_password
                                })

                            }}
                            containerStyle={{ paddingRight: 10 }}
                        />
                    </View>

                    <FormLabel>Ingrese la nueva contraseña</FormLabel>
                    <View style={styles.inputContainer}>
                        <FormInput
                            value={this.state.new_password}
                            onChangeText={ (new_password) => this.setState({new_password}) }
                            inputStyle={styles.inputBox}
                            containerStyle={{ borderBottomWidth: 0}}
                            underlineColorAndroid={'transparent'}
                            keyboardAppearance='dark'
                            secureTextEntry={!this.state.mostrar_new_password}
                        />
                        <Icon
                            name={ this.state.mostrar_new_password ? 'eye-slash' : 'eye' }
                            type='font-awesome'
                            onPress={ () =>  {

                                this.setState({
                                    mostrar_new_password: !this.state.mostrar_new_password
                                })

                            }}
                            containerStyle={{ paddingRight: 10 }}
                        />
                    </View>

                    <FormLabel>Repita la nueva contraseña</FormLabel>
                    <View style={styles.inputContainer}>
                        <FormInput
                            value={this.state.renew_password}
                            onChangeText={ (renew_password) => this.setState({renew_password}) }
                            inputStyle={styles.inputBox}
                            containerStyle={{ borderBottomWidth: 0}}
                            underlineColorAndroid={'transparent'}
                            keyboardAppearance='dark'
                            secureTextEntry={!this.state.mostrar_renew_password}
                        />
                        <Icon
                            name={ this.state.mostrar_renew_password ? 'eye-slash' : 'eye' }
                            type='font-awesome'
                            onPress={ () =>  {

                                this.setState({
                                    mostrar_renew_password: !this.state.mostrar_renew_password
                                })

                            }}
                            containerStyle={{ paddingRight: 10 }}
                        />
                    </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20}}>
                    <Button
                        icon={{name: 'key', type: 'font-awesome'}}
                        title={ 'Cambiar Contraseña' }
                        rounded={true}
                        buttonStyle={{ backgroundColor: 'red' }}
                        onPress={ () => {
                            this.cambiar_password()
                        }}
                        loading={this.state.cambiandoPassword}
                        loadingRight={true}
                        disabled={this.state.cambiandoPassword}
                    />
                </View>

                <AwesomeAlert
                    show={this.state.pass_incorrecto}
                    title="La nueva contraseña debe de ser igual en ambos campos"
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmButtonColor="#DD6B55"
                    confirmText="Aceptar"
                    onConfirmPressed={() => {

                        this.setState({
                            pass_incorrecto: false
                        })

                    }}
                />

                <AwesomeAlert
                    show={this.state.alertaError}
                    title={this.state.mensajeError}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmButtonColor="#DD6B55"
                    confirmText="Aceptar"
                    onConfirmPressed={() => {

                        this.setState({
                            alertaError: false
                        })

                    }}
                />

                <AwesomeAlert
                    show={this.state.passCambiado}
                    title='La contraseña ha sido cambiada exitosamente, deberá volver a iniciar sesión'
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmButtonColor="#DD6B55"
                    confirmText="Aceptar"
                    onConfirmPressed={() => {

                        AsyncStorage.removeItem('@AVE2:USER_ADMIN')
                        .then((valor) => {

                        })
                        .catch((error) => {
                            console.warn(error);
                        })

                        AsyncStorage.removeItem('@AVE2:USER_ID')
                        .then((valor) => {

                            this.setState({
                                passCambiado: false
                            })

                            Actions.reset('login_routes')

                        })
                        .catch((error) => {
                            console.warn(error);
                        })

                    }}
                />

            </View>

            

            </TouchableWithoutFeedback>
        );
    }

    async cambiar_password(){

        if (this.state.new_password != this.state.renew_password) {
            
            this.setState({
                pass_incorrecto: true
            })

        }else{

            this.setState({
                cambiandoPassword: true
            })

            const id_usuario =  await AsyncStorage.getItem('@AVE2:USER_ID')

            let body = JSON.stringify(
                {
                    name: 'changePassword',
                    param: {
                        id_usuario: id_usuario,
                        actual_password: this.state.actual_password,
                        nuevo_password: this.state.new_password
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

                console.log(responseJson)

                if (responseJson.response.status != 200) {
                    
                    this.setState({
                        alertaError: true,
                        mensajeError: responseJson.response.message,
                        cambiandoPassword: false
                    })

                }else{

                    this.setState({
                        passCambiado: true,
                        cambiandoPassword: false
                    })

                }

            })
            .catch((error) => {

                this.setState({ isLoading: false })

            });

        }

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)',

    },
    inputContainer: {
        // width: (Dimensions.get('window').width) - 50,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        borderRightColor: '#d2d4d8',
        borderBottomColor: '#d2d4d8',
        borderLeftColor: '#d2d4d8',
        flexDirection: 'row',
    },
    inputBox: {
        width: (Dimensions.get('window').width) - 120,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#2089dc',
        justifyContent: 'center',
        alignItems: 'center',
        
    },

});
