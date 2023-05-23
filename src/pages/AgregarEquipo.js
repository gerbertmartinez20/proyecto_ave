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
    ActivityIndicator,
    Picker,
    ScrollView,
    Platform,
    KeyboardAvoidingView
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select'

import { FormLabel, FormInput, FormValidationMessage, Button, Avatar } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import ImagePicker from 'react-native-image-picker';

const { height } = Dimensions.get('window');

const options = {
    maxWidth: 500,
    maxHeight: 250,
    cancelButtonTitle: 'Cancelar',
    title: 'Cambiar Imagen de Equipo'
}

export default class AgregarEquipo extends React.Component {

    constructor(props){
        super(props);

        this.inputRefs = {};

        this.state = {
            nombre: '',
            descripcion: '',
            telefono: '',
            direccion: '',
            id_persona: '',
            email: '',
            isSaving: false,
            isLoadingData: false,
            teamData: '',
            screenHeight: 0,
            avatar: ''
        };
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
            //   const source = { uri: 'data:image/jpeg;base64,' + response.data };

              this.setState({
                avatar: response.data,
              });
            
            }
          });

    }

    onContentSizeChange = (contentWidth, contentHeight) => {

        this.setState({
            screenHeight: contentHeight
        })

    }

    componentDidMount(){

        // this.loadData()

    }

    render() {

        if (this.state.isLoadingData) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

        }else{

            return (
                <TouchableWithoutFeedback onPress={ Keyboard.dismiss } style={{ flex: 1, alignItems: 'center'}}>
                    <ScrollView
                        style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={this.onContentSizeChange}
                    >
                        <View style={{ flex: 1, alignItems: 'center', paddingBottom: 25}} >
                        <KeyboardAvoidingView behavior="padding" style={styles.container}>
                        
                        <Avatar 
                            size={100}
                            rounded
                            avatarStyle={{ width: '100%', height: '100%' }}
                            source={{ uri:  'data:image/jpeg;base64,' + this.state.avatar }}
                            title="A"
                            imageProps={{ resizeMode: 'cover' }}
                            width={100}
                            showEditButton
                            onEditPress={  (this.changeAvatar.bind(this)) }
                        />

                        <View >

                            <FormLabel>Nombre*</FormLabel>
                            <View style={ styles.inputContainer }>
                                <FormInput
                                    value={this.state.nombre}
                                    onChangeText={ (nombre) => this.setState({nombre}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    multiline
                                />
                            </View>

                            <FormLabel>Descripción (Opcional)</FormLabel>
                            <View style={ styles.inputContainer }>
                                <FormInput
                                    value={this.state.descripcion}
                                    onChangeText={ (descripcion) => this.setState({descripcion}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    multiline
                                />
                            </View>

                            <FormLabel>Teléfono (Opcional) </FormLabel>
                            <View style={ styles.inputContainer }>
                                <FormInput
                                    value={this.state.telefono}
                                    onChangeText={ (telefono) => this.setState({telefono}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                />
                            </View>

                            <FormLabel>Dirección (Opcional)</FormLabel>
                            <View style={ styles.inputContainer }>
                                <FormInput
                                    value={this.state.direccion}
                                    onChangeText={ (direccion) => this.setState({direccion}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    multiline
                                />
                            </View>

                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 20}}>
                            <Button
                                icon={{name: 'save', type: 'font-awesome'}}
                                title='GUARDAR'
                                rounded={true}
                                backgroundColor='#2089dc'
                                loading={ this.state.isSaving }
                                onPress={ (this.onGuardar.bind(this)) }
                                loadingRight={true}
                                disabled={ this.state.isSaving }
                            />
                        </View>

                    </KeyboardAvoidingView>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            );

        }
    }

    onGuardar(){

        if(this.state.nombre == ''){

            Alert.alert(
                'Error',
                'Debe ingresar el nombre del equipo',
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
            .then((user_id) => {

                let body = JSON.stringify(
                    {
                        name: 'addTeam',
                        param: {
                            nombre: this.state.nombre,
                            descripcion: this.state.descripcion,
                            telefono: this.state.telefono,
                            direccion: this.state.direccion,
                            avatar: this.state.avatar,
                            administrador: user_id
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

                    if (responseJson.response.status == 200) {

                        Alert.alert(
                            'AVE',
                            'Registro creado exitosamente.',
                            [
                                {text: 'OK', onPress: () => {

                                    Actions.popTo('equipo', { equipo_agregado: true })

                                }

                                }
                            ],
                            {
                                cancelable: false
                            }
                        )

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

                    }

                    this.setState({ isSaving: false })

                })
                .catch((error) => {

                    Alert.alert(
                        'Error',
                        'Existen problemas para conectarse con el servicio.  Revise su conexión a internet.',
                        [
                            {text: 'OK'}
                        ],
                        {
                            cancelable: false
                        }
                    )

                    this.setState({ isSaving: false })


                });

            })
            .catch((error) => {

                this.setState({ isSaving: false })

            })

        }

    }

    loadData(){

        this.setState({ isLoadingData: true })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((userID) => {

            let body = JSON.stringify(
                {
                    name: 'loadTeam',
                    param: {
                        userID: userID
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
                    isLoadingData: false,
                    teamData: responseJson.response.result
                })

            })
            .catch((error) => {

                this.setState({ isLoadingData: false })

            });

        })
        .catch((error) => {

            this.setState({ isLoadingData: false })

        })

    }
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 18,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        color: '#000000',
    }

});

const styles = StyleSheet.create({

    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        flex: 1,
        paddingTop: 25,
        paddingBottom: 25
    },
    inputBox: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
    },
    inputMultiline: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        alignItems: 'flex-start'
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
        borderLeftColor: '#d2d4d8'
    },
    inputContainerDisabled: {
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
        backgroundColor: 'rgb(228, 228, 228)'
    },
    button: {
        backgroundColor: '#2089dc'
    },
    buttonDesactivar: {
        backgroundColor: 'rgb(212, 55, 55)'
    },
    buttonPress: {
        backgroundColor: 'rgb(85, 185, 16)'
    },

});
