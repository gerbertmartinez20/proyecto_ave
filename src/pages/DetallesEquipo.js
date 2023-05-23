import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Alert,
    Dimensions,
    AsyncStorage,
    ScrollView
} from 'react-native';

import { FormLabel, FormInput, Button, Avatar } from 'react-native-elements'

const { height } = Dimensions.get('window');

import CheckAdmin from '../functions/checkAdmin';

import ImagePicker from 'react-native-image-picker';

import AwesomeAlert from 'react-native-awesome-alerts';
import { Actions } from 'react-native-router-flux';

const options = {
    maxWidth: 500,
    maxHeight: 250,
    cancelButtonTitle: 'Cancelar',
    title: 'Cambiar Imagen de Equipo'
}

export default class DetallesEquipo extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            isEditable: false,
            buttonText: 'Editar',
            isSaving: false,
            isCambiandoEstado: false,
            cambiarEstado: '',
            screenHeight: 0,
            isUserAdmin: true,
            id_organizacion: '',
            nombre: '',
            descripcion: '',
            telefono: '',
            direccion: '',
            avatar: '',
            administrador: '',
            abandonar_equipo: false,
            abandonando: false,
            modalError: false,
            messageError: '',
            equipo_abandonado: false
        };
    }

    onContentSizeChange = (contentWidth, contentHeight) => {

        this.setState({
            screenHeight: contentHeight
        })

    }

    async componentDidMount(){

        this.getData()

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
        
        let check = new CheckAdmin()
        let userAdmin = await check.check(id_usuario)

        this.setState({
            isUserAdmin: userAdmin
        })

    }

    componentWillUnmount(){

        console.log('Componente Desmontado')

    }

    async getData(){

        this.setState({ isLoading: true })

        const id_organizacion = await AsyncStorage.getItem('@AVE2:ORGANIZACION_ID')

        const id_persona = await AsyncStorage.getItem('@AVE2:USER_ID')

        let body = JSON.stringify(
            {
                name: 'infoTeam2',
                param: {
                    organizacionID: id_organizacion,
                    id_persona: id_persona
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

            console.log(responseJson.response.result)

            // this.setState({ isLoading: false, data: responseJson.response.result })
            this.setState({
                isLoading: false,
                id_organizacion: responseJson.response.result.ID_ORGANIZACION,
                nombre: responseJson.response.result.NOMBRE,
                descripcion: responseJson.response.result.DESCRIPCION,
                telefono: responseJson.response.result.TELEFONO,
                direccion: responseJson.response.result.DIRECCION,
                avatar: responseJson.response.result.AVATAR,
                administrador: responseJson.response.result.ADMINISTRADOR
            })

        })
        .catch((error) => {

        })

    }

    onEditar(){

        if (this.state.isEditable == true) {

            let body = JSON.stringify(
                {
                    name: 'editTeam',
                    param: {
                        id_organizacion: this.state.id_organizacion,
                        nombre: this.state.nombre,
                        descripcion: this.state.descripcion,
                        telefono: this.state.telefono,
                        direccion: this.state.direccion,
                        avatar: this.state.avatar
                    }
                }
            )

            this.setState({ isSaving: true })

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

                if (responseJson.response.status == 200) {

                    Alert.alert(
                        'AVE',
                        'Datos actualizados exitosamente',
                        [
                            {text: 'OK'}
                        ],
                        {
                            cancelable: false
                        }
                    )

                    this.setState({ isEditable: false, buttonText: 'Editar', isSaving: false })

                }

            })
            .catch((error) => {

                console.warn(error);

            });


        }else{

            this.setState({
                isEditable: true,
                buttonText: 'Guardar'
            })

        }

    }

    async abandonarEquipo(){

        if (!this.state.abandonando) {
            
            this.setState({
                abandonando: true
            })

            const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
            const id_equipo = await AsyncStorage.getItem('@AVE2:ORGANIZACION_ID')

            let body = JSON.stringify(
                {
                    name: 'abandonarEquipo',
                    param: {
                        id_usuario: id_usuario,
                        id_equipo: id_equipo,
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

                console.log(responseJson.response.status)

                if (responseJson.response.status == '200') {
                    
                    this.setState({
                        equipo_abandonado: true,
                        abandonar_equipo: false,
                        abandonando: false
                    })

                }else{

                    this.setState({
                        modalError: true,
                        messageError: responseJson.response.message,
                        abandonar_equipo: false,
                        abandonando: false
                    })

                }

                // this.setState({
                //     modalError: true,
                //     messageError: responseJson.response.message,
                //     abandonar_equipo: false,
                //     abandonando: false
                // })
            })
            .catch((error) => {

            })

        }

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

    render() {

        return (
            <View style={styles.container}>
            <TouchableWithoutFeedback >
                <ScrollView
                    style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                    showsVerticalScrollIndicator={true}
                    onContentSizeChange={this.onContentSizeChange}
                >
                    <View style={styles.container}>

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

                        <View>

                            <FormLabel>Nombre</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <FormInput
                                    value={this.state.nombre}
                                    onChangeText={ (nombre) => this.setState({nombre}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    editable={this.state.isEditable}
                                    keyboardType='default'
                                />
                            </View>

                            <FormLabel>Descripción</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainerMultiline : styles.inputContainerDisabledMultiline }>
                                <FormInput
                                    value={this.state.descripcion}
                                    onChangeText={ (descripcion) => this.setState({descripcion}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    editable={this.state.isEditable}
                                    keyboardType='default'
                                    multiline
                                />
                            </View>
                            
                            <FormLabel>Teléfono</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <FormInput
                                    value={this.state.telefono}
                                    onChangeText={ (telefono) => this.setState({telefono}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    keyboardType='numeric'
                                    editable={this.state.isEditable}
                                />
                            </View>
                            
                            <FormLabel>Dirección</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                            <FormInput
                                value={this.state.direccion}
                                onChangeText={ (direccion) => this.setState({direccion}) }
                                inputStyle={styles.inputBox}
                                containerStyle={{ borderBottomWidth: 0}}
                                underlineColorAndroid={'transparent'}
                                clearButtonMode='while-editing'
                                keyboardAppearance='dark'
                                keyboardType='default'
                                editable={this.state.isEditable}
                            />
                        </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20}}>
                            <Button
                                icon={{name: this.state.isEditable ? 'check' : 'edit', type: 'font-awesome'}}
                                title={ this.state.buttonText }
                                rounded={true}
                                backgroundColor='#2089dc'
                                buttonStyle={ this.state.isEditable ? styles.buttonPress : styles.button }
                                loadingRight={true}
                                disabled={ !this.state.administrador }
                                onPress={ (this.onEditar.bind(this)) }
                                loading={ this.state.isSaving }
                                loadingRight={true}
                            />

                            <Button
                                icon={{name: this.state.isEditable ? 'check' : 'exit-to-app', type: 'material'}}
                                title={"Abandonar"}
                                rounded={true}
                                backgroundColor='red'
                                // buttonStyle={ this.state.isEditable ? styles.buttonPress : styles.button }
                                loadingRight={true}
                                onPress={() => {
                                    this.setState({
                                        abandonar_equipo: true
                                    })
                                }}
                                loading={ this.state.isSaving }
                                loadingRight={true}
                            />

                        </View>

                        

                    </View>

                    

                </ScrollView>

            </TouchableWithoutFeedback>

                    <AwesomeAlert
                        show={this.state.equipo_abandonado}
                        title="El equipo ha sido abandonado exitosamente"
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showConfirmButton={true}
                        confirmButtonColor="#DD6B55"
                        confirmText="Aceptar"
                        onConfirmPressed={() => {

                            this.setState({
                                equipo_abandonado: false
                            })

                            Actions.popTo("equipo", {equipo_abandonado: true})

                        }}
                    />

                    <AwesomeAlert
                        show={this.state.abandonar_equipo}  
                        showProgress={this.state.abandonando}     
                        title="Abandonar Equipo"
                        message="¿Está seguro? Una vez eliminado no se podrá recuperar."
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText="Cancelar"
                        confirmText={ this.state.eliminando ? 'Abandonando...' : 'Abandonar' }
                        confirmButtonColor={ this.state.eliminando ? '#D0D0D0' : '#DD6B55' }
                        onCancelPressed={() => {

                            this.setState({
                                abandonar_equipo: false
                            })

                        }}
                        onConfirmPressed={() => {

                            this.abandonarEquipo()

                        }}
                    />

                    <AwesomeAlert
                        show={this.state.modalError}
                        showProgress={false}
                        title="Error"
                        message={this.state.messageError}
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        cancelText="Aceptar"
                        cancelButtonColor='#DD6B55'
                        onCancelPressed={() => {
                            this.setState({
                                modalError: false
                            })
                        }}

                    />
                    
            </View>
        );
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)',
        alignItems: 'center',
        paddingTop: 25,
        paddingBottom: 25
    },
    inputBox: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#2089dc',
    },
    inputMultiline: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#2089dc',
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
    inputContainerMultiline: {
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
        // height: 200
    },
    inputContainerDisabledMultiline: {
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
        backgroundColor: 'rgb(228, 228, 228)',
        // height: 200
    },
    button: {
        width: 160,
        backgroundColor: '#2089dc'
    },
    buttonDesactivar: {
        width: 160,
        backgroundColor: 'rgb(212, 55, 55)'
    },
    buttonPress: {
        width: 200,
        backgroundColor: 'rgb(85, 185, 16)'
    }

});
