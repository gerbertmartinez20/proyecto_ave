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
    ScrollView
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select'

import SectionedMultiSelect  from "react-native-sectioned-multi-select";

import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import CheckAdmin from '../functions/checkAdmin';

const { height } = Dimensions.get('window');

export default class DetallesActividad extends React.Component {

    constructor(props){
        super(props);

        this.inputRefs = {};

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
            teamData: '',
            screenHeight: 0,
            isUserAdmin: false,
            isLoadingTeam: false,
            items: [],
            administrador: false
        };
    }

    onContentSizeChange = (contentWidth, contentHeight) => {

        this.setState({
            screenHeight: contentHeight
        })

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

    UNSAFE_componentWillReceiveProps(props){

        this.getDetails()
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
                                    value={this.state.activityName}
                                    onChangeText={ (activityName) => this.setState({activityName}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    editable={this.state.isEditable}
                                    multiline
                                />
                            </View>

                            <FormLabel>Descripción</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainerMultiline : styles.inputContainerDisabledMultiline }>
                                <FormInput
                                    value={this.state.activityDescription}
                                    onChangeText={ (activityDescription) => this.setState({activityDescription}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    multiline
                                    editable={this.state.isEditable}
                                />
                            </View>

                            <FormLabel>Responsable</FormLabel>
                            <View style={ this.state.isEditable ? styles.inputContainer : styles.inputContainerDisabled }>

                                {/* <RNPickerSelect
                                    placeholder={{
                                        label: 'Seleccione un responsable',
                                        value: '',
                                    }}
                                    style={{ ...pickerSelectStyles }}
                                    itemKey={ this.state.activityResponsable }
                                    disabled={!this.state.isEditable}
                                    placeholderTextColor={'black'}
                                    items={responsables}
                                    onValueChange={ (activityResponsable) => this.setState({ activityResponsable }) }
                                    value={this.state.favColor}
                                    ref={(el) => {
                                        this.inputRefs.picker = el;
                                    }}
                                /> */}

                                <SectionedMultiSelect
                                    single={true}
                                    styles={{ fontSize: 20 }}
                                    expandDropDowns={true}
                                    items={this.state.items}
                                    uniqueKey='id'
                                    subKey='children'
                                    selectText='Seleccione un responsable'
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
                                        itemText: {fontSize: 24},
                                        subItemText: {fontSize: 20}
                                    }}
                                    onToggleSelector={ (e) => {

                                        if (e) {

                                            this.setState({
                                                isLoadingTeam: true
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
                                                        isLoadingTeam: false
                                                    })


                                                })
                                                .catch((error) => {

                                                    this.setState({ isLoading: false })

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

                                                this.setState({ isLoading: 0 })

                                            })
                                        }else{
                                            this.setState({
                                                isLoading: false
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
                            icon={{name: this.state.activityState == 'A' ? 'times' : 'check', type: 'font-awesome'}}
                            title={ this.state.activityState == 'A' ?  'Desactivar' : 'Activar' }
                            rounded={true}
                            backgroundColor={ this.state.activityState == 'A' ? 'rgb(212, 55, 55)' : 'rgb(85, 185, 16)' }
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

        AsyncStorage.getItem('@AVE2:ACTIVIDAD_ID')
        .then((actividadID) => {

            let body = JSON.stringify(
                {
                    name: 'getDetailsActivity2',
                    param: {
                        activityID: actividadID,
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
                    teamData: responseJson.response.result[1],
                    activityResponsable: responseJson.response.result[0].ID_RESPONSABLE,
                    activityName: responseJson.response.result[0].NOMBRE,
                    activityDescription: responseJson.response.result[0].DESCRIPCION,
                    activityID: responseJson.response.result[0].ID_ACTIVIDAD,
                    activityState: responseJson.response.result[0].ESTADO,
                    selectedItems: [responseJson.response.result[0].ID_RESPONSABLE],
                    items: [responseJson.response.result[2]],
                    administrador: responseJson.response.result[3]

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

            if (this.state.activityName == '') {

                Alert.alert(
                    'Error',
                    'La actividad debe de tener un nombre',
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
                        name: 'editActivity',
                        param: {
                            activityID: this.state.activityID,
                            activityName: this.state.activityName,
                            activityDescription: this.state.activityDescription,
                            activityResponsableID: this.state.selectedItems[0]
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
            '¿Seguro que desea cambiar el estado de la actividad?',
            [
                { text: 'Si', onPress: () => {

                    if (this.state.activityState === 'A') {

                        var body = JSON.stringify(
                            {
                                name: 'updateActivityState',
                                param: {
                                    activityID: this.state.activityID,
                                    activityState: "I"
                                }
                            }
                        )

                    }else{

                        var body = JSON.stringify(
                            {
                                name: 'updateActivityState',
                                param: {
                                    activityID: this.state.activityID,
                                    activityState: "A"
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
                            this.setState({ activityState: responseJson.response.result.activityState })

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
