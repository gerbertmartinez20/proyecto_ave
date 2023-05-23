import Voice from 'react-native-voice';

import {PermissionsAndroid} from 'react-native';

import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    Platform,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    AsyncStorage,
    ScrollView,
    RefreshControl,
    Dimensions
} from 'react-native';

import { List, ListItem, SearchBar, Card, Button, Icon, Badge, FormLabel, FormInput } from 'react-native-elements'

import Modal from "react-native-modal";

import { Actions } from 'react-native-router-flux';

const { height } = Dimensions.get('window');

import AwesomeAlert from 'react-native-awesome-alerts'

export default class DetalleIncidente extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            data: '',
            isModalVisible: false,
            isLoading: false,
            screenHeight: 0,
            comentario: '',
            fecha_finalizacion: '',
            recognized: false,
            started: false,
            results: [],
            isEditing: false,
            reconocimientoIniciado: false,
            incidente_finalizado: false
        };

        Voice.onSpeechStart = this.onSpeechStart.bind(this)
        Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
        Voice.onSpeechResults = this.onSpeechResults.bind(this) 

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
          comentario: temp.toString(),
          reconocimientoIniciado: false
        });

    }

    componentDidMount(){

        this.getData()

    }

    UNSAFE_componentWillReceiveProps(props){

        this.getData()
    }

    async solicictarPermiso(){

            
            try {
            
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
                    title: 'Cool Photo App Camera Permission',
                    message:
                      'Cool Photo App needs access to your camera ' +
                      'so you can take awesome pictures.',
                    buttonNeutral: 'Preguntame Después',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK',
                  })

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                    console.log('You can use the camera');

                    this.setState({
                        reconocimientoIniciado: true
                    })
                    Voice.start('es-ES')

                } else {

                    console.log('Camera permission denied');

                }
                
            } catch (err) {
    
                console.log(err)
    
            }

        

    }

    getData(){

        this.setState({ isLoading: true })

        AsyncStorage.getItem('@AVE2:INCIDENTE_ID')
        .then((incidente_id) => {


            AsyncStorage.getItem('@AVE2:USER_ID')
            .then((user_id) => {

                let body = JSON.stringify(
                    {
                        name: 'getUserActivities',
                        param: {
                            userID: user_id,
                            incidentID: incidente_id
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

                    console.log(responseJson.response)

                    this.setState({ 
                        isLoading: false, 
                        data: responseJson.response.result[0],
                        incidente_finalizado: responseJson.response.result[1]
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

                this.setState({ isLoading: false })

                console.log(error);

            })

        })
        .catch((error) => {

            console.log(error);

        })

    }

    _toggleModal(){

        this.setState({ isModalVisible: !this.state.isModalVisible })

    }

    render() {

        if (this.state.isLoading) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

        }else{

            let items = this.state.data || []

            const scrollEnabled = this.state.screenHeight > height;

            return (

                <View style={{ flex: 1, backgroundColor: '#ffffff'}}>

                    <Modal 
                        style={{ 
                            flex: 1,    
                            backgroundColor: "white",
                            borderTopRightRadius: 25,
                            borderTopLeftRadius: 25,
                            borderColor: "rgba(0, 0, 0, 0.1)" ,
                            justifyContent: "flex-end",
                            margin: 0,
                            marginTop: 30
                        }}
                        isVisible={this.state.isModalVisible}
                        swipeDirection="down"
                        onSwipe={() => this.setState({ isModalVisible: false })}
                    >
                        <View style={{ flex: 1 }}>

                            <Icon
                                name='angle-down'
                                type='font-awesome'
                                color='#d2d4d8'
                                size={40}
                                containerStyle={{ borderBottomWidth: 2, marginRight: 20, marginLeft: 20, borderColor: '#d2d4d8' }}
                                onPress={ (this._toggleModal.bind(this)) } 
                            />

                            <TouchableWithoutFeedback onPress={ Keyboard.dismiss } style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}} ref="foo" accesible={false}>
                                <ScrollView>
                                    <View style={styles.container}>
                                        <View>
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

                                            {/* <Button
                                                rounded={true}
                                                icon={{name: 'microphone', type: 'font-awesome'}}
                                                title="Voz"
                                                disabled={this.state.reconocimientoIniciado}
                                                loading={this.state.reconocimientoIniciado}
                                                onPress={ () => {

                                                    //Si es Andriod solicitar permisos manualmente
                                                    //this.requestCameraPermission()    

                                                    if (Platform.OS === 'android') {

                                                        this.solicictarPermiso()

                                                    }else{

                                                        this.setState({
                                                            reconocimientoIniciado: true
                                                        })
                                                        Voice.start('es-ES')

                                                    }
                                                    


                                                    //Si es iOS iniciar el reconocimiento de voz 

                                                    //Voice.start('es-ES');
                                                }}
                                                loadingRight={true}
                                                //loading={this.state.started}
                                                //disabled={this.state.started}
                                            /> */}

                                            <Button
                                                
                                                icon={{name: this.state.fecha_finalizacion ? 'edit' : 'check', type: 'font-awesome'}}
                                                title={ this.state.fecha_finalizacion ? 'Actualizar' : 'Realizada' }
                                                rounded={true}
                                                backgroundColor={ this.state.fecha_finalizacion ? '#2089dc' : 'rgb(111, 208, 77)' }
                                                loadingRight={true}
                                                disabled={ this.state.isEditing }
                                                loading={ this.state.isEditing }
                                                loadingRight={true}
                                                onPress={ () => { 

                                                    
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

                                                            console.log(responseJson);

                                                            this.setState({
                                                                isEditing: false,
                                                                
                                                            })

                                                            Alert.alert(
                                                                'AVE',
                                                                'Actividad editada exitosamete.',
                                                                [
                                                                    {text: 'OK', onPress: () => 
                                                                        {
                                                                            this.setState({
                                                                                isModalVisible: false
                                                                            })
                                                                            this.getData()
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

                                                        console.log(error);

                                                    })

                                                }}        
                                            />
                                            
                                        </View> 
                                    </View>
                                </ScrollView>
                            </TouchableWithoutFeedback>

                        </View>
                    </Modal>

                    < SearchBar
                    value={this.state.searchText}
                    onChangeText={ (searchText) => {
                        {/*
                        this.setState({searchText})

                        this.setState({ searching: true })

                        AsyncStorage.getItem('@AVE2:USER_ID')
                        .then((valor) => {

                            let body = JSON.stringify(
                                {
                                    name: 'searchProtocols',
                                    param: {
                                        userID: valor,
                                        textSearch: this.state.searchText
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

                                this.setState({ searching: false })
                                this.setState({ data: responseJson.response.result })

                            })
                            .catch((error) => {

                                console.warn(error);

                            });

                        })
                        .catch((error) => {

                            this.setState({ isLoading: 0 })

                        })
                        */}

                    }}
                    showLoadingIcon={this.state.searching}
                    lightTheme
                    round
                    placeholder='Buscar'
                    containerStyle={{ backgroundColor: 'rgb(255, 255, 255)'}}
                    inputStyle={{
                        borderTopWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderLeftWidth: 1,
                        backgroundColor: 'rgb(255, 255, 255)',
                        borderColor: '#d2d4d8'
                    }}
                    clearIcon
                />

                    <ScrollView
                        style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                        showsVerticalScrollIndicator={true}
                        scrollsToTop={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={ this._onRefresh }
                            />
                        }
                    >
                    {

                        items.map((item, key)=>(

                            <Card
                                title={item.NOMBRE}
                                titleNumberOfLines={10}
                                containerStyle={{
                                    borderRadius: 10,
                                    borderColor: '#d2d4d8',
                                    borderWidth: 2
                                }}
                                key={key}
                            >

                                <View style={{ flex: 1, marginBottom: 10}}>

                                <Text
                                    style={{ fontWeight: 'bold'}}
                                >
                                    Descripción
                                </Text>

                                    <Text
                                        style={{ textAlign: 'justify'}}
                                    >
                                        { item.DESCRIPCION }
                                    </Text>

                                </View>

                                <View style={{ height: 40, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                                    <View style={{ justifyContent: 'center', alignItems: 'flex-start'}}>
                                        <Text style={{ fontWeight: 'bold'}}>
                                            Estado
                                        </Text>

                                        {/* <Badge containerStyle={{ backgroundColor: item.FECHA_FINALIZACION ? 'green' : 'red', padding: 0}}>

                                        </Badge> */}
                                        <Text style={{ fontWeight: 'bold', color: item.FECHA_FINALIZACION ? 'green' : 'red'}}>{ item.FECHA_FINALIZACION ? 'Realizada' : 'Pendiente' }</Text>

                                    </View>

                                    <View style={{ justifyContent: 'center', alignItems: 'center'}}>

                                        {/* 
                                        <Boton
                                            fecha_finalizacion={item.FECHA_FINALIZACION}
                                            id_actividad={ item.ID_CORRELATIVO }
                                        />
                                        */}

                                        <Icon
                                            reverse
                                            name={ item.FECHA_FINALIZACION ? 'edit' : 'check' }
                                            type='font-awesome'
                                            color={ item.FECHA_FINALIZACION ? 'rgb(62, 128, 217)' : 'rgb(111, 208, 77)' }
                                            size={20}
                                            onPress={ () =>{

                                                if (!this.state.incidente_finalizado) {

                                                    this.setState({ isModalVisible: !this.state.isModalVisible })

                                                    AsyncStorage.setItem('@AVE2:ACTIVIDAD_INCIDENTE_ID', (item.ID_CORRELATIVO).toString())
                                                    .then((valor) => {

                                                        //Obtener el comentario de la actividad
                                                        let body = JSON.stringify(
                                                            {
                                                                name: 'editUserActivity',
                                                                param: {
                                                                    activityID: item.ID_CORRELATIVO
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
                                                                comentario: responseJson.response.result.COMENTARIO
                                                            })

                                                        })
                                                        .catch((error) => {

                                                            console.log(error);
                                                            this.setState({ isLoading: false })

                                                        });

                                                        //Fin de solicitud

                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                    })

                                                }
                                            }}
                                        />

                                    </View>

                                </View>

                                <Fecha fecha_finalizacion={item.FECHA_FINALIZACION} />

                                <Comentario comentario={item.COMENTARIO} />

                            </Card>

                        )
                        )
                    }
                    </ScrollView>
 
                </View>

            );

        }
    }


}

const Comentario = (props) => {

    if (props.comentario != null) {

        return (

            <View style={{ backgroundColor: 'rgb(241, 240, 123)', borderWidth: 2, borderColor: 'black', borderRadius: 10, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5}}>
                <Text style={{ fontWeight: 'bold'}}>Comentario</Text>
                <Text style={{ textAlign: 'justify'}}>{ props.comentario }</Text>
            </View>

        )

    }else {

        return (

            <View>
            </View>

        )
    }

}

const Fecha = (props) => {

    if (props.fecha_finalizacion != null) {

        return (
            <View style={{ paddingTop: 10}}>
                <Text style={{ fontWeight: 'bold'}}>
                    {props.fecha_finalizacion}
                </Text>
            </View>
        )

    }else{

        return (

            <View>
            </View>

        )

    }

}

const Boton = (props) => {

    if (props.fecha_finalizacion == null) {

        return (
            <Icon
                reverse
                name='check'
                type='font-awesome'
                color='rgb(111, 208, 77)'
                size={20}
                onPress={ () => {

                    AsyncStorage.setItem('@AVE2:ACTIVIDAD_INCIDENTE_ID', (props.id_actividad).toString())
                    .then((valor) => {

                        //Actions.editar_actividad_incidente()
                        this.setState({
                            isModalVisible: true
                        })

                    })
                    .catch((error) => {

                        console.log(error);

                    })


                }}
            />
        )

    }else{

        return (

            <Icon
                reverse
                name='edit'
                type='font-awesome'
                color='rgb(62, 128, 217)'
                size={20}
                onPress={ () => {

                    AsyncStorage.setItem('@AVE2:ACTIVIDAD_INCIDENTE_ID', (props.id_actividad).toString())
                    .then((valor) => {

                        Actions.editar_actividad_incidente()

                    })
                    .catch((error) => {

                        console.log(error);

                    })

                }}
            />

        )

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)'

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
    inputMultiline: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        alignItems: 'flex-start',
        height: 200,
        textAlignVertical: 'top'
    },

});
