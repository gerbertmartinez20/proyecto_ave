import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Dimensions,
    AsyncStorage,
    Alert,
    ActivityIndicator
} from 'react-native';

import SectionedMultiSelect  from "react-native-sectioned-multi-select";

import { FormLabel, FormInput, Button } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import AwesomeAlert from 'react-native-awesome-alerts';

const { height } = Dimensions.get('window');

export default class EditarAlerta extends React.Component {

    _isMounted = false

    constructor(props){

        super(props);

        this.state = {
            selectedItems: [],
            items: [],
            isLoading: false,
            isSaving: false,
            isGetting: false,
            getTeam: false,
            message: '',
            name: '',
            editExists: false,
            id_alerta: props.id_alerta,
            sendingNotifications: false,
            resultNotifications: false,
            totalNotifications: ''
        };
    }

    onExit(){

        console.log('Retornando a alertas')
        Actions.alertas({ editExists: this.state.editExists })

    }   

    componentDidMount(){

        this.getData()

    }

    onSelectedItemsChange = (selectedItems) => {

        this.setState({ selectedItems });

        console.log(this.state.selectedItems)

    }

    onContentSizeChange = (contentWidth, contentHeight) => {

        this.setState({
            screenHeight: contentHeight
        })

    }

    checkRequired(){

        if (this.state.message == '') {

            console.log('Debe colocar un mensaje')

            Alert.alert(
                'Error',
                'Debe escribir un mensaje a enviar',
                [
                    {text: 'OK'}
                ],
                {
                    cancelable: false
                }
            )

        }else if(this.state.selectedItems.length == 0){

            console.log('Debe seleccionar un destino')

            Alert.alert(
                'Error',
                'Debe seleccionar al menos un destino',
                [
                    {text: 'OK'}
                ],
                {
                    cancelable: false
                }
            )

        }else{

            return true

        }

    }

