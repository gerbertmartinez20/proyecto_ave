import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Dimensions,
    AsyncStorage,
    ActivityIndicator,
    ScrollView
} from 'react-native';

import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'

import SectionedMultiSelect  from "react-native-sectioned-multi-select";

const { height } = Dimensions.get('window');

import CheckAdmin from '../functions/checkAdmin';

export default class DetallesMensaje extends React.Component {

    constructor(props){
        super(props);

        this.inputRefs = {};

        this.state = {
            isLoading: false,
            isEditable: false,
            buttonText: 'Editar',
            isSaving: false,
            buttonDesactivarText: 'Desactivar',
            isCambiandoEstado: false,
            cambiarEstado: '',
            screenHeight: 0,
            isUserAdmin: false,
            selectedItems: [],
            loadTeam: false,
            items: [],
            administrador: false
        };
    }

    onContentSizeChange = (contentWidth, contentHeight) => {

        this.setState({
            screenHeight: contentHeight
        })

    }

    UNSAFE_componentWillReceiveProps(props){

        this.getDetails()
    }

    async componentDidMount(){

        this.getDetails()

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
        
        let check = new CheckAdmin()
        let userAdmin = await check.check(id_usuario)

        this.setState({
            isUserAdmin: userAdmin
        })

    }

    onSelectedItemsChange = (selectedItems) => {

        this.setState({ selectedItems });

    }

