import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Alert} from 'react-native';

import firebase from 'react-native-firebase';
import Routes from './src/Routes';

import type { Notification, RemoteMessage, NotificationOpen } from 'react-native-firebase';

import { Actions } from 'react-native-router-flux';

import AwesomeAlert from 'react-native-awesome-alerts';

import{ HmsPushInstanceId, HmsPushMessaging, HmsPushEvent, RNRemoteMessage, HmsLocalNotification }from "@hmscore/react-native-hms-push";

type Props = {};
export default class App extends Component<Props> {

    constructor(props){
        super(props);

        this.state = {
            isToken: false,
            isRequestToken: false,
            isErrorToken: false,
            isRetrying: false,
            closeAppNotification: false,
            enabledNotifications: ''
        };

    }

    componentWillUnmount(){

        
    }

    
    componentDidMount() {
        
        firebase.utils().errorOnMissingPlayServices = false;
        firebase.utils().promptOnMissingPlayServices = false;

        const utils = firebase.utils();

        const {
            isAvailable,
            
        } = utils.playServicesAvailability;

        //Código para obtener token de Huawei
        if (!isAvailable){

            this.enableHuaweiPush()
            this.enableDataMessageHuawei()
            this.enabledBackgroundDataMessageHuawei()
            this.createChannel()

            //Ya existe un token
            AsyncStorage.getItem('@AVE2:APP_TOKEN')
            .then((valor) => {

                if (valor != null) {

                    AsyncStorage.setItem('@AVE2:DEVICE_HUAWEI', 'S')
                    this.setState({ isToken: true })

                }else{


                    //Solicitar el token a Huawei

                    HmsPushInstanceId.getToken("")
                    .then((result) => {
                        
                        if(result){
                            
                            console.warn(result.result)

                            AsyncStorage.setItem('@AVE2:DEVICE_HUAWEI', 'S')

                            AsyncStorage.setItem('@AVE2:APP_TOKEN', result.result)
                            .then((valor) => {

                                // console.warn('Token de Firebase guardado en AsyncStorage');

                                this.setState({ isToken: true })

                                

                            })
                            .catch((error) => {

                                // console.warn(error);

                            })

                        }else{

                            this.setState({ isRequestToken: false, isErrorToken: true })

                        }

                    })
                    .catch((err) => {
                        
                    });

                }

            }).catch((error) => {

            });

        }



        this.removeNotificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required

            console.log('Notificacion mostrada')
        });

        // this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
        //     // Process your message as required
        //     console.log('Message received')
        // });
        
        // this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {

        //     console.log('Notificacion mostrada')
        //     // Process your notification as required
        //     // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.

        // });

        // this.notificacionListener = firebase.notifications().onNotification(( notification: Notification ) => {

        //     console.log('Received')
        //     console.log(notification)

        // })

        // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {

        //     console.log('Open')

        //     // Get the action triggered by the notification being opened
        //     const action = notificationOpen.action;
        //     // Get information about the notification that was opened
        //     const notification: Notification = notificationOpen.notification;

        // });

        const channel = new firebase.notifications.Android.Channel(
            'NotificationsAVE',
            'Canal de Notificaciones AVE',
            firebase.notifications.Android.Importance.High
        ).setDescription('Canal de Notificaciones AVE Municipalidad de Guatemala')
        .setSound('alerta.wav');

        firebase.notifications().android.createChannel(channel)

        this.checkPermission();
        this.createNotificationListeners();
    }

    //Function encargada de verificar los permisos, es la primera que se ejecuta al iniciar el app
    async checkPermission() {

        const enabled = await firebase.messaging().hasPermission();

        //Se valida si ya existen permisos de notificaciones
        if (enabled) {

            //Si existen se solicita el token
            this.getToken();

        } else {

            //Si no existen se solicita permiso
            this.requestPermission();

        }

    }

    //Funcion para obtener token para envio de notificaciones
    async getToken() {

        //Se verifica que el token no exista
        AsyncStorage.getItem('@AVE2:APP_TOKEN')
        .then((valor) => {

            if (valor != null) {

                //console.warn('Existe un token en AsyncStorage: ' + valor);

                this.setState({ isToken: true })

            }else{

                // console.warn('No existe un token en AsyncStorage');

                //Solicitar el token a Firebase

                firebase.messaging().getToken()
                .then(fcmToken2 => {

                    if (fcmToken2 != null) {

                        // console.warn('Token de firebase: ' + fcmToken2);

                        AsyncStorage.setItem('@AVE2:APP_TOKEN', fcmToken2)
                        .then((valor) => {

                            // console.warn('Token de Firebase guardado en AsyncStorage');

                            this.setState({ isToken: true })

                        })
                        .catch((error) => {

                            // console.warn(error);

                        })

                    }else{

                        this.setState({ isRequestToken: false, isErrorToken: true })

                        // console.warn('No se obtuvo un token de Firebase');

                    }

                })
                .catch(error => {
                    // console.warn('Error firebase: ' + error);
                })

            }

        }).catch((error) => {

        });

    }

    //Funcion encargada de solicitar permiso de notificaciones al usuario
    async requestPermission() {

        try {

            //Se solicita el permiso
            await firebase.messaging().requestPermission();

            AsyncStorage.setItem('@AVE2:ENABLED_NOTIFICATIONS', '1')
            .then((valor) => {
            })
            .catch((error) => {
            })

            //Si el usuario da permiso, se solicita el token
            this.getToken();

            // console.warn('permiso concedido')

        } catch (error) {

            // Si el usuario no da permiso se muestra en consola
            // console.warn('permission rejected');

            AsyncStorage.setItem('@AVE2:ENABLED_NOTIFICATIONS', '0')
            .then((valor) => {
            })
            .catch((error) => {
            })

            //Mostrar de alerta sobre las consecuencias de no activar las notificaciones

            this.getToken();

        }

    }

    async receptionDate(notification){

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID');

        const fecha_envio = notification._data["fecha_envio"]

        let body = JSON.stringify(
            {
                name: 'receptionDate',
                param: {
                    id_persona: id_usuario,
                    fecha_envio: fecha_envio
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

            console.log(responseJson);

        })
        .catch((error) => {

            console.log(error)

        });

    }
    
    async createNotificationListeners() {

        /*
        * Se ejecuta cuando se recibe una notificacion y la aplicacion esta en primer plano
        * */
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {

            // console.log('Aplicacion en primer plano')
            // console.log(notification)

            // Marca el log como recibido
            this.receptionDate(notification)

            //Funciona en Android hasta version 7.0 cuando la aplicacion esta en primer plano

            if (notification._data["tipo"] == "alerta") {
                
                if (Platform.OS === 'android') {

                    const channel = new firebase.notifications.Android.Channel(
                            'NotificationsAVE',
                            'Canal de Notificaciones AVE',
                            firebase.notifications.Android.Importance.High
                    ).setDescription('Canal de Notificaciones AVE Municipalidad de Guatemala')
                    .setSound('alerta.wav');

                    firebase.notifications().android.createChannel(channel)

                    var notification = new firebase.notifications.Notification()
                        .setNotificationId(notification._notificationId)
                        .setTitle(notification._title)
                        .setBody(notification._body)
                        .setSound(channel.sound)
                        .setData({
                            key1: 'value1',
                            key2: 'value2',
                    });

                    notification
                        .android.setChannelId(channel.channelId)
                        .android.setSmallIcon('ic_notification')
                        .android.setColor('#E91E63')

                }else if(Platform.OS === 'ios') {

                    var notification = new firebase.notifications.Notification()
                        .setNotificationId(notification._notificationId)
                        .setTitle(notification._title)
                        .setBody(notification._body)
                        .setSound('alerta.wav')
                        .setData({
                        key1: 'value1',
                        key2: 'value2',
                        });

                        notification.ios.setBadge(0)

                }

                firebase.notifications().displayNotification(notification)

            }else if(notification._data["tipo"] == "chat" && Actions.currentScene != 'chat'){

                if (Platform.OS === 'android') {

                    const channel = new firebase.notifications.Android.Channel(
                            'NotificationsAVE2',
                            'Canal de Notificaciones AVE2',
                            firebase.notifications.Android.Importance.High
                    ).setDescription('Canal de Notificaciones AVE Municipalidad de Guatemala')
                    .setSound('default');

                    firebase.notifications().android.createChannel(channel)

                    var notification = new firebase.notifications.Notification()
                        .setNotificationId(notification._notificationId)
                        .setTitle(notification._title)
                        .setBody(notification._body)
                        .setSound(channel.sound)
                        .setData({
                            tipo: 'chat',
                            id_usuario: notification._data["id_usuario"],
                            nombre_usuario: notification._data["nombre_usuario"]
                        });

                    notification
                        .android.setChannelId(channel.channelId)
                        .android.setSmallIcon('ic_notification')
                        .android.setColor('#E91E63')

                }else if(Platform.OS === 'ios') {

                    var notification = new firebase.notifications.Notification()
                        .setNotificationId(notification._notificationId)
                        .setTitle(notification._title)
                        .setBody(notification._body)
                        .setSound('default')
                        .setData({
                            tipo: 'chat',
                            id_usuario: notification._data["id_usuario"],
                            nombre_usuario: notification._data["nombre_usuario"]
                        });

                        notification.ios.setBadge(0)

                }

                firebase.notifications().displayNotification(notification)

            }
            
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */


        /*
        * Se ejecuta cuando se da clic sobre la notificacion
        * */

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            const { title, body, notificationId } = notificationOpen.notification;

            //Solo redirigir si esta logueado
            
            let user = notificationOpen.notification._data

            this.receptionDate(notificationOpen.notification)

            console.warn('Se dio clic sobre la notificacion')

            if (user.tipo == 'chat') {
                
                console.log(Actions.currentScene)

                if (Actions.currentScene != 'chat') {
                    
                    Actions.chat({ id_usuario_recibe: user.id_usuario, nombre_usuario_recibe: user.nombre_usuario.NOMBRE, title: user.nombre_usuario })

                }

            }else{

                AsyncStorage.getItem('@AVE2:USER_ID')
                .then((valor) => {

                    if (valor != null) {

                        Actions.tabs_notificaciones()

                    }

                })
                .catch((error) => {

                })

            }

            firebase.notifications().removeDeliveredNotification(notificationId)

        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();

        //Si la aplicacion esta cerrada y se presiona lo notificacion, se redirige a
        if (notificationOpen) {

            let user = notificationOpen.notification._data

            this.receptionDate(notificationOpen.notification)

            //Actions.chat({ id_usuario_recibe: user.id_usuario, nombre_usuario_recibe: user.nombre_usuario.NOMBRE, title: user.nombre_usuario })

            if (user.tipo == 'chat') {
                
                //Actions.chat({ id_usuario_recibe: user.id_usuario, nombre_usuario_recibe: user.nombre_usuario.NOMBRE, title: user.nombre_usuario })

                AsyncStorage.setItem('@AVE2:CHAT_APP_CLOSED', '1')
                .then((valor) => {


                })
                .catch((error) => {
                })

                AsyncStorage.setItem('@AVE2:DATA_CHAT', JSON.stringify(user))
                .then((valor) => {
                })
                .catch((error) => {
                })

                AsyncStorage.getItem('@AVE2:USER_ID')
                .then((valor) => {

                    if (valor != null) {

                        AsyncStorage.setItem('@AVE2:CHAT_APP_CLOSED', '1')
                        .then((valor) => {

                        })
                        .catch((error) => {
                        })

                        AsyncStorage.setItem('@AVE2:DATA_CHAT', JSON.stringify(user))
                        .then((valor) => {
                        })
                        .catch((error) => {
                        })

                    }

                })
                .catch((error) => {

                })

            }else{

                AsyncStorage.setItem('@AVE2:NOTIFICATION_APP_CLOSED', '1')
                .then((valor) => {


                })
                .catch((error) => {
                })

                AsyncStorage.getItem('@AVE2:USER_ID')
                .then((valor) => {

                    if (valor != null) {

                        AsyncStorage.setItem('@AVE2:NOTIFICATION_APP_CLOSED', '1')
                        .then((valor) => {

                        })
                        .catch((error) => {
                        })

                    }

                })
                .catch((error) => {

                })

            }

            firebase.notifications().removeDeliveredNotification(notificationId)
        }

        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {

            // console.warn('Se a enviado un mensaje en segundo plano');

            //process data message

              if (Platform.OS === 'android') {

                //   const channel = new firebase.notifications.Android.Channel(
                //         'NotificationsAVE',
                //         'Canal de Notificaciones AVE',
                //         firebase.notifications.Android.Importance.High
                //   ).setDescription('Canal de Notificaciones AVE Municipalidad de Guatemala')
                //   .setSound('alerta.wav');

                //   var notification = new firebase.notifications.Notification()
                //   .setNotificationId('notificationId')
                //   .setTitle(notification.title)
                //   .setBody(notification.body)
                //   .setSound(channel.sound)
                //   .setData({
                //     key1: 'value1',
                //     key2: 'value2',
                //   });

                //   notification
                //       .android.setChannelId(channel.channelId)


              }else if(Platform.OS === 'ios') {

                //   var notification = new firebase.notifications.Notification()
                //     .setNotificationId('notificationId')
                //     .setTitle('Mensaje')
                //     .setBody('Cuerpo del Mensaje')
                //     .setSound('alerta.wav')
                //     .setData({
                //       key1: 'value1',
                //       key2: 'value2',
                //     });

              }

            //firebase.notifications().displayNotification(notification)


        });
    }

    enableHuaweiPush(){

        HmsPushMessaging.turnOnPush()
        .then((result) => {
    
            console.log(result)

        })
        .catch((err) => {
            // alert("[turnOnPush] Error/Exception: " + JSON.stringify(err));
        });

    }

    enableDataMessageHuawei(){

        this.listener = HmsPushEvent.onRemoteMessageReceived(event => {
            const RNRemoteMessageObj = new RNRemoteMessage(event.msg);
            const msg = RNRemoteMessageObj.parseMsgAllAttribute(event.msg);
            console.log("Data message received : "+ msg);
        })

    }

    enabledBackgroundDataMessageHuawei(){

        HmsPushMessaging.setBackgroundMessageHandler((dataMessage) => {
            HmsLocalNotification.localNotification({
              [HmsLocalNotification.Attr.title]: "[Headless] DataMessage Received",
              [HmsLocalNotification.Attr.message]: new RNRemoteMessage(
                dataMessage
              ).getDataOfMap(),
            })
              .then((result) => {
                console.log("[Headless] DataMessage Received", result);
              })
              .catch((err) => {
                console.log(
                  "[LocalNotification Default] Error/Exception: " + JSON.stringify(err)
                );
              });
           
            return Promise.resolve();
          });

    }

    createChannel(){

        //HmsLocalNotification.createChannel(null)

    }

    render() {

        if (this.state.isToken) {
            
            return (
                <Routes/>
            );

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
        justifyContent: 'center',
        backgroundColor: '#236687'

    },
    font: {

        fontSize: 18,
        color: '#ffffff',

    },
});
