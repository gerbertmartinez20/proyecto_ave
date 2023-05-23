import React from 'react'

import {
	AsyncStorage,
	Platform,
	AppState
} from 'react-native';

import TimerMixin from 'react-timer-mixin'

import firebase from 'react-native-firebase';

import type { Notification, RemoteMessage, NotificationOpen } from 'react-native-firebase';

import { GiftedChat } from 'react-native-gifted-chat'

export default class Chat extends React.Component {

	constructor(props){

		console.log(props)

        super(props);

        this.state = {
			messages: [],
			id_usuario_recibe: props.id_usuario_recibe,
			nombre_usuario_recibe: props.nombre_usuario_recibe,
			id_usuario_envia: null,
			isLoadMessage: false,
			appState: AppState.currentState
		};
		
		AsyncStorage.getItem('@AVE2:USER_ID')
		.then((valor) => {
			this.setState({
				id_usuario_envia: valor
			})
		})

	}
	

	componentWillUnmount(){

		AppState.removeEventListener('change', this._handleAppStateChange);

	}

	async createNotificationListeners() {

        /*
        * Se ejecuta cuando se recibe una notificacion y la aplicacion esta en primer plano
        * */
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {

            console.log('Notificacion en el chat')
			console.log(notification)

			this.setState(previousState => ({
				messages: GiftedChat.append(previousState.messages, notification._data),
			}))

            //Funciona en Android hasta version 7.0 cuando la aplicacion esta en primer plano

            // if (Platform.OS === 'android') {

            //     const channel = new firebase.notifications.Android.Channel(
            //             'NotificationsAVE',
            //             'Canal de Notificaciones AVE',
            //             firebase.notifications.Android.Importance.High
            //     ).setDescription('Canal de Notificaciones AVE Municipalidad de Guatemala')
            //     .setSound('alerta.wav');

            //     firebase.notifications().android.createChannel(channel)

            //     var notification = new firebase.notifications.Notification()
            //         .setNotificationId(notification._notificationId)
            //         .setTitle(notification.title)
            //         .setBody(notification.body)
            //         .setSound(channel.sound)
            //         .setData({
            //             key1: 'value1',
            //             key2: 'value2',
            //     });

            //     notification
            //         .android.setChannelId(channel.channelId)
            //         .android.setLargeIcon('notification_icon')

            //   }else if(Platform.OS === 'ios') {

            //       var notification = new firebase.notifications.Notification()
            //         .setNotificationId(notification._notificationId)
            //         .setTitle(notification.title)
            //         .setBody(notification.body)
            //         .setSound('alerta.wav')
            //         .setData({
            //           key1: 'value1',
            //           key2: 'value2',
            //         });

            //         notification.ios.setBadge(0)

            //   }

            // firebase.notifications().displayNotification(notification)

        });

        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {

			console.log('Se ha recibido un mensaje en el chat');
			console.log(message)

			this.setState(previousState => ({
				messages: GiftedChat.append(previousState.messages, message._data),
			}))

            // //process data message

            //   if (Platform.OS === 'android') {

            //       const channel = new firebase.notifications.Android.Channel(
            //             'NotificationsAVE',
            //             'Canal de Notificaciones AVE',
            //             firebase.notifications.Android.Importance.High
            //       ).setDescription('Canal de Notificaciones AVE Municipalidad de Guatemala')
            //       .setSound('alerta.wav');

            //       var notification = new firebase.notifications.Notification()
            //       .setNotificationId('notificationId')
            //       .setTitle(notification.title)
            //       .setBody(notification.body)
            //       .setSound(channel.sound)
            //       .setData({
            //         key1: 'value1',
            //         key2: 'value2',
            //       });

            //       notification
            //           .android.setChannelId(channel.channelId)


            //   }else if(Platform.OS === 'ios') {

            //       var notification = new firebase.notifications.Notification()
            //         .setNotificationId('notificationId')
            //         .setTitle('Mensaje')
            //         .setBody('Cuerpo del Mensaje')
            //         .setSound('alerta.wav')
            //         .setData({
            //           key1: 'value1',
            //           key2: 'value2',
            //         });

            //   }

            // firebase.notifications().displayNotification(notification)


        });
    }

	_handleAppStateChange = (nextAppState) => {
		if (
		  this.state.appState.match(/inactive|background/) &&
		  nextAppState === 'active'
		) {
		  
			this.obtener_mensajes()

		}
		this.setState({appState: nextAppState});
	  };
	

	componentDidMount() {

		AppState.addEventListener('change', this._handleAppStateChange);

		this.obtener_mensajes()

		this.createNotificationListeners()

		// this.setState({
		// 	messages: [
		// 	{
		// 		_id: 1,
		// 		text: 'Hello developer',
		// 		createdAt: new Date(),
		// 		user: {
		// 			_id: 2,
		// 			name: this.state.nombre_usuario_recibe,
		// 			avatar: 'https://placeimg.com/140/140/any',
		// 		},
		// 	},
		// 	{
		// 		_id: 2,
		// 		text: 'Hello developer',
		// 		createdAt: new Date(),
		// 		user: {
		// 			_id: 2,
		// 			name: 'React Native',
		// 			avatar: 'https://placeimg.com/140/140/any',
		// 		},
		// 	},
		// 	{
		// 		_id: 3,
		// 		text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
		// 		createdAt: new Date(),
		// 		user: {
		// 			_id: 2,
		// 			name: 'React Native',
		// 			avatar: 'https://placeimg.com/140/140/any',
		// 		},
		// 	},
		// 	{
		// 		_id: 4,
		// 		text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
		// 		createdAt: new Date(),
		// 		user: {
		// 			_id: 1,
		// 			name: 'React Native',
		// 			avatar: 'https://placeimg.com/140/140/any',
		// 		},
		// 	},
		// 	{
		// 		_id: 5,
		// 		text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
		// 		createdAt: new Date(),
		// 		user: {
		// 			_id: 2,
		// 			name: 'React Native',
		// 			avatar: 'https://placeimg.com/140/140/any',
		// 		},
		// 	},
		// 	],
		// })
	}

	onSend(messages = []) {

		let body = JSON.stringify(
			{
				usuario_recibe: this.state.id_usuario_recibe,
				mensaje: messages
			}
		)

		fetch('https://udicat.muniguate.com/ave2_api/public/enviar_mensaje', {
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

			this.setState(previousState => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}))

		})
		.catch((error) => {

			console.log(error);

		});

	}

	obtener_mensajes(){

		this.setState({
			isLoadMessage: true
		})

		AsyncStorage.getItem('@AVE2:USER_ID')
		.then((valor) => {
			
			let body = JSON.stringify(
				{
					usuario_recibe: this.state.id_usuario_recibe,
					usuario_envia: valor
				}
			)

			console.log(body)

			fetch('https://udicat.muniguate.com/ave2_api/public/obtener_chat', {
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
					messages: responseJson,
					isLoadMessage: false
				})

				console.log(responseJson)

			})
			.catch((error) => {

				console.log(error);

			});
	
		})

	}

	render() {
		return (
			<GiftedChat
				messages={this.state.messages}
				onSend={messages => this.onSend(messages)}
				user={{
					_id: this.state.id_usuario_envia,
				}}
				renderAvatar={null}
				placeholder="Escribe un mensaje..."
			/>
		)
	}
}
