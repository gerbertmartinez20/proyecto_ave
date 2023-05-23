import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Dimensions,
    AsyncStorage,
    Alert
} from 'react-native';

import SectionedMultiSelect  from "react-native-sectioned-multi-select";

import { FormLabel, FormInput, Button } from 'react-native-elements'

const { height } = Dimensions.get('window');

import AwesomeAlert from 'react-native-awesome-alerts';

import { Actions } from 'react-native-router-flux';

import Prompt from 'react-native-prompt-crossplatform';

export default class Alertas extends React.Component {

    _isMounted = false
    _nameAlert = ''

    constructor(props){
        super(props);

        this.state = {
            selectedItems: [],
            items: [],
            isLoading: false,
            getTeam: false,
            message: '',
            isUserAdmin: false,
            sendingNotifications: false,
            resultNotifications: false,
            totalNotifications: '',
            visiblePrompt: false,
            promptValue: ''
        };
    }

    onSelectedItemsChange = (selectedItems) => {

        this.setState({ selectedItems });

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

    // getData(){

    //     this.setState({
    //         isLoading: true
    //     })

    //     AsyncStorage.getItem('@AVE2:USER_ID')
    //     .then((valor) => {

    //         let body = JSON.stringify(
    //             {
    //                 name: 'itemsEquipo',
    //                 param: {
    //                     userID: valor
    //                 }
    //             }
    //         )

    //         fetch('https://udicat.muniguate.com/apps/ave_api/', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'CONTENT-TYPE': 'application/json'
    //             },
    //             body: body
    //         })
    //         .then((response) => response.json())
    //         .then((responseJson) => {

    //             this.setState({ 
    //                 isLoading: false, 
    //                 items: responseJson.response.result,
    //                 isLoading: false
    //             })

    //         })
    //         .catch((error) => {

    //             this.setState({ isLoading: false })

    //             Alert.alert(
    //                 'Error',
    //                 'Existen problemas para conectarse con el servicio.  Revise su conexión a internet.',
    //                 [
    //                     {text: 'OK'}
    //                 ],
    //                 {
    //                     cancelable: false
    //                 }
    //             )

    //         });

    //     })
    //     .catch((error) => {

    //         this.setState({ isLoading: 0 })

    //     })

    // }

    componentDidMount(){

        this._isMounted = true

        //Obtener datos del equipo
        //this.getData()

    }

    componentWillUnmount(){

        this._isMounted = false
        //Desconectar todas las peticiones y setState

    }

    onContentSizeChange = (contentWidth, contentHeight) => {

        this.setState({
            screenHeight: contentHeight
        })

    }

    saveAlert(){

        this.setState({
            isSaving: true
        })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'createAlert',
                    param: {
                        userID: valor,
                        nameAlert: this.state.promptValue,
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

                console.log(responseJson)
                this.setState({ isSaving: false }) 

                //Actions.pop()

                Alert.alert(
                    'AVE',
                    'Alerta registrada exitosamente.',
                    [
                        {text: 'OK', onPress: () => {

                            //Actions.mensajes()

                        }

                        }
                    ],
                    {
                        cancelable: false
                    }
                )

            })
            .catch((error) => {

                console.log(error)

                this.setState({ isSaving: false })

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

    }

    render() {

        const scrollEnabled = this.state.screenHeight > height;

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
                        <FormLabel>Mensaje a enviar</FormLabel>
                        <View style={ styles.inputContainerMultiline }>
                            <FormInput
                                value={this.state.message}
                                onChangeText={ (message) => this.setState({message}) }
                                inputStyle={styles.inputMultiline}
                                containerStyle={{ borderBottomWidth: 0}}
                                underlineColorAndroid={'transparent'}
                                clearButtonMode='while-editing'
                                keyboardAppearance='dark'
                                multiline
                            />
                        </View>
                        <FormLabel>Personas que recibirán la alerta</FormLabel>
                        <View style={ [styles.inputContainer, { paddingBottom: 10 }] }>
                            <SectionedMultiSelect
                                styles={{ fontSize: 20 }}
                                expandDropDowns={false}
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
                                loading={this.state.isLoading}
                                removeAllText="Quitar todos"
                                colors={{ cancel: 'red' }}
                                styles={{ 
                                    itemText: {fontSize: 24},
                                    subItemText: {fontSize: 20}
                                }}
                                onToggleSelector={ (e) => {

                                    if (e) {

                                        this.setState({
                                            isLoading: true
                                        })

                                        AsyncStorage.getItem('@AVE2:USER_ID')
                                        .then((valor) => {

                                            let body = JSON.stringify(
                                                {
                                                    name: 'itemsEquipoAlertas',
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

                                                console.log(responseJson)

                                                this.setState({ 
                                                    isLoading: false, 
                                                    items: responseJson.response.result,
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

                                    console.log('Solicitar nombre')

                                    this.setState({
                                        visiblePrompt: true
                                    })

                                    // AlertIOS.prompt('Nombre para Alerta', 'Ingrese un texto para identificar la alerta', (text) => {

                                    //     if (text == '') {

                                    //         console.log('Debe ingresar un nombre')

                                    //     }else{

                                    //         this.saveAlert(text)

                                    //     }
                                        
                                    // })

                                    // prompt(
                                    //     'Nombre para Alerta',
                                    //     'Ingrese un texto para identificar la alerta',
                                    //     [
                                    //         {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                    //         {text: 'Guardar', onPress: nombre => {

                                    //             if (nombre == '') {

                                    //                 console.log('Debe ingresar un nombre')

                                    //             }else{

                                    //                 this.saveAlert(nombre)

                                    //             }

                                    //         }},
                                    //        ],
                                    //        {
                                    //            cancelable: false,
                                    //            placeholder: 'Nombre de la alerta'
                                    //        }
                                       
                                    // );
                                    

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

                <Prompt
                    title="Guardar alerta"
                    inputPlaceholder="Ingrese un nombre"
                    isVisible={this.state.visiblePrompt}
                    submitButtonText='Guardar'
                    cancelButtonText='Cancelar'
                    primaryColor='blue'
                    onChangeText={(text) => {

                        this.setState({ promptValue: text });

                    }}
                    onCancel={() => {
                        this.setState({
                            promptValue: '',
                            visiblePrompt: false,
                        });
                    }}
                    onSubmit={() => {
                        this.setState({
                            visiblePrompt: false,
                        });
                        this.saveAlert()
                    }}
                />


            </View>
        );

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
    inputBox: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        // height: 200,
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
