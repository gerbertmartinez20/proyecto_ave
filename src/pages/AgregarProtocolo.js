import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Dimensions,
    AsyncStorage,
    ScrollView
} from 'react-native';

import { FormLabel, FormInput, Button } from 'react-native-elements'

import SectionedMultiSelect  from "react-native-sectioned-multi-select";

import { Actions } from 'react-native-router-flux';

const { height } = Dimensions.get('window');

export default class AgregarProtocolo extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            nombre: '',
            descripcion: '',
            isSaving: false,
            errorNombre: '',
            screenHeight: 0,
            items: [],
            isLoadingTeam: false,
            selectedItems: []
        };

    }

    componentDidMount(){

        this.obtenerEquipos()

    }

    onContentSizeChange = (contentWidth, contentHeight) => {

        this.setState({
            screenHeight: contentHeight
        })

    }

    onSelectedItemsChange = (selectedItems) => {

        console.log(selectedItems)

        this.setState({ selectedItems });

    }

    async obtenerEquipos(){

        try {
            
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
    
                    console.log(responseJson)
    
                })
                .catch((error) => {
    
    
                });

            }

        } catch (error) {
         
            console.log(error)

        }


    }

    render() {

        const scrollEnabled = this.state.screenHeight > height;

        return (
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss } ref="foo" accesible={false}>
                <ScrollView
                    style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={scrollEnabled}
                    onContentSizeChange={this.onContentSizeChange}
                >
                <View style={styles.container}>
                    <View >

                        <FormLabel>Nombre</FormLabel>
                        <View style={styles.inputContainer}>
                            <FormInput
                                value={this.state.nombre}
                                onChangeText={ (nombre) => this.setState({nombre}) }
                                inputStyle={styles.inputBox}
                                containerStyle={{ borderBottomWidth: 0}}
                                underlineColorAndroid={'transparent'}
                                clearButtonMode='always'
                                keyboardAppearance='dark'
                            />
                        </View>

                        <FormLabel>Descripción</FormLabel>
                        <View style={styles.inputContainerMultiline}>
                            <FormInput
                                value={this.state.descripcion}
                                onChangeText={ (descripcion) => this.setState({descripcion}) }
                                inputStyle={[styles.inputMultiline]}
                                containerStyle={{ borderBottomWidth: 0}}
                                underlineColorAndroid={'transparent'}
                                clearButtonMode='always'
                                keyboardAppearance='dark'
                                multiline
                            />
                        </View>
                        <FormLabel>Equipo</FormLabel>
                        <View style={styles.inputContainer}>
                            <SectionedMultiSelect
                                single={true}
                                styles={{ fontSize: 20 }}
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
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 20}}>
                    <Button
                        large
                        icon={{name: 'save', type: 'font-awesome'}}
                        title='Guardar'
                        rounded={true}
                        backgroundColor='#2089dc'
                        loading={ this.state.isSaving }
                        onPress={ (this.onGuardar.bind(this)) }
                        loadingRight={true}
                        disabled={ this.state.isSaving }
                    />

                    </View>
                </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        );
    }

    onGuardar(){

        if(this.state.nombre == ''){

            Alert.alert(
                'Error',
                'Debe ingresar un nombre',
                [
                    {text: 'OK'}
                ],
                {
                    cancelable: false
                }
            )

        }else if (this.state.selectedItems.length <= 0){

            Alert.alert(
                'Error',
                'Debe seleccionar un equipo',
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
                        name: 'createProtocol2',
                        param: {
                            userID: valor,
                            protocolName: this.state.nombre,
                            protocolDescription: this.state.descripcion,
                            id_organizacion: this.state.selectedItems[0]
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

                                    Actions.popTo( 'protocolos', { protocolo_agregado: true } )
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

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)',
        alignItems: 'center',
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
        alignItems: 'flex-start',
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

    }

});
