import Voice from 'react-native-voice';

import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    AsyncStorage,
    ScrollView,
    RefreshControl,
    Dimensions
} from 'react-native';

import { FormLabel, FormInput, Button } from 'react-native-elements'

const { height } = Dimensions.get('window');

export default class EditarActividadIncidente extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            screenHeight: 0,
            comentario: '',
            fecha_finalizacion: '',
            recognized: false,
            started: false,
            results: [],
            isEditing: false
        };

        Voice.onSpeechStart = this.onSpeechStart.bind(this)
        Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
        Voice.onSpeechResults = this.onSpeechResults.bind(this) 
        
    }

    async _startRecognition(e) {
        this.setState({
            recognized: '',
            started: '',
            results: [],
        });
        try {
            await Voice.start('es-ES');
        } catch (e) {
            console.error(e);
        }
      }

    onSpeechStart(e) {
        this.setState({
            started: true,
        });
      }
    onSpeechRecognized(e) {
        this.setState({
            recognized: true,
        });
    }
    
    onSpeechResults(e) {

        var temp = e.value

        this.setState({
            results: e.value,
            comentario: temp.toString()
        });

    }

    onContentSizeChange = (contentWidth, contentHeight) => {

        this.setState({
            screenHeight: contentHeight
        })

    }

    componentDidMount(){

        this.getData()

    }

    getData(){

        this.setState({ isLoading: true })

        AsyncStorage.getItem('@AVE2:ACTIVIDAD_INCIDENTE_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'editUserActivity',
                    param: {
                        activityID: valor
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
                    isLoading: false,
                    fecha_finalizacion: responseJson.response.result.FECHA_FINALIZACION,
                    comentario: responseJson.response.result.COMENTARIO
                })

            })
            .catch((error) => {

                console.warn(error);
                this.setState({ isLoading: false })

            });

        })
        .catch((error) => {

            console.warn(error);

        })

    }

    render() {

        if (this.state.isLoading) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

        }else{

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

                            <Fecha fecha_finalizacion={this.state.fecha_finalizacion} />

                            <FormLabel>Comentario</FormLabel>
                            <View style={ styles.inputContainer }>
                                <FormInput
                                    value= {this.state.comentario}
                                    onChangeText={ (comentario) => this.setState({comentario}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    multiline
                                    editable={true}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>

                        <Button
                            large
                            icon={{name: this.state.fecha_finalizacion ? 'edit' : 'check', type: 'font-awesome'}}
                            title={ this.state.fecha_finalizacion ? 'Actualizar' : 'Realizada' }
                            rounded={true}
                            backgroundColor={ this.state.fecha_finalizacion ? '#2089dc' : 'rgb(111, 208, 77)' }
                            loadingRight={true}
                            disabled={ this.state.isEditing }
                            loading={ this.state.isEditing }
                            loadingRight={true}
                            onPress={ () => {

                                Voice.start('es-ES');
                                //this._startRecognition.bind(this)
                                {/* 
                                this.setState({ isEditing: true })

                                AsyncStorage.getItem('@AVE2:ACTIVIDAD_INCIDENTE_ID')
                                .then((valor) => {

                                    let body = JSON.stringify(
                                        {
                                            name: 'updateUserActivity',
                                            param: {
                                                activityID: valor,
                                                fecha_finalizacion: this.state.fecha_finalizacion,
                                                comentario: this.state.comentario
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

                                        console.warn(responseJson);

                                        this.setState({
                                            isEditing: false,
                                        })

                                        Alert.alert(
                                            'AVE',
                                            'Actividad editada exitosamete.',
                                            [
                                                {text: 'OK', onPress: () => {

                                                    Actions.detalle_incidente()

                                                }

                                                }
                                            ],
                                            {
                                                cancelable: false
                                            }
                                        )

                                    })
                                    .catch((error) => {



                                    });

                                })
                                .catch((error) => {

                                    console.warn(error);

                                })
                                */}

                            }}
                        />
                        </View>
                    </View>
                    </ScrollView>
                </TouchableWithoutFeedback>

            );

        }

    }

}

const Fecha = (props) => {

    if (props.fecha_finalizacion) {

        return (
            <View>
                <FormLabel>Fecha de finalización</FormLabel>
                <View style={ styles.inputContainerDisabled }>
                    <FormInput
                        value={props.fecha_finalizacion}
                        inputStyle={styles.inputBox}
                        containerStyle={{ borderBottomWidth: 0}}
                        underlineColorAndroid={'transparent'}
                        clearButtonMode='while-editing'
                        keyboardAppearance='dark'
                        editable={false}
                    />
                </View>
            </View>

        )

    }else{

        return (

            <View>
            </View>

        )

    }

}

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
        borderTopColor: '#2089dc',
        borderRightColor: '#2089dc',
        borderBottomColor: '#2089dc',
        borderLeftColor: '#2089dc'

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
        backgroundColor: 'rgb(228, 228, 228)'

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
