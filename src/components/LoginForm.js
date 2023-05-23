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
    ActivityIndicator,
    AsyncStorage,
    Dimensions

} from 'react-native';

import { FormLabel, FormInput, Card, Icon, FormValidationMessage, Button } from 'react-native-elements';

import { Actions } from 'react-native-router-flux';

import TouchIDButton from './TouchIDButton';

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

export default class LoginForm extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            telefono: '',
            password: '',
            isLoading: 0,
            isLoginInProcess: false,
            isDisabledNotification: false,
            isTouchID: false,
            isCheking: true,
            huawei_device: null
        };

    }

    componentDidMount(){

        this.checkTouchID()

    }

    UNSAFE_componentWillReceiveProps(nextProps){

        this.checkTouchID()

    }

    async checkTouchID(){

        const value = await AsyncStorage.getItem('@AVE2:TOUCH_ID');
        const type_touch_id = await AsyncStorage.getItem('@AVE2:TOUCH_ID_TIPE');

        this.setState({
            isTouchID: JSON.parse(value),
            type_touch_id: JSON.parse(type_touch_id)
        })

    }

    render() {

        if (this.state.isLoading == 0) {
            return (

                <View style={styles.container}>

                    <View style={ styles.formLogin }>
                        <FormLabel>Número de Teléfono</FormLabel>
                        <FormInput
                            value={this.state.telefono}
                            onChangeText={ (telefono) => this.setState({telefono}) }
                            keyboardAppearance='dark'
                            keyboardType='numeric'
                            clearButtonMode='always'
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

                    </View>

                    <TouchableOpacity style={styles.button} onPress={ (this.onLogin.bind(this)) }>
                        <Text style={styles.buttonText}> Iniciar Sesión </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={
                            () => {
                                Actions.obtener_clave()
                            }
                        }
                    >
                        <Text
                            style={{ 
                                fontSize: 16,
                                color: '#619af4',
                                textDecorationLine: 'underline'
                             }}
                        >¿Ha olvidado su contraseña?</Text>
                    </TouchableOpacity>

                    <TouchIDButton touchID={this.state.isTouchID} type_touch_id={this.state.type_touch_id} />

                    <View style={styles.loading}>

                    </View>

                </View>

            );

        }else{

            return (

                <View style={styles.container}>

                    <View style={ styles.formLogin }>
                        <FormLabel>Número de Teléfono</FormLabel>
                        <FormInput
                            value={this.state.telefono}
                            onChangeText={ (telefono) => this.setState({telefono}) }
                            keyboardAppearance='dark'
                            keyboardType='numeric'
                            clearButtonMode='always'
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

                    </View>

                    <TouchIDButton/>

                    <TouchableOpacity style={styles.button} onPress={ (this.onLogin.bind(this)) }>
                        <Text style={styles.buttonText}> Iniciar Sesión </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={
                            () => {
                                Actions.obtener_clave()
                            }
                        }
                    >
                        <Text
                            style={{ 
                                fontSize: 16,
                                color: '#619af4',
                                textDecorationLine: 'underline'
                             }}
                        >¿Ha olvidado su contraseña?</Text>
                    </TouchableOpacity>

                    <View style={styles.loading}>
                        <ActivityIndicator size='large' />
                    </View>

                </View>

            );

        }


    }

    home(){

        Actions.reset('home_routes')

    }

    async onLogin(){

        if (this.state.telefono == '') {

            Alert.alert(
                'Error',
                'Debe ingresar su número de teléfono',
                [
                    {text: 'OK', onPress: () => console.log('Iniciar Sesión')}
                ],
                {
                    cancelable: false
                }
            )

        }else if(this.state.password == ''){

            Alert.alert(
                'Error',
                'Debe ingresar su contraseña',
                [
                    {text: 'OK', onPress: () => console.log('Iniciar Sesión')}
                ],
                {
                    cancelable: false
                }
            )

        }else{

            if (!this.state.isLoginInProcess) {

                this.setState({ isLoginInProcess: true })

                this.setState({ isLoading: 1 })

                AsyncStorage.getItem('@AVE2:DEVICE_HUAWEI')
                .then((valor) => {
                    this.setState({ huawei_device: valor })
                })

                AsyncStorage.getItem('@AVE2:APP_TOKEN')
                .then((valor) => {

                    let token = valor
                    let phone = this.state.telefono
                    let pass = this.state.password
                    let huawei_device = this.state.huawei_device

                    let body = JSON.stringify(
                        {
                            name: 'login',
                            param: {
                                phone: phone,
                                pass: pass,
                                token: token,
                                huawei_device: huawei_device
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

                        this.setState({ isLoading: 0, isLoginInProcess: false })

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

                                console.log('El usuario no es Administrador');

                            }

                            if (responseJson.response.result.TERMINOS) {
                                            
                                AsyncStorage.setItem('@AVE2:USER_ID', (responseJson.response.result.ID_PERSONA).toString())
                                .then((valor) => {

                                    AsyncStorage.setItem('@AVE2:USER_PHONE', this.state.telefono )
                                    .then((valor) => {

                                        AsyncStorage.setItem('@AVE2:USER_PASS', this.state.password )
                                        .then((valor) => {

                                            Actions.reset('home_routes')

                                        })
                                        .catch((error) => {
                                        })         
                                        
                                    })
                                    .catch((error) => {
                                    })       

                                    //Actions.reset('home_routes')
                                })
                                .catch((error) => {
                                })

                            }else{

                                Actions.terminos({ 
                                    id_usuario:  responseJson.response.result.ID_PERSONA,
                                    telefono: this.state.telefono,
                                    password: this.state.password
                                })

                            }

                            // AsyncStorage.setItem('@AVE2:USER_ID', (responseJson.response.result.ID_PERSONA).toString())
                            // .then((valor) => {

                            //     AsyncStorage.setItem('@AVE2:USER_PHONE', this.state.telefono )
                            //     .then((valor) => {

                            //         AsyncStorage.setItem('@AVE2:USER_PASS', this.state.password )
                            //         .then((valor) => {

                            //             console.log(responseJson.response.result)

                            //             // if (responseJson.response.result.TERMINOS) {
                                            
                            //             //     Actions.reset('home_routes')

                            //             // }

                            //             // // Verificar si ya acepto los terminos y condiciones

                            //             // //Actions.reset('home_routes')

                            //         })
                            //         .catch((error) => {
                            //         })         
                                    
                            //     })
                            //     .catch((error) => {
                            //     })       

                            //     //Actions.reset('home_routes')
                            // })
                            // .catch((error) => {
                            // })

                        }

                    })
                    .catch((error) => {

                        this.setState({ isLoading: 0, isLoginInProcess: false })

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

            }


        }

    }

}
const ButtonTouchID  = (props) => { 

    // console.warn(props.touchID)

    if (props.touchID) {
        
        

    }else{

        return(
            <View>
                <Text>No Touch ID</Text>
            </View>
        )

    }

    



}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        alignItems: 'center'

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
        padding: 10

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
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    }

});
