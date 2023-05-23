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

import { FormLabel, FormInput, Button } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import SectionedMultiSelect  from "react-native-sectioned-multi-select";

const { height } = Dimensions.get('window');

import CheckAdmin from '../functions/checkAdmin';

export default class AgregarProtocolo extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            protocolName: '',
            protocolDescription: '',
            protocolID: '',
            protocolEstado: '',
            isEditable: false,
            buttonText: 'Editar',
            isSaving: false,
            buttonDesactivarText: 'Desactivar',
            isCambiandoEstado: false,
            cambiarEstado: '',
            screenHeight: 0,
            isUserAdmin: false,
            items: [],
            selectedItems: [],
            isEliminando: false
        };
    }

    onContentSizeChange = (contentWidth, contentHeight) => {

        this.setState({
            screenHeight: contentHeight
        })

    }

    onSelectedItemsChange = (selectedItems) => {

        this.setState({ selectedItems });

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

    render(){

        if (this.state.isLoading) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

        }else{

            const scrollEnabled = this.state.screenHeight > height;

            return(

                <TouchableWithoutFeedback onPress={ Keyboard.dismiss } ref="foo" accesible={false}>
                    <ScrollView
                        style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={this.onContentSizeChange}
                    >
                    <View style={styles.container}>
                        <View >

                            <FormLabel>Nombre</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <FormInput
                                    value={this.state.protocolName}
                                    onChangeText={ (protocolName) => this.setState({protocolName}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    editable={this.state.isEditable}
                                />
                            </View>

                            <FormLabel>Descripción</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainerMultiline : styles.inputContainerDisabledMultiline }>
                                <FormInput
                                    value={this.state.protocolDescription}
                                    onChangeText={ (protocolDescription) => this.setState({protocolDescription}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    editable={this.state.isEditable}
                                    multiline
                                />
                            </View>

                            <FormLabel>Equipo</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>
                                <SectionedMultiSelect
                                    single={true}
                                    expandDropDowns={true}
                                    items={this.state.items}
                                    uniqueKey='id'
                                    subKey='children'
                                    selectText='Seleccione un equipo'
                                    selectedText='seleccionados'
                                    searchPlaceholderText='Buscar...'
                                    confirmText='Confirmar'
                                    showCancelButton={true}
                                    onSelectedItemsChange={this.onSelectedItemsChange}
                                    selectedItems={this.state.selectedItems}
                                    showRemoveAll={true}
                                    loading={this.state.isLoadingTeam}
                                    removeAllText="Quitar todos"
                                    colors={{ cancel: 'red' }}
                                    selectChildren={true}
                                    showDropDowns={true}
                                    readOnlyHeadings={false}
                                    highlightChildren={true}
                                    styles={{ 
                                        itemText: {fontSize: 20},
                                        subItemText: {fontSize: 18},
                                        selectedItem: {fontSize: 18},
                                        item: {fontSize: 18}
                                    }}
                                    onToggleSelector={ async (e) => {

                                        if (e) {
                                            
                                            try {
                                                
                                                this.setState({
                                                    isLoadingTeam: true
                                                })

                                                const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID');
                                    
                                                if (id_usuario != null) {
                                                    
                                                    let body = JSON.stringify(
                                                        {
                                                            name: 'getTeamsSimple',
                                                            param: {
                                                                userID: id_usuario
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
                                                            items: [responseJson.response.result],
                                                            isLoadingTeam: false
                                                        })
                                        
                                                    })
                                                    .catch((error) => {
                                                        
                                                        this.setState({
                                                            isLoadingTeam: false
                                                        })
                                                        
                                                    });
                                    
                                                }
                                    
                                            } catch (error) {
                                            
                                                console.log(error)
                                    
                                            }

                                        }
                                        
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20}}>
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
                            {/* <Button
                                icon={{name: this.state.protocolEstado == 'A' ? 'times' : 'check', type: 'font-awesome'}}
                                title={ this.state.protocolEstado == 'A' ?  'Desactivar' : 'Activar' }
                                rounded={true}
                                backgroundColor={ this.state.protocolEstado == 'A' ? 'rgb(212, 55, 55)' : 'rgb(85, 185, 16)' }
                                buttonStyle={ this.state.buttonDesactivar }
                                loadingRight={true}
                                disabled={ this.state.isCambiandoEstado || !this.state.isUserAdmin }
                                onPress={ (this.onCambiarEstado.bind(this)) }
                                loading={ this.state.isCambiandoEstado }
                                loadingRight={true}
                            /> */}
                            <Button
                                icon={{name: 'trash-o', type: 'font-awesome'}}
                                title="Eliminar"
                                rounded={true}
                                backgroundColor='rgb(212, 55, 55)' 
                                buttonStyle={ this.state.buttonDesactivar }
                                loadingRight={true}
                                disabled={ this.state.isEliminando || !this.state.administrador }
                                onPress={ (this.onEliminar.bind(this)) }
                                loading={ this.state.isEliminando }
                                loadingRight={true}
                            />
                        </View>
                    </View>
                    </ScrollView>
                </TouchableWithoutFeedback>

            )

        }

    }

    onEliminar(){

        if (this.state.isUserAdmin) {

            Alert.alert(
                'Eliminar Protocolo',
                '¿Está seguro? una vez eliminado no se podrá recuperar',
                [
                    {text: 'Si', onPress: async () => {

                        this.setState({
                            isEliminando: true
                        })

                        const id_protocolo = await AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')

                        let body = JSON.stringify(
                            {
                                name: 'deleteProtocol',
                                param: {
                                    protocolID: id_protocolo
                                }
                            }
                        )

                        fetch('https://udicat.muniguate.com/apps/ave_api/', {
                            method: 'POST',
                            headers: {
                                'CONTENT-TYPE': 'application/json'
                            },
                            body: body
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {

                            this.setState({
                                isEliminando: false
                            })

                            if (responseJson.response.status == 200) {

                                Alert.alert(
                                    'AVE',
                                    'Protocolo eliminado exitosamente',
                                    [
                                        {text: 'OK', onPress: () => {

                                            Actions.popTo('protocolos', { protocolo_agregado: true })

                                        }}
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

                    }},
                    {text: 'Cancelar'},
                ],
                {cancelable: true}
            )
        }

    }

    getDetails(){

        AsyncStorage.getItem('@AVE2:USER_ADMIN')
        .then((valor) => {

            if (valor != null) {

                this.setState({ isUserAdmin: true })

            }

        })
        .catch((error) => {


        })

        AsyncStorage.multiGet(['@AVE2:PROTOCOLO_ID', '@AVE2:USER_ID'])
        .then((valor) => {

            this.setState({ isLoading: true})

            let body = JSON.stringify(
                {
                    name: 'getDetailsProtocol2',
                    param: {
                        protocolID: valor[0][1],
                        userID: valor[1][1]
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

                console.log(responseJson.response.result[0])

                this.setState({
                    isLoading: false,
                    protocolName: responseJson.response.result[0].NOMBRE,
                    protocolDescription: responseJson.response.result[0].DESCRIPCION,
                    protocolID: responseJson.response.result[0].ID_PROTOCOLO,
                    protocolEstado: responseJson.response.result[0].ESTADO,
                    administrador: responseJson.response.result[0].ADMINISTRADOR,
                    selectedItems: [responseJson.response.result[0].ID_ORGANIZACION],
                    items: [responseJson.response.result[1]]
                })

            })
            .catch((error) => {

                this.setState({ isLoading: false })

            });

        })
        .catch((error) => {

            this.setState({ isLoading: false })

        })

    }

    onEditar(){

        if (this.state.isEditable == true) {

            let body = JSON.stringify(
                {
                    name: 'editProtocol2',
                    param: {
                        protocolID: this.state.protocolID,
                        protocolName: this.state.protocolName,
                        protocolDescription: this.state.protocolDescription,
                        id_organizacion: this.state.selectedItems[0]
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

                }

            })
            .catch((error) => {

                console.warn(error);

            });

        }else{

            this.setState({ isEditable: true, buttonText: 'Guardar' })

        }

    }

    onCambiarEstado(){

        Alert.alert(
            'AVE',
            '¿Seguro que desea cambiar el estado del protocolo?',
            [
                { text: 'Si', onPress: () => {

                    if (this.state.protocolEstado === 'A') {

                        var body = JSON.stringify(
                            {
                                name: 'updateStateProtocol',
                                param: {
                                    protocolID: this.state.protocolID,
                                    protocolState: "I"
                                }
                            }
                        )

                    }else{

                        var body = JSON.stringify(
                            {
                                name: 'updateStateProtocol',
                                param: {
                                    protocolID: this.state.protocolID,
                                    protocolState: "A"
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
                            this.setState({ protocolEstado: responseJson.response.result.protocolState })

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

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)',
        alignItems: 'center',
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
        backgroundColor: '#2089dc'
    },
    buttonDesactivar: {
        backgroundColor: 'rgb(212, 55, 55)'
    },
    buttonPress: {
        backgroundColor: 'rgb(85, 185, 16)'
    }

});