    render() {

        if (this.state.isLoading) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

        }else{

            let responsables = this.state.teamData || []

            const scrollEnabled = this.state.screenHeight > height;

            return (
                <TouchableWithoutFeedback onPress={ Keyboard.dismiss } style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}} ref="foo" accesible={false}>
                    <ScrollView
                        style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                        showsVerticalScrollIndicator={true}
                        scrollEnabled={scrollEnabled}
                        onContentSizeChange={this.onContentSizeChange}
                    >
                    <View style={styles.container}>
                        <View >
                            <FormLabel>Nombre</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <FormInput
                                    value={this.state.messageName}
                                    onChangeText={ (messageName) => this.setState({messageName}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    editable={this.state.isEditable}
                                />
                            </View>

                            <FormLabel>Mensaje</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainerMultiline : styles.inputContainerDisabledMultiline }>
                                <FormInput
                                    value={this.state.message}
                                    onChangeText={ (message) => this.setState({message}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    multiline
                                    editable={this.state.isEditable}
                                />
                            </View>

                            <FormLabel>Destinos</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <SectionedMultiSelect
                                    styles={{ fontSize: 20 }}
                                    expandDropDowns={true}
                                    items={this.state.items}
                                    uniqueKey='id'
                                    subKey='children'
                                    selectText='Destinos'
                                    selectedText='seleccionados'
                                    searchPlaceholderText='Buscar...'
                                    confirmText='Confirmar'
                                    showCancelButton={true}
                                    onSelectedItemsChange={this.onSelectedItemsChange}
                                    selectedItems={this.state.selectedItems}
                                    showRemoveAll={true}
                                    loading={this.state.loadTeam}
                                    removeAllText="Quitar todos"
                                    colors={{ cancel: 'red' }}
                                    selectChildren={true}
                                    showDropDowns={true}
                                    readOnlyHeadings={false}
                                    highlightChildren={true}
                                    styles={{ 
                                        itemText: {fontSize: 24},
                                        subItemText: {fontSize: 20}
                                    }}
                                    onToggleSelector={ (e) => {

                                        if (e) {

                                            this.setState({
                                                loadTeam: true
                                            })

                                            AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')
                                            .then((valor) => {

                                                let body = JSON.stringify(
                                                    {
                                                        name: 'itemsEquipo2',
                                                        param: {
                                                            protocolID: valor
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

                                                    this.setState({ 
                                                        items: [responseJson.response.result],
                                                        loadTeam: false
                                                    })


                                                })
                                                .catch((error) => {

                                                    this.setState({ loadTeam: false })

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

                                                });

                                            })
                                            .catch((error) => {

                                                this.setState({ loadTeam: 0 })

                                            })
                                        }else{
                                            this.setState({
                                                loadTeam: false
                                            })
                                        }
                                        
                                    }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
                        <Button
                            icon={{name: this.state.isEditable ? 'check' : 'edit', type: 'font-awesome'}}
                            title={ this.state.buttonText }
                            rounded={true}
                            backgroundColor='#2089dc'
                            buttonStyle={ this.state.isEditable ? styles.buttonPress : styles.button }
                            loadingRight={true}
                            disabled={ this.state.isSaving || !this.state.administrador }
                            onPress={ (this.onEditar.bind(this)) }
                            loading={ this.state.isSaving }
                            loadingRight={true}
                        />
                        <Button
                            icon={{name: this.state.messageState == 'A' ? 'times' : 'check', type: 'font-awesome'}}
                            title={ this.state.messageState == 'A' ?  'Desactivar' : 'Activar' }
                            rounded={true}
                            backgroundColor={ this.state.messageState == 'A' ? 'rgb(212, 55, 55)' : 'rgb(85, 185, 16)' }
                            buttonStyle={ this.state.buttonDesactivar }
                            loadingRight={true}
                            disabled={ this.state.isCambiandoEstado || !this.state.administrador }
                            onPress={ (this.onCambiarEstado.bind(this)) }
                            loading={ this.state.isCambiandoEstado }
                            loadingRight={true}
                        />
                        </View>
                    </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            );

        }

    }

    async getDetails(){

        AsyncStorage.getItem('@AVE2:USER_ADMIN')
        .then((valor) => {

            if (valor != null) {

                this.setState({ isUserAdmin: true })

            }

        })
        .catch((error) => {


        })

        this.setState({ isLoading: true })

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')

        AsyncStorage.getItem('@AVE2:MENSAJE_ID')
        .then((messageID) => {

            let body = JSON.stringify(
                {
                    name: 'getDetailsMessage2',
                    param: {
                        messageID: messageID,
                        id_usuario: id_usuario
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

                this.setState({
                    isLoading: false,
                    items: [responseJson.response.result[1]],
                    messageID: responseJson.response.result[0].ID_MENSAJE,
                    messageName: responseJson.response.result[0].NOMBRE,
                    message: responseJson.response.result[0].MENSAJE,
                    messageResponsable: responseJson.response.result[0].ID_PERSONA,
                    messageProtocol: responseJson.response.result[0].ID_PROTOCOLO,
                    messageState: responseJson.response.result[0].ESTADO,
                    selectedItems: responseJson.response.result[0].DESTINOS,
                    administrador: responseJson.response.result[2]
                })

            })
            .catch((error) => {

                console.warn(error);
                this.setState({ isLoading: false })

            });

        })
        .catch((error) => {
            console.warn(error);
            this.setState({ isLoading: false })

        })

    }

    onEditar(){

        if (this.state.isEditable == true) {

            if (this.state.messageName == '') {

                Alert.alert(
                    'Error',
                    'El mensaje debe de tener un nombre',
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

            }else if(this.state.message == ''){

                Alert.alert(
                    'Error',
                    'Debe incluir un mensaje a enviar',
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

            }else if(this.state.selectedItems == ''){

                Alert.alert(
                    'Error',
                    'El mensaje debe de tener un destino',
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

            }else{

                let body = JSON.stringify(
                    {
                        name: 'editMessage',
                        param: {
                            messageID: this.state.messageID,
                            messageName: this.state.messageName,
                            message: this.state.message,
                            personID: this.state.selectedItems
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

            }

        }else{

            this.setState({ isEditable: true, buttonText: 'Guardar' })

        }

    }

    onCambiarEstado(){

        Alert.alert(
            'AVE',
            '¿Seguro que desea cambiar el estado del mensaje?',
            [
                { text: 'Si', onPress: () => {

                    if (this.state.messageState === 'A') {

                        var body = JSON.stringify(
                            {
                                name: 'updateMessageState',
                                param: {
                                    messageID: this.state.messageID,
                                    messageState: "I"
                                }
                            }
                        )

                    }else{

                        var body = JSON.stringify(
                            {
                                name: 'updateMessageState',
                                param: {
                                    messageID: this.state.messageID,
                                    messageState: "A"
                                }
                            }
                        )

                    }

                    this.setState({ isCambiandoEstado: true })

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

                            this.setState({ isCambiandoEstado: false })
                            this.setState({ messageState: responseJson.response.result.messageState })

                            Alert.alert(
                                'AVE',
                                'Estado actualizado exitosamente',
                                [
                                    {text: 'OK'}
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

                    })
                    .catch((error) => {

                        console.warn(error);

                    });

                }},
                { text: 'Cancelar' }
            ]
        )

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
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)',
        paddingBottom: 40

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
