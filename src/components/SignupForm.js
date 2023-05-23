import React from 'react';
import {
    StyleSheet,
    Text,
    View,
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

import Logo from '../components/Logo';

export default class Form extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            nombre: '',
            telefono: '',
            email: '',
            password: '',
            confirm_password: '',
            organizacion: '',
            registrando: false,
            completado: false,
            scroll: false
        };
    }


    render() {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 150

        return (
            <View style={styles.container}>

                <KeyboardAvoidingView style={{  }} behavior={ Platform.OS == "ios" ? "padding" : null } enabled >

                <ScrollView  style={{ }} showsVerticalScrollIndicator={false}>

                <Logo />
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <FormLabel>Nombre y Apellido</FormLabel>
                    <FormInput
                        value={this.state.nombre}
                        onChangeText={ (nombre) => this.setState({nombre}) }
                        keyboardAppearance='dark'
                        keyboardType='default'
                        clearButtonMode='always'
                        inputStyle={styles.inputBox}
                        textAlign={'center'}
                        containerStyle={{ borderBottomWidth: 0}}
                        underlineColorAndroid={'transparent'}
                    />

                    <FormLabel>Teléfono</FormLabel>
                    <FormInput
                        value={this.state.telefono}
                        onChangeText={ (telefono) => this.setState({telefono}) }
                        keyboardAppearance='dark'
                        keyboardType='numeric'
                        clearButtonMode='always'
                        secureTextEntry={ false }
                        inputStyle={styles.inputBox}
                        textAlign={'center'}
                        containerStyle={{ borderBottomWidth: 0}}
                        underlineColorAndroid={'transparent'}
                    />

                    <FormLabel>Email</FormLabel>
                    <FormInput
                        value={this.state.email}
                        onChangeText={ (email) => this.setState({email}) }
                        keyboardAppearance='dark'
                        keyboardType='email-address'
                        clearButtonMode='always'
                        secureTextEntry={ false }
                        inputStyle={styles.inputBox}
                        textAlign={'center'}
                        containerStyle={{ borderBottomWidth: 0}}
                        underlineColorAndroid={'transparent'}
                    />

                    <FormLabel>Organización, Entidad o Familia</FormLabel>
                    <FormInput
                        value={this.state.organizacion}
                        onChangeText={ (organizacion) => this.setState({organizacion}) }
                        keyboardAppearance='dark'
                        keyboardType='default'
                        clearButtonMode='always'
                        secureTextEntry={ false }
                        inputStyle={styles.inputBox}
                        textAlign={'center'}
                        containerStyle={{ borderBottomWidth: 0}}
                        underlineColorAndroid={'transparent'}
                    />

                    <FormLabel>Contraseña</FormLabel>
                    <FormInput
                        value={this.state.password}
                        onChangeText={ (password) => this.setState({password}) }
                        keyboardAppearance='dark'
                        keyboardType='default'
                        clearButtonMode='always'
                        secureTextEntry={ true }
                        inputStyle={styles.inputBox}
                        textAlign={'center'}
                        containerStyle={{ borderBottomWidth: 0}}
                        underlineColorAndroid={'transparent'}
                    />

                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormInput
                        value={this.state.confirm_password}
                        onChangeText={ (confirm_password) => this.setState({confirm_password}) }
                        keyboardAppearance='dark'
                        keyboardType='default'
                        clearButtonMode='always'
                        secureTextEntry={ true }
                        inputStyle={styles.inputBox}
                        textAlign={'center'}
                        containerStyle={{ borderBottomWidth: 0}}
                        underlineColorAndroid={'transparent'}
                    />

                    {/* <TouchableOpacity style={styles.button} onPress={ (this.onRegister.bind(this)) }>
                        <Text style={styles.buttonText}> Crear Cuenta </Text>
                    </TouchableOpacity> */}

                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Button 
                            buttonStyle={styles.button}
                            title="Crear Cuenta"
                            disabled={this.state.registrando}
                            loading={this.state.registrando}
                            loadingRight={true}
                            onPress={ (this.onRegister.bind(this)) }
                            fontSize={20}
                            fontWeight="bold"
                        />
                    </View>

                    <View style={styles.signupTextCont}>
                        <Text style={styles.signupText}>¿Ya tiene una cuenta? </Text>
                        <TouchableOpacity onPress={this.login}>
                            <Text style={styles.signupButton}  >Iniciar Sesión </Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>

                </KeyboardAvoidingView>


            </View>

        );
    }

    login(){

        Actions.pop()
        
    }

    onRegister(){

        this.setState({
            registrando: true
        })

        // if (this.state.nombre == '') {

        //     Alert.alert(
        //         'Error',
        //         'Debe ingresar su nombre y apellido',
        //         {
        //             cancelable: false
        //         }
        //     )

        // }else if(this.state.telefono == ''){

        //     Alert.alert(
        //         'Error',
        //         'Debe ingresar su número de teléfono',
        //         {
        //             cancelable: false
        //         }
        //     )

        // }else if(this.state.email == ''){

        //     Alert.alert(
        //         'Error',
        //         'Debe ingresar su email',
        //         {
        //             cancelable: false
        //         }
        //     )

        // }else if(this.state.organizacion == ''){

        //     Alert.alert(
        //         'Error',
        //         'Debe ingresar nombre de organización, entidad o familia',
        //         {
        //             cancelable: false
        //         }
        //     )

        // }else if(this.state.password == ''){

        //     Alert.alert(
        //         'Error',
        //         'Debe ingresar una contraseña',
        //         {
        //             cancelable: false
        //         }
        //     )

        // }else{

        //     //console.log(this.state.password);
            


        // }

        AsyncStorage.getItem('@AVE2:APP_TOKEN')
        .then((valor) => { 

            let body = JSON.stringify(
                {
                    name: 'register',
                    param: {
                        name: this.state.nombre,
                        phone: this.state.telefono,
                        email: this.state.email,
                        organizacion: this.state.organizacion,
                        pass: this.state.password,
                        confirm_pass: this.state.confirm_password,
                        token: valor
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

                console.log(responseJson)

                this.setState({
                    registrando: false
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

                    Alert.alert(
                        'AVE',
                        'Registro realizado exitosamente.',
                        [
                            {text: 'OK', onPress: () => {

                                Actions.pop()

                            }}
                        ],
                        {
                            cancelable: false
                        }
                    )                        

                }

            })
            .catch((error) => {

                /* Ocurre un error */

                this.setState({
                    registrando: false
                })

                Alert.alert(
                    'AVE',
                    'Se ha producido un error. ' + error,
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

            this.setState({
                registrando: false
            })

            Alert.alert(
                'AVE',
                'Se ha producido un error. ' + error,
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

        // flex: 1,
        paddingTop: 20,
        // alignItems: 'center',
        // justifyContent: 'center'

    },
    inputBox: {

        backgroundColor: 'rgb(175, 175, 175)',
        borderRadius: 25,
        fontSize: 24,
        color: '#ffffff',
        borderBottomWidth: 0,
        width: (Dimensions.get('window').width - 20)

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

    signupTextCont: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row',
    },
    signupText: {
        alignItems: 'flex-end',
        fontSize: 20
    },
    signupButton: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
        fontSize: 24
    }

});
