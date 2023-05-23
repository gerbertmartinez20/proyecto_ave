import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    RefreshControl,
    Alert
} from 'react-native';

import {  Card, Icon } from 'react-native-elements'

import { List, ListItem, Button } from 'react-native-elements'

import ViewMoreText from 'react-native-view-more-text';

export default class Notificaciones extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            data: '',
            invitaciones: '',
            isRefreshing: false
        };

    }

    componentDidMount(){

        this.getNotifications()

    }

    UNSAFE_componentWillReceiveProps(props){

        console.log('UNSAFE UPDATE');

        this.getNotifications()
    }

    renderViewMore(onPress){

        return(

            <Text style={{ color: 'blue' }} onPress={onPress}>Ver más</Text>

        )
    }

    renderViewLess(onPress){

        return(

            <Text style={{ color: 'blue' }} onPress={onPress}>Ver menos</Text>
            
        )
    }

    textoInvitacion(item){

        return(
            <View
                style={{ flex: 1, margin: 10 }}
            >
                <Text
                    style={{ fontWeight: 'bold' }}
                >
                    {item.PERSONA_INVITA + ' lo ha invitado a unirse al equipo ' + item.ORGANIZACION}
                </Text>

            </View>

        )

    }

    botones(invitacion){

        return(

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 20, marginTop: 10, paddingTop: 0 }}>

                <Button
                    rounded
                    backgroundColor='green'
                    icon={{name: 'check', type: 'font-awesome'}}
                    title='Aceptar' 
                    buttonStyle={{ padding: 5 }}
                    onPress={ () => {
                        this.aceptarInvitacion(invitacion)
                    }}
                />

                <Button
                    rounded
                    backgroundColor='red'
                    icon={{name: 'remove', type: 'font-awesome'}}
                    title='Rechazar' 
                    buttonStyle={{ padding: 5 }}
                    onPress={ () => {
                        this.rechazarInvitacion(invitacion)
                    }}
                />

            </View>

        )

    }

    aceptarInvitacion(invitacion){

        Alert.alert(
            'AVE',
            '¿Seguro que desea unirse al equipo?',
            [
                {text: 'Si', onPress: () => {

                    let body = JSON.stringify(
                        {
                            name: 'aceptarInvitacion',
                            param: {
                                id_invitacion: invitacion.ID_INVITACION,
                                id_persona: invitacion.ID_PERSONA,
                                id_organizacion: invitacion.ID_ORGANIZACION
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
                                'Agregado al equipo exitosamente',
                                [
                                    {text: 'OK', onPress: () => {

                                        this.getNotifications()

                                    }}
                                ],
                                {
                                    cancelable: false
                                }
                            )
                                                                
                        }
        
                    })
                    .catch((error) => {
                        
                        this.setState({
                            isLoadingTeam: false
                        })
                        
                    });

                }},
                {text: 'Cancelar'},
            ],
            {
                cancelable: false
            }
        )

    }

    rechazarInvitacion(invitacion){

        Alert.alert(
            'AVE',
            '¿Seguro que desea rechazar la invitación para unirse al equipo?',
            [
                {text: 'Si', onPress: () => {

                    let body = JSON.stringify(
                        {
                            name: 'rechazarInvitacion',
                            param: {
                                id_invitacion: invitacion.ID_INVITACION
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
                                'Invitación rechazada exitosamente',
                                [
                                    {text: 'OK', onPress: () => {

                                        this.getNotifications()

                                    }}
                                ],
                                {
                                    cancelable: false
                                }
                            )
                                                                
                        }
        
                    })
                    .catch((error) => {
                        
                        this.setState({
                            isLoadingTeam: false
                        })
                        
                    });

                }},
                {text: 'Cancelar'},
            ],
            {
                cancelable: false
            }
        )

    }

    render() {

        if (this.state.isLoading) {

            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>
            );

        }else{

            if(this.state.invitaciones <= 0 && this.state.data <= 0){

                return(

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                        <View>
                            <Icon 
                                name='page-search'
                                type='foundation'
                                size={100}
                            />
                        </View>

                        <View>
                            <Text>No se encontraron registros</Text>
                        </View>

                        <View>
                            <Icon 
                                name='refresh'
                                type='foundation'
                                onPress={ () => this.getNotifications() }
                                size={30}
                            />
                        </View>

                    </View>

                )

                // return (
                //     <View>
                //     </View>
                // )

            }else{

                let items = this.state.data
                let invitaciones = this.state.invitaciones

                return (

                    <View style={{ flex: 1, backgroundColor: '#ffffff'}}>

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


                        <List containerStyle={{
                            marginTop: 0,
                            flex: 1,
                            borderBottomColor: '#d2d4d8',
                            borderWidth: 0
                        }}>

                            {
                                invitaciones.map((invitacion, llave)=>(

                                    <ListItem
                                        roundAvatar
                                        avatar={{ uri: 'data:image/jpeg;base64,' + invitacion.AVATAR }}
                                        key={llave}
                                        titleNumberOfLines={10}
                                        title={ invitacion.PERSONA_INVITA + ' lo ha invitado a unirse al equipo ' + invitacion.ORGANIZACION }
                                        subtitle={

                                            this.botones(invitacion)

                                        }
                                        containerStyle={{
                                            borderRadius: 10,
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
                                        hideChevron
                                    />

                                ))


                            }

                        </List>

                        {

                            items.map((item, key)=>(

                                <Card
                                    title={item.PROTOCOLO}
                                    titleNumberOfLines={10}
                                    containerStyle={{
                                        borderRadius: 10,
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
                                    key={key}
                                >

                                    <View style={{ flex: 1, marginBottom: 10}}>

                                        {/* <Text
                                            numberOfLines={100}
                                            style={{ fontWeight: 'bold', textAlign: 'justify'}}
                                        >
                                            { item.MENSAJE }
                                        </Text> */}

                                        <ViewMoreText
                                            numberOfLines={3}
                                            renderViewMore={this.renderViewMore}
                                            renderViewLess={this.renderViewLess}
                                            textStyle={{ fontWeight: 'bold', textAlign: 'justify'}}
                                        >
                                            <Text>
                                                { item.MENSAJE }
                                            </Text>
                                        </ViewMoreText>


                                    </View>

                                    <View style={{ height: 40, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                            <Text>
                                                {item.FECHA_ENVIO}
                                            </Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon
                                                reverse
                                                name='envelope-open'
                                                type='font-awesome'
                                                color='#2089dc'
                                                size={20}
                                                onPress={ () => {

                                                    Alert.alert(
                                                        'AVE',
                                                        '¿Está seguro que desea marcar el mensaje como leído?',
                                                        [
                                                            {text: 'Si', onPress: () => {

                                                                let body = JSON.stringify(
                                                                    {
                                                                        name: 'setNotificationReaded',
                                                                        param: {
                                                                            logID: item.ID_LOG
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

                                                                    this.getNotifications()

                                                                })
                                                                .catch((error) => {

                                                                    console.log(error);

                                                                });

                                                            }},
                                                            {text: 'Cancelar'}
                                                        ],
                                                        {cancelable: false} 
                                                    )

                                                }}
                                            />
                                        </View>

                                    </View>
                                </Card>

                            ))
                        }

                        </ScrollView>

                    </View>

                )

            }
        }

    }

    _onRefresh = () => {

        this.setState({ isRefreshing: true })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getNotifications2',
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

                console.log(responseJson.response.result)

                this.setState({ 
                    isRefreshing: false, 
                    data: responseJson.response.result[0],
                    invitaciones: responseJson.response.result[1]
                })

            })
            .catch((error) => {

                this.setState({ isRefreshing: false })

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

            this.setState({ isRefreshing: false })

        })

    }

    getNotifications(){

        this.setState({ isLoading: true })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getNotifications2',
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

                console.log(responseJson.response.result)

                this.setState({ 
                    isLoading: false, 
                    data: responseJson.response.result[0],
                    invitaciones: responseJson.response.result[1]
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

        })

    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

});
