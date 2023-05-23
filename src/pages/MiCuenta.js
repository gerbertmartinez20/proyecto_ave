import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    AsyncStorage,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Alert
} from 'react-native';

import { FormLabel, FormInput, Button } from 'react-native-elements'

import ImagePicker from 'react-native-image-picker';

import { Avatar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

const options = {
    maxWidth: 500,
    maxHeight: 250,
    cancelButtonTitle: 'Cancelar',
    title: 'Cambiar Imagen de Perfil'
}

export default class MiCuenta extends React.Component {

    constructor(props){
        super(props);

        this.state = {

            isDataLoad: false,
            userID: '',
            userName: '',
            userPhone: '',
            userMail: '',
            isEditable: true,
            buttonText: 'Guardar',
            isSaving: false,
            avatarSource: ''

        }
    }

    componentDidMount(){

        this.loadData()

    }

    changeAvatar(){

        ImagePicker.showImagePicker(options, (response) => {
                console.log('Response = ', response);
          
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
              //const source = { uri: response.uri };
          
              // You can also display the image using data:
                const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: response.data,
                });
            
            }
        });
    }

    render() {

        if (this.state.isDataLoad) {

            return (
                <View style={styles.container}>

                <TouchableWithoutFeedback onPress={ Keyboard.dismiss } ref="foo" accesible={false}>
                    <View style={styles.container}>

                        <Avatar 
                            size={100}
                            rounded
                            avatarStyle={{ width: '100%', height: '100%' }}
                            source={{ uri:  'data:image/jpeg;base64,' + this.state.avatarSource }}
                            title="Titulo"
                            imageProps={{ resizeMode: 'cover' }}
                            width={100}
                            showEditButton
                            onEditPress={  (this.changeAvatar.bind(this)) }
                        />

                        <View >

                            <FormLabel>Nombre</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <FormInput
                                    value={this.state.userName}
                                    onChangeText={ (userName) => this.setState({userName}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    keyboardAppearance='dark'
                                    keyboardType='default'
                                    clearButtonMode='while-editing'
                                    editable={this.state.isEditable}
                                />
                            </View>

                            <FormLabel>Teléfono</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <FormInput
                                    value={this.state.userPhone}
                                    onChangeText={ (userPhone) => this.setState({userPhone}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center'}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    keyboardType='numeric'
                                    editable={this.state.isEditable}
                                />
                            </View>
                            <FormLabel>Email</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <FormInput
                                    value={this.state.userMail}
                                    onChangeText={ (userMail) => this.setState({userMail}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    keyboardType='email-address'
                                    editable={this.state.isEditable}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20}}>
                            <Button
                                icon={{name: this.state.isEditable ? 'save' : 'edit', type: 'font-awesome'}}
                                title={ this.state.buttonText }
                                rounded={true}
                                backgroundColor='#00BF6F'
                                loading={ this.state.isSaving }
                                buttonStyle={{ backgroundColor: 'rgb(0, 191, 111)' }}
                                loadingRight={true}
                                disabled={ this.state.isSaving }
                                onPress={ (this.onEditar.bind(this)) }
                            />
                            <Button
                                icon={{name: 'key', type: 'font-awesome'}}
                                title={ 'Cambiar Contraseña' }
                                rounded={true}
                                buttonStyle={{ backgroundColor: 'red' }}
                                onPress={ () => {
                                    Actions.cambiar_password()
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>

                </View>
            );

        }else{

            return (

                <View style={ styles.containerActivityIndicator }>
                    <ActivityIndicator size='large' />
                </View>

            )

        }


    }

    loadData(){

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            if (valor != null) {

                let body = JSON.stringify(
                    {
                        name: 'userInfo',
                        param: {
                            userID: valor
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

                    this.setState({ userName: responseJson.response.result.NOMBRE })
                    this.setState({ userPhone: responseJson.response.result.TELEFONO })
                    this.setState({ userMail: responseJson.response.result.EMAIL })
                    this.setState({ avatarSource: responseJson.response.result.AVATAR })
                    this.setState({ isDataLoad: true })

                })
                .catch((error) => {

                });

            }else{

            }

        })
        .catch((error) => {
            console.warn(error);
        })

    }

    onEditar(){

        if (this.state.isEditable == true) {

            {/* Enviar nuevos datos */}

            if (this.state.userName == '') {

                Alert.alert(
                    'Error',
                    'Debe ingresar el nombre',
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

            }else if(this.state.userPhone == ''){

                Alert.alert(
                    'Error',
                    'Debe ingresar un número de teléfono',
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

            }else if(this.state.userMail == ''){

                Alert.alert(
                    'Error',
                    'Debe ingresar un correo electrónico',
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

            }else{

                this.setState({ isSaving: true })

                AsyncStorage.getItem('@AVE2:USER_ID')
                .then((valor) => {

                    let body = JSON.stringify(
                        {
                            name: 'editUserInfo',
                            param: {
                                userID: valor,
                                userName: this.state.userName,
                                userPhone: this.state.userPhone,
                                userMail: this.state.userMail,
                                avatar: this.state.avatarSource
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

                        console.warn(responseJson.response)

                        if (responseJson.response.status == 200) {

                            Alert.alert(
                                'AVE',
                                'Datos actualizados exitosamente.',
                                [
                                    {text: 'OK'}
                                ],
                                {
                                    cancelable: false
                                }
                            )

                            this.setState({  isSaving: false })

                        }else{

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

                            this.setState({ isSaving: false })

                        }

                    })
                    .catch((error) => {

                        console.warn(error);

                    });

                })
                .catch((error) => {
                    console.warn(error);
                })

            }

        }else{

            this.setState({ isEditable: true, buttonText: 'Guardar' })

        }

    }

}
  

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)',
        paddingTop: 5

    },
    containerActivityIndicator: {

        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(255, 255, 255)'

    },
    inputBox: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#2089dc',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    inputContainer: {
        width: (Dimensions.get('window').width) - 50,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        borderRightColor: '#d2d4d8',
        borderBottomColor: '#d2d4d8',
        borderLeftColor: '#d2d4d8',
        justifyContent: 'center',
        alignItems: 'center'

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
        backgroundColor: 'rgb(228, 228, 228)',
        justifyContent: 'center',
        alignItems: 'center'

    },
    button: {
        width: 200,
        backgroundColor: 'rgb(0,191,111)'
    },
    buttonPress: {
        width: 200,
        backgroundColor: 'rgb(85, 185, 16)'
    }

});