    getData(){
        
        this.setState({
            isLoading: true
        })

        let body = JSON.stringify(
            {
                name: 'infoAlert2',
                param: {
                    alertID: this.state.id_alerta
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
                message: responseJson.response.result.MENSAJE,
                selectedItems: responseJson.response.result.DESTINOS,
                name: responseJson.response.result.NOMBRE,
                items: [responseJson.response.result.EQUIPO],
                isLoading: false
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


    }

    render() {

        const scrollEnabled = this.state.screenHeight > height;

        if (this.state.isLoading) {
            
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>
            );

        }else{

            return (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                <TouchableWithoutFeedback onPress={ Keyboard.dismiss } style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}} ref="foo" accesible={false}>
                    
                <ScrollView
                    style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={scrollEnabled}
                    onContentSizeChange={this.onContentSizeChange}
                >
                    <View style={styles.container}>

                    <View>
                        <FormLabel>Nombre</FormLabel>
                        <View style={ styles.inputContainer }>
                            <FormInput
                                value={this.state.name}
                                onChangeText={ (name) => this.setState({name}) }
                                inputStyle={styles.inputBox}
                                containerStyle={{ borderBottomWidth: 0}}
                                underlineColorAndroid={'transparent'}
                                clearButtonMode='while-editing'
                                keyboardAppearance='dark'
                            />
                        </View>
                        <FormLabel>Mensaje a enviar</FormLabel>
                        <View style={ styles.inputContainer }>
                            <FormInput
                                value={this.state.message}
                                onChangeText={ (message) => this.setState({message}) }
                                inputStyle={styles.inputBoxMultiline}
                                containerStyle={{ borderBottomWidth: 0}}
                                underlineColorAndroid={'transparent'}
                                clearButtonMode='while-editing'
                                keyboardAppearance='dark'
                                multiline
                            />
                        </View>
                        <FormLabel>Personas</FormLabel>
                        <View style={ styles.inputContainerSelect }>
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
                                showDropDowns={true}
                                readOnlyHeadings={true}
                                showCancelButton={true}
                                onSelectedItemsChange={this.onSelectedItemsChange}
                                selectedItems={this.state.selectedItems}
                                showRemoveAll={true}
                                loading={this.state.isGetting}
                                removeAllText="Quitar todos"
                                colors={{ cancel: 'red' }}
                                styles={{ 
                                    itemText: {fontSize: 24},
                                    subItemText: {fontSize: 20}
                                }}
                                // onToggleSelector={ (e) => {

                                //     if (e) {

                                //         this.setState({
                                //             isGetting: true
                                //         })

                                //         AsyncStorage.getItem('@AVE2:USER_ID')
                                //         .then((valor) => {

                                //             let body = JSON.stringify(
                                //                 {
                                //                     name: 'itemsEquipo',
                                //                     param: {
                                //                         userID: valor
                                //                     }
                                //                 }
                                //             )

                                //             fetch('https://udicat.muniguate.com/apps/ave_api/', {
                                //                 method: 'POST',
                                //                 headers: {
                                //                     'Accept': 'application/json',
                                //                     'CONTENT-TYPE': 'application/json'
                                //                 },
                                //                 body: body
                                //             })
                                //             .then((response) => response.json())
                                //             .then((responseJson) => {

                                //                 this.setState({ 
                                //                     isGetting: false, 
                                //                     items: [responseJson.response.result],
                                //                 })


                                //             })
                                //             .catch((error) => {

                                //                 this.setState({ isLoading: false })

                                //                 Alert.alert(
                                //                     'Error',
                                //                     'Existen problemas para conectarse con el servicio.  Revise su conexión a internet.',
                                //                     [
                                //                         {text: 'OK'}
                                //                     ],
                                //                     {
                                //                         cancelable: false
                                //                     }
                                //                 )

                                //             });

                                //         })
                                //         .catch((error) => {

                                //             this.setState({ isLoading: 0 })

                                //         })
                                //     }else{
                                //         this.setState({
                                //             isLoading: false
                                //         })
                                //     }
                                    
                                // }}
                            />
                        </View>

                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20}}>
                        
                        <Button
                            large
                            icon={{name: 'save', type: 'font-awesome'}}
                            title='Guardar'
                            rounded={true}
                            backgroundColor='#2089dc'
                            loading={ this.state.isSaving }
                            loadingRight={true}
                            disabled={ this.state.isSaving }
                            onPress={()=>{

                                let result = this.checkRequired()

                                if (result) {

                                    this.setState({
                                        isSaving: true
                                    })

                                    let body = JSON.stringify(
                                        {
                                            name: 'editAlert',
                                            param: {
                                                alertID: this.state.id_alerta,
                                                nameAlert: this.state.name,
                                                messageAlert: this.state.message,
                                                destinationAlert: this.state.selectedItems
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
                                            isSaving: false
                                        })

                                        console.log(responseJson)

                                        Alert.alert(
                                            'Editar Alerta',
                                            'Los cambios se han guardado exitosamente'
                                        )

                                    })
                                    .catch((error) => {

                                        console.log(error)

                                        this.setState({
                                            isSaving: false
                                        })

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

                                }
                            }}
                        />

                        <Button
                            large
                            icon={{name: 'send', type: 'font-awesome'}}
                            title='Enviar'
                            rounded={true}
                            backgroundColor='green'
                            loading={ this.state.isSending }
                            loadingRight={true}
                            disabled={ this.state.isSending }
                            onPress={()=>{

                                if (this.state.message == '') {

                                    console.log('Debe colocar un mensaje')

                                    Alert.alert(
                                        'Error',
                                        'Debe escribir un mensaje a enviar',
                                        [
                                            {text: 'OK'}
                                        ],
                                        {
                                            cancelable: false
                                        }
                                    )

                                }else if(this.state.selectedItems.length == 0){

                                    console.log('Debe seleccionar un destino')

                                    Alert.alert(
                                        'Error',
                                        'Debe seleccionar al menos un destino',
                                        [
                                            {text: 'OK'}
                                        ],
                                        {
                                            cancelable: false
                                        }
                                    )

                                }else{

                                    Alert.alert(
                                        '¿Esta seguro que desea enviar la alerta?',
                                        'Se enviara notificación a todas las personas',
                                        [
                                          {text: 'Si', onPress: () => {

                                            this.setState({
                                                isSending: true,
                                                sendingNotifications: true
                                            })
        
                                            let body = JSON.stringify(
                                                {
                                                    message: this.state.message,
                                                    destination: this.state.selectedItems
                                                }
                                            )
        
                                            fetch('https://udicat.muniguate.com/ave2_api/public/enviar_alerta', {
                                                method: 'POST',
                                                headers: {
                                                    'CONTENT-TYPE': 'application/json'
                                                },
                                                body: body
                                            })
                                            .then((response) => response.json())
                                            .then((responseJson) => {
                                                console.log(responseJson)
        
                                                this.setState({
                                                    isSending: false,
                                                    sendingNotifications: false,
                                                    resultNotifications: true,
                                                    totalNotifications: responseJson.toString()
                                                })
                                            })

                                          }},

                                          {text: 'No', onPress: () => console.log('OK Pressed')},
                                        ],
                                        {cancelable: false},
                                    );
                                      
                                }

                            }}
                        />

                    </View>



                </View> 
                </ScrollView>
            </TouchableWithoutFeedback>

            <AwesomeAlert
                        show={this.state.sendingNotifications}
                        showProgress={true}
                        title="Enviando"
                        message="Por favor espere un momento!"
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                    />

                    <AwesomeAlert
                        show={this.state.resultNotifications}
                        title="Personas Notificadas"
                        message={ this.state.totalNotifications }
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showConfirmButton={true}
                        confirmButtonColor="#DD6B55"
                        confirmText="Aceptar"
                        onConfirmPressed={() => {
                            this.setState({ resultNotifications: false })
                        }}
                    />
            </View>

            );

        }
    }


}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        flex: 1,
        paddingBottom: 40,
        justifyContent: 'center'
    },
    inputBoxMultiline: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        height: 200
    },
    inputBox: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        alignItems: 'flex-start'
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
        borderLeftColor: '#d2d4d8',
    },
    inputContainerSelect: {
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
        padding: 10
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
