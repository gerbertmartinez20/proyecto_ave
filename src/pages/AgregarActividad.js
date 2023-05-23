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
    Platform
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select'

import SectionedMultiSelect  from "react-native-sectioned-multi-select";

import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

const { height } = Dimensions.get('window');

export default class AgregarActividad extends React.Component {

    constructor(props){
        super(props);

        this.inputRefs = {};

        this.state = {
            activityName: '',
            activityDescription: '',
            activityResponsable: '',
            isSaving: false,
            isLoadingData: false,
            teamData: '',
            screenHeight: 0,
            isLoadingTeam: false
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

    componentDidMount(){

        this.loadData()

    }

    render() {

        if (this.state.isLoadingData) {

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
                            <View style={ styles.inputContainer }>
                                <FormInput
                                    value={this.state.activityName}
                                    onChangeText={ (activityName) => this.setState({activityName}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                />
                            </View>

                            <FormLabel>Descripción</FormLabel>
                            <View style={ styles.inputContainerMultiline }>
                                <FormInput
                                    value={this.state.activityDescription}
                                    onChangeText={ (activityDescription) => this.setState({activityDescription}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    multiline
                                />
                            </View>

                            <FormLabel>Responsable</FormLabel>

                            <View style={ styles.inputContainer }>

                                {/* <RNPickerSelect
                                    placeholder={{
                                        label: 'Seleccione un responsable',
                                        value: '',
                                    }}
                                    style={{ ...pickerSelectStyles }}
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
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 20}}>
                        <Button
                            large
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
                    </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            );

        }
    }

    onGuardar(){

        if(this.state.activityName == ''){

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

        }else if(this.state.selectedItems[0] == ''){

            Alert.alert(
                'Error',
                'La actividad debe de tener un responsable',
                [
                    {text: 'OK'}
                ],
                {
                    cancelable: false
                }
            )

        }else{

            this.setState({ isSaving: true })

            AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')
            .then((protocolID) => {

                let body = JSON.stringify(
                    {
                        name: 'createActivity',
                        param: {
                            protocolID: protocolID,
                            activityName: this.state.activityName,
                            activityDescription: this.state.activityDescription,
                            activityResponsableID: this.state.selectedItems[0]
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

                                    Actions.actividades( { actividad_agregada: true })
                                    // Actions.popTo('actividades', { actividad_agregada: true })

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
