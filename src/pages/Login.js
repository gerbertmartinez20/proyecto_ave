import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Icon, Card } from 'react-native-elements';

import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

// import firebase from 'react-native-firebase';

export default class Login extends React.Component {

    _isMounted =  false;

    constructor(props){
        super(props);

        this.state = {

            isLogged: true,
            isDisabledNotification: false

        }
    }

    componentDidMount(){

        this._isMounted = true


        /* this.checkLogin()

        this.checkPermission(); */

    }

    componentWillUnmount(){

        this._isMounted = false

    }

    async checkPermission() {

        const enabled = await firebase.messaging().hasPermission();

        //Se valida si ya existen permisos de notificaciones
        if (enabled) {

            AsyncStorage.setItem('@AVE2:ENABLED_NOTIFICATIONS', '1')
            .then((valor) => {

                if(this._isMounted){

                    this.setState({
                        isDisabledNotification: false
                    })

                }

            })
            .catch((error) => {
            })

        }else{

            AsyncStorage.setItem('@AVE2:ENABLED_NOTIFICATIONS', '0')
            .then((valor) => {

                if (this._isMounted) {
                    
                    this.setState({
                        isDisabledNotification: true
                    })

                }

            })
            .catch((error) => {
            })

        }

    }

    render() {

        if (this.state.isLogged == false) {

            return (
                <TouchableWithoutFeedback onPress={ Keyboard.dismiss } accesible={false}>
                    <View style={styles.container}>

                        <View style={{ height: '20%', justifyContent: 'center' }}>
                            <Logo/>
                        </View>
                    
                        <View style={{ height: '50%' }}>
                            <LoginForm/>
                        </View>    

                        
                        <View style={{ height: '20%', justifyContent: 'center', alignContent: 'center' }}>

                        <AlertaNotificaciones statusNotifications={this.state.isDisabledNotification} />
                            <Icon 
                                size={ 80 }
                                type='font-awesome'    
                                name='question-circle' 
                                color='rgb(182, 183, 186)' 
                                onPress={ () => {
                                    Actions.modal_video()
                                }}
                            />
                        </View>
                    

                        <View style={{ flex: 1, flexDirection: 'row', height: '10%', justifyContent: 'center', alignContent: 'flex-end' }}>
                            {/* <Icon 
                                size={ 50 }
                                type='font-awesome'    
                                name='question-circle' 
                                color='rgb(182, 183, 186)'  /> */}
                            {/* <Text>¿Aún no esta registrado? </Text>
                            <TouchableOpacity
                                onPress={this.signup}
                            >
                                <Text style={{ fontWeight: 'bold' }}>Crear Cuenta</Text>
                            </TouchableOpacity> */}
                            <View style={styles.signupTextCont}>
                                <Text style={styles.signupText}>¿No tiene una cuenta? </Text>
                                <TouchableOpacity onPress={this.signup}>
                                    <Text style={styles.signupButton}  >Registrarse </Text>
                                </TouchableOpacity>
                            </View>
                        </View>    

                    </View>
                </TouchableWithoutFeedback>
            );

        }else{

            return (

                <View style={ styles.container }>
                    <ActivityIndicator size='large' />
                </View>

            )

        }

    }

    signup(){

        Actions.signup()

    }

    checkLogin(){

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            //Si se cumple el usuario ya inicio sesion 
            if (valor != null) {
                
                //Usuario logeado
                if (this._isMounted) {
                    this.setState({ isLogged: true })
                    Actions.reset('home_routes')
                }

                //Redirigir a home

                //Verifica si la aplicacion estaba cerrada y el usuario dio clic en una notificacion
                AsyncStorage.getItem('@AVE2:NOTIFICATION_APP_CLOSED')
                .then((valor) => {

                    if (valor == 1) {

                        console.log('Notification app closed');

                        Actions.notificaciones()

                        AsyncStorage.removeItem('@AVE2:NOTIFICATION_APP_CLOSED')
                        .then((valor) => {

                        })
                        .catch((error) => {
                            console.log(error);
                        })

                    }else{

                        //console.warn('no app closed');

                    }

                })
                .catch((error) => {

                    console.log('Error: ' + error);

                })

                AsyncStorage.getItem('@AVE2:CHAT_APP_CLOSED')
                .then((valor) => {

                    if (valor == 1) {

                        console.log('Chat app closed');

                        //Actions.chat()

                        AsyncStorage.getItem('@AVE2:DATA_CHAT')
                        .then((valor) => { 

                            let chat = JSON.parse(valor)

                            Actions.chat({ id_usuario_recibe: chat.id_usuario, nombre_usuario_recibe: chat.nombre_usuario.NOMBRE, title: chat.nombre_usuario })

                        })

                        AsyncStorage.removeItem('@AVE2:CHAT_APP_CLOSED')
                        .then((valor) => {

                        })
                        .catch((error) => {
                            console.log(error);
                        })

                    }else{

                        //console.warn('no app closed');

                    }

                })
                .catch((error) => {

                    console.log('Error: ' + error);

                })

            }else{

                this.setState({ isLogged: false })

                AsyncStorage.removeItem('@AVE2:NOTIFICATION_APP_CLOSED')
                .then((valor) => {

                
                })
                .catch((error) => {
                    // console.warn(error);
                })

                AsyncStorage.removeItem('@AVE2:CHAT_APP_CLOSED')
                .then((valor) => {

                
                })
                .catch((error) => {
                    // console.warn(error);
                })

            
            }

        })
        .catch((error) => {
            // console.warn(error);
        })

    }

}

const AlertaNotificaciones = (props) => {

    if (props.statusNotifications) {
        
        return (
            <View>
                {/* <Card
                    containerStyle={{   width: 300, 
                                        borderRadius: 25,
                                        backgroundColor: 'red'
                                    }}
                >
                    <Icon 
                        name='exclamation-triangle'
                        color='white'
                        type='font-awesome'
                    />
                    <Text 
                        style={{ color: 'white' }}
                        textAlign='justify'            
                    >
                        Debe activar las notificaciones en la configuración para poder recibir alertas
                    </Text>
                </Card> */}
            </View>
        )

    }else{

        return (
            <View>

            </View>
        )

    }

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(255, 255, 255)'
    },
    signupTextCont: {
        flex: 0.5,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    signupText: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    help_button: {

    },
    signupTextCont: {
        flex: 0.5,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row',
    },
    signupText: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        fontSize: 20
    },
    signupButton: {
        color: '#000000',
        fontSize: 24,
        fontWeight: '500',
    }
});
