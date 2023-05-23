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
    ScrollView
} from 'react-native';

import { List, ListItem, SearchBar, Card, Button, Icon, CheckBox } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import AwesomeAlert from 'react-native-awesome-alerts'

export default class SinConexion extends React.Component {

    constructor(props){
        super(props);

        this.state = {

            isLoading: false,
            isOffline: false,
            data: ''

        }
    }

    componentDidMount(){

        this.getContent()

    }

    getContent(){

        this.setState({ isLoading: true })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            if (valor != null) {

                let body = JSON.stringify(
                    {
                        name: 'contenidoSinConexion',
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

                    {/* Los datos obtenidos se deberan de registrar en el dispostivo
                        para que sean consultados sin una conexion a internet */}

                    if (!this.state.isOffline) {

                        this.setState({

                            isLoading: false,
                            isOffline: false,
                            data: responseJson.response.result

                        })

                        {/* Registrar en la base de datos del dispositivo */}

                        AsyncStorage.setItem('@AVE2:USER_MESSAGES', JSON.stringify(responseJson.response.result))
                        .then((valor) => {

                            // console.warn('Mensajes registrar en base de datos');

                        })
                        .catch((error) => {

                            // console.warn('No se pudieron registrar los mensajes en la base de datos del dispositivo');

                        })

                    }

                })
                .catch((error) => {

                    this.setState({

                        isLoading: false,
                        isOffline: true

                    })

                    // console.warn('No existe una conexion a internet');

                    AsyncStorage.getItem('@AVE2:USER_MESSAGES')
                    .then((valor) => {

                        this.setState({ data: JSON.parse(valor) })

                        // console.warn(valor);

                    })
                    .catch((error) => {

                        // console.warn('No se pueden obtener los mensajes de la base de datos');

                    })

                });

            }else{

                this.setState({
                    isLoading: false
                })
                // console.warn('No existe un id de usuario');

            }

        })
        .catch((error) => {

            this.setState({ isLoading: false })
            // console.warn('No se pudo obtener el id del usuario' + error);

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

            let items = this.state.data || []

            if (this.state.isOffline) {

                return (
                    <View style={{ flex: 1, backgroundColor: '#ffffff'}}>

                        <ScrollView
                            style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                            showsVerticalScrollIndicator={true}
                            scrollsToTop={false}
                        >

                            {
                                items.map((item, key)=>(
                                    
                                    <Card
                                        title={item.NOMBRE}
                                        containerStyle={{
                                            borderRadius: 10,
                                            borderColor: '#d83838',
                                            borderWidth: 2
                                        }}
                                        titleStyle={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}
                                        key={key}
                                    >

                                    <Text style={{ fontWeight: 'bold', marginBottom: 5, color: 'black' }}>
                                        Notificación que recibirá
                                    </Text>

                                        <List containerStyle={{
                                            marginTop: 0,
                                            flex: 1,
                                            borderBottomColor: '#d2d4d8',
                                            borderWidth: 0,
                                            borderColor: 'white'
                                        }}>

                                        {
                                            item.MENSAJES.map((mensaje, key)=>(
                                                <ListItem
                                                    title={mensaje.MENSAJE}
                                                    titleStyle={{ fontSize: 12, fontWeight: 'bold' }}
                                                    titleNumberOfLines={100}
                                                    leftIcon={{
                                                        name: 'envelope-o',
                                                        type: 'font-awesome',
                                                        color: 'green'

                                                    }}
                                                    key={key}
                                                    hideChevron={true}
                                                    containerStyle={{
                                                        borderTopWidth: 2,
                                                        borderRightWidth: 2,
                                                        borderLeftWidth: 2,
                                                        borderTopColor: '#d2d4d8',
                                                        borderRightColor: '#d2d4d8',
                                                        borderLeftColor: '#d2d4d8',
                                                        marginBottom: 10,
                                                        marginLeft: 10,
                                                        marginRight: 10,
                                                        marginTop: 10,
                                                        backgroundColor: 'white',
                                                    }}
                                                />

                                            ))
                                        }

                                        </List>

                                    <Text style={{ fontWeight: 'bold', marginBottom: 5, marginTop: 5, color: 'black' }}>
                                        Actividades que debe ejecutar
                                    </Text>

                                    <View>
                                        <List containerStyle={{
                                            marginTop: 0,
                                            flex: 1,
                                            borderBottomColor: '#d2d4d8',
                                            borderWidth: 0,
                                            borderColor: 'white'
                                        }}>

                                        {
                                            item.ACTIVIDADES.map((actividad, key)=>(
                                                <ListItem
                                                    title={actividad.NOMBRE}
                                                    titleStyle={{ fontSize: 12, fontWeight: 'bold' }}
                                                    titleNumberOfLines={10}
                                                    subtitle={actividad.DESCRIPCION}
                                                    subtitleNumberOfLines={100}
                                                    subtitleStyle={{ fontSize: 12 }}
                                                    leftIcon={{
                                                        name: 'check-square-o',
                                                        type: 'font-awesome',
                                                        color: 'green'

                                                    }}
                                                    key={key}
                                                    hideChevron={true}
                                                    containerStyle={{
                                                        borderTopWidth: 2,
                                                        borderRightWidth: 2,
                                                        borderLeftWidth: 2,
                                                        borderTopColor: '#d2d4d8',
                                                        borderRightColor: '#d2d4d8',
                                                        borderLeftColor: '#d2d4d8',
                                                        marginBottom: 10,
                                                        marginLeft: 10,
                                                        marginRight: 10,
                                                        marginTop: 10,
                                                        backgroundColor: 'white',
                                                    }}
                                                />

                                            ))
                                        }

                                        </List>
                                    </View>

                                </Card>
                                
                                ))
                            }

                        </ScrollView>

                        <View style={{ backgroundColor: 'red', justifyContent: 'center', alignItems:'center'}}>
                            <Text style={{ color: 'white', fontSize: 20}} >Contenido sin conexión
                            </Text>
                        </View>

                    </View>
                );

            }else{

                return (
                    <View style={{ flex: 1, backgroundColor: '#ffffff'}}>

                        <ScrollView
                            style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                            showsVerticalScrollIndicator={true}
                            scrollsToTop={false}
                        >

                            {
                                items.map((item, key)=>(
                                    
                                    <Card
                                        title={item.NOMBRE}
                                        containerStyle={{
                                            borderRadius: 10,
                                            borderColor: '#d2d4d8',
                                            borderWidth: 2
                                        }}
                                        titleStyle={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}
                                        key={key}
                                    >

                                    <Text style={{ fontWeight: 'bold', marginBottom: 5, color: 'black' }}>
                                        Notificación que recibirá
                                    </Text>

                                        <List containerStyle={{
                                            marginTop: 0,
                                            flex: 1,
                                            borderBottomColor: '#d2d4d8',
                                            borderWidth: 0,
                                            borderColor: 'white'
                                        }}>

                                        {
                                            item.MENSAJES.map((mensaje, key)=>(
                                                <ListItem
                                                    title={mensaje.MENSAJE}
                                                    titleStyle={{ fontSize: 12, fontWeight: 'bold' }}
                                                    titleNumberOfLines={100}
                                                    leftIcon={{
                                                        name: 'envelope-o',
                                                        type: 'font-awesome',
                                                        color: 'green'

                                                    }}
                                                    key={key}
                                                    hideChevron={true}
                                                    containerStyle={{
                                                        borderTopWidth: 2,
                                                        borderRightWidth: 2,
                                                        borderLeftWidth: 2,
                                                        borderTopColor: '#d2d4d8',
                                                        borderRightColor: '#d2d4d8',
                                                        borderLeftColor: '#d2d4d8',
                                                        marginBottom: 10,
                                                        marginLeft: 10,
                                                        marginRight: 10,
                                                        marginTop: 10,
                                                        backgroundColor: 'white',
                                                    }}
                                                />

                                            ))
                                        }

                                        </List>

                                    <Text style={{ fontWeight: 'bold', marginBottom: 5, marginTop: 5, color: 'black' }}>
                                        Actividades que debe ejecutar
                                    </Text>

                                    <View>
                                        <List containerStyle={{
                                            marginTop: 0,
                                            flex: 1,
                                            borderBottomColor: '#d2d4d8',
                                            borderWidth: 0,
                                            borderColor: 'white'
                                        }}>

                                        {
                                            item.ACTIVIDADES.map((actividad, key)=>(
                                                <ListItem
                                                    title={actividad.NOMBRE}
                                                    titleStyle={{ fontSize: 12, fontWeight: 'bold' }}
                                                    titleNumberOfLines={10}
                                                    subtitle={actividad.DESCRIPCION}
                                                    subtitleNumberOfLines={100}
                                                    subtitleStyle={{ fontSize: 12 }}
                                                    leftIcon={{
                                                        name: 'check-square-o',
                                                        type: 'font-awesome',
                                                        color: 'green'

                                                    }}
                                                    key={key}
                                                    hideChevron={true}
                                                    containerStyle={{
                                                        borderTopWidth: 2,
                                                        borderRightWidth: 2,
                                                        borderLeftWidth: 2,
                                                        borderTopColor: '#d2d4d8',
                                                        borderRightColor: '#d2d4d8',
                                                        borderLeftColor: '#d2d4d8',
                                                        marginBottom: 10,
                                                        marginLeft: 10,
                                                        marginRight: 10,
                                                        marginTop: 10,
                                                        backgroundColor: 'white',
                                                    }}
                                                />

                                            ))
                                        }

                                        </List>
                                    </View>

                                </Card>
                                
                                ))
                            }
                       
                        </ScrollView>

                    </View>
                );

            }

        }

    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)'

    },

});
