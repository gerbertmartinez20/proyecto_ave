import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    RefreshControl,
    FlatList,
    TouchableOpacity
} from 'react-native';

import { Icon, List, ListItem, SearchBar, Badge } from 'react-native-elements'

import { Fab } from 'native-base';

import { Actions } from 'react-native-router-flux';

import AwesomeAlert from 'react-native-awesome-alerts';

import Swipeable from 'react-native-swipeable';

import CheckAdmin from '../functions/checkAdmin';

export default class ListaAlertas extends React.Component {

    _isMounted = false

    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
            sendingNotifications: false,
            data: [],
            isUserAdmin: false,
            isSwiping: false
        }
    }

    async componentDidMount(){

        this._isMounted = true

        this.getData()

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
        
        let check = new CheckAdmin()
        let userAdmin = await check.check(id_usuario)

        this.setState({
            isUserAdmin: userAdmin
        })

    }

    UNSAFE_componentWillReceiveProps(nextProps){
        
        this.getData()

    }

    // renderRow ({ item }) {
    //     return (
            
    //     )
    // }
    
    componentWillUnmount(){

        this._isMounted = false

    }


    getData(){

        if (this._isMounted) {
            
            AsyncStorage.getItem('@AVE2:USER_ADMIN')
            .then((valor) => {

                if (valor != null) {

                    this.setState({ isUserAdmin: true })

                }

            })
            .catch((error) => {


            })

            this.setState({
                isLoading: true
            })

            AsyncStorage.getItem('@AVE2:USER_ID')
            .then((valor) => {

                let body = JSON.stringify(
                    {
                        name: 'getAlerts',
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

                    this.setState({ isLoading: false, data: responseJson.response.result })

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

    _onRefresh = () => {

        this.setState({
            isRefreshing: true
        })

        AsyncStorage.getItem('@AVE2:USER_ID')
            .then((valor) => {

                let body = JSON.stringify(
                    {
                        name: 'getAlerts',
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

                    this.setState({ isRefreshing: false, data: responseJson.response.result })

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

    render() {

        if (this.state.isLoading) {
            
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>
            );

        }else{

            if (this.state.data.length <= 0) {
                
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
                                onPress={ () => this.getData() }
                                size={30}
                            />
                        </View>

                        <Fab
                            containerStyle={{}}
                            position="bottomRight"
                            onPress={() => Actions.crear_alerta() }
                        >
                                <Icon 
                                    reverse
                                    name='plus'
                                    type='font-awesome'
                                    color='blue'
                                    size={14}
                                />
                        </Fab>

                    </View>

                )


            }else{

                let items = this.state.data || []

                return (
                    <View style={styles.container}>
                        < SearchBar
                            value={this.state.searchText}
                            // onChangeText={ (searchText) => {

                            //     this.setState({searchText})

                            //     this.setState({ searching: true })

                            //     AsyncStorage.getItem('@AVE2:USER_ID')
                            //     .then((valor) => {

                            //         let body = JSON.stringify(
                            //             {
                            //                 name: 'searchProtocols',
                            //                 param: {
                            //                     userID: valor,
                            //                     textSearch: this.state.searchText
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

                            //             this.setState({ searching: false })
                            //             this.setState({ data: responseJson.response.result })

                            //         })
                            //         .catch((error) => {

                            //             console.warn(error);

                            //         });

                            //     })
                            //     .catch((error) => {

                            //         this.setState({ isLoading: 0 })

                            //     })

                            // }}
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

                        <List containerStyle={{
                            marginTop: 0,
                            flex: 1,
                            borderBottomColor: '#d2d4d8',
                            borderWidth: 0
                        }}>
                            <ScrollView
                                style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                                contentContainerStyle={{ borderWidth: 0}}
                                showsVerticalScrollIndicator={false}
                                scrollsToTop={false}
                                scrollEnabled={ !this.state.isSwiping }
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={ this._onRefresh }
                                    />
                                }
                            >

                                {
                                    items.map((item, key)=>(

                                        <Swipeable
                                            leftButtons={ 
                                                [
                                                    <TouchableOpacity  
                                                        style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'red', paddingRight: 25, marginTop: 10, marginBottom: 10, borderRadius: 10 }}
                                                        onPress={ () => {

                                                            if (this.state.isUserAdmin) {
                                                                
                                                                Alert.alert(
                                                                    'Eliminar Alerta',
                                                                    '¿Está seguro? una vez eliminada no se podra recuperar',
                                                                    [
                                                                        {text: 'Si', onPress: () => {

                                                                            console.log('Eliminar alerta')

                                                                            let body = JSON.stringify(
                                                                                {
                                                                                    name: 'deleteAlert',
                                                                                    param: {
                                                                                        alertID: item.ID_ALERTA
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

                                                                                this.getData()
                                                                                
                                                                            })

                                                                        }},
                                                                        {text: 'Cancelar'},
                                                                    ],
                                                                    {cancelable: true}
                                                                )

                                                            }

                                                        }}

                                                    >
                                                        <Icon 
                                                            name='trash-o'
                                                            color='white'
                                                            type='font-awesome'
                                                            size={30}
                                                        />
                                                    </TouchableOpacity>
                                                ]
                                            }
                                            key={key}
                                            onSwipeStart={ () => this.setState({ isSwiping: true }) }
                                            onSwipeRelease={ () => this.setState({ isSwiping: false }) }
                                        >

                                            <ListItem
                                                title={item.NOMBRE}
                                                titleStyle={{ fontWeight: 'bold' }}
                                                avatarStyle={{
                                                    backgroundColor: 'rgb(255, 255, 255)'
                                                }}
                                                key={key}
                                                subtitle={
                                                        <View style={{ flex: 1, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
    
                                                            {/* Mensaje que se envia en la alerta */}
                                                            <View style={{ flex: 1,  backgroundColor: 'rgb(252, 250, 196)', borderWidth: 2, borderColor: 'black', borderRadius: 10, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, marginBottom: 10}}>
                                                                <Text style={{ textAlign: 'justify'}}>{ item.MENSAJE }</Text>
                                                            </View>
                                                        </View>
                                                }
                                                onPress={()=>{
                                                    Actions.editar_alerta({ id_alerta: item.ID_ALERTA })
                                                }}
                                                //subtitle={
                                                //     <View style={{ flex: 1, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>

                                                //         {/* Mensaje que se envia en la alerta */}
                                                //         <View style={{ flex: 1,  backgroundColor: 'rgb(252, 250, 196)', borderWidth: 2, borderColor: 'black', borderRadius: 10, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5}}>
                                                //             <Text style={{ textAlign: 'justify'}}>{ item.MENSAJE }</Text>
                                                //         </View>

                                                //         <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10 }}>

                                                //             {/* Eliminar */}
                                                //             <Icon 
                                                //                 reverse
                                                //                 raised
                                                //                 name='trash-o'
                                                //                 type='font-awesome'
                                                //                 color='red'
                                                //                 size={14}
                                                //                 disabled={!this.state.isUserAdmin}
                                                //                 onPress={ () => {

                                                //                     Alert.alert(
                                                //                         'Eliminar Alerta',
                                                //                         '¿Está seguro?, una vez eliminada no se podra recuperar',
                                                //                         [
                                                //                             {text: 'Si', onPress: () => {

                                                //                                 console.log('Eliminar alerta')

                                                //                                 let body = JSON.stringify(
                                                //                                     {
                                                //                                         name: 'deleteAlert',
                                                //                                         param: {
                                                //                                             alertID: item.ID_ALERTA
                                                //                                         }
                                                //                                     }
                                                //                                 )
                                                
                                                //                                 fetch('https://udicat.muniguate.com/apps/ave_api/', {
                                                //                                     method: 'POST',
                                                //                                     headers: {
                                                //                                         'CONTENT-TYPE': 'application/json'
                                                //                                     },
                                                //                                     body: body
                                                //                                 })
                                                //                                 .then((response) => response.json())
                                                //                                 .then((responseJson) => {

                                                //                                     this.getData()
                                                                                    
                                                //                                 })

                                                //                             }},
                                                //                             {text: 'Cancelar'},
                                                //                         ],
                                                //                         {cancelable: true}
                                                //                     )
                                                //                 }}
                                                //             />

                                                //             {/* Editar */}
                                                //             <Icon 
                                                //                 reverse
                                                //                 raised
                                                //                 name='edit'
                                                //                 type='font-awesome'
                                                //                 color='green'
                                                //                 size={14}
                                                //                 disabled={!this.state.isUserAdmin}
                                                //                 onPress={()=>{
                                                //                     Actions.editar_alerta({ id_alerta: item.ID_ALERTA })
                                                //                 }}
                                                //             />

                                                //             {/* Historial */}

                                                //             {/* <Icon 
                                                //                 reverse
                                                //                 raised
                                                //                 name='history'
                                                //                 type='font-awesome'
                                                //                 color='yellow'
                                                //                 size={14}
                                                //                 onPress={()=>{
                                                //                     console.log('Historial de Envios')
                                                //                 }}
                                                //             /> */}

                                                //             {/* Enviar */}
                                                //             <Icon 
                                                //                 reverse
                                                //                 raised
                                                //                 name='send'
                                                //                 type='font-awesome'
                                                //                 color='blue'
                                                //                 size={14}
                                                //                 disabled={!this.state.isUserAdmin}
                                                //                 onPress={()=>{

                                                //                     Alert.alert(
                                                //                         'Enviar Alerta',
                                                //                         '¿Está seguro que desea enviar la alerta? Se notificará a todos los dispositivos',
                                                //                         [
                                                //                             { text: 'Si', onPress: () => {

                                                //                                 this.setState({
                                                //                                     sendingNotifications: true
                                                //                                 })

                                                //                                 let body = JSON.stringify(
                                                //                                     {
                                                //                                         id_alerta: item.ID_ALERTA
                                                //                                     }
                                                //                                 )
                                            
                                                //                                 fetch('https://udicat.muniguate.com/ave2_api/public/enviar_alerta_lista', {
                                                //                                     method: 'POST',
                                                //                                     headers: {
                                                //                                         'CONTENT-TYPE': 'application/json'
                                                //                                     },
                                                //                                     body: body
                                                //                                 })
                                                //                                 .then((response) => response.json())
                                                //                                 .then((responseJson) => {

                                                //                                     console.warn(responseJson)

                                                //                                     this.setState({
                                                //                                         sendingNotifications: false
                                                //                                     })

                                                //                                 })

                                                //                             }},
                                                //                             { text: 'No' }
                                                //                         ],
                                                //                         { cancelable: false }
                                                //                     )

                                                //                 }}
                                                //             />

                                                //             {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                //                 <Badge 
                                                //                     containerStyle={{ backgroundColor: 'yellow' }}
                                                //                     onPress={()=>{
                                                //                         console.log('Ver historial de alerta')
                                                //                     }}
                                                //                 >
                                                //                     <Text>HISTORIAL</Text>
                                                //                 </Badge>
                                                //             </View> */}

                                                //         </View>

                                                //     </View>
                                                // }
                                                containerStyle={{
                                                    borderRadius: 10,
                                                    borderTopWidth: 2,
                                                    borderRightWidth: 2,
                                                    borderBottomWidth: 2,
                                                    borderLeftWidth: 2,
                                                    borderTopColor: '#d2d4d8',
                                                    borderRightColor: '#d2d4d8',
                                                    borderBottomColor: '#d2d4d8',
                                                    borderLeftColor: '#d2d4d8',
                                                    marginBottom: 10,
                                                    marginLeft: 10,
                                                    marginRight: 10,
                                                    marginTop: 10
                                                }}
                                                hideChevron={true}
                                            />
                                        
                                        </Swipeable>
                                    ))    
                                }

                                {/* <FlatList
                                    data={this.state.data}
                                    renderItem={this.renderRow}
                                    keyExtractor={item => item.ID_ALERTA}
                                /> */}
                            </ScrollView>

                            <Fab
                                position="bottomRight"
                                onPress={() => {

                                    if (this.state.isUserAdmin) {
                                        
                                        this.onAgregarAlerta()

                                    }
                                    
                                }}
                            >
                                <Icon 
                                    reverse
                                    name='plus'
                                    type='font-awesome'
                                    color='blue'
                                    size={14}
                                />
                            </Fab>

                        </List>

                        <AwesomeAlert
                            show={this.state.sendingNotifications}
                            showProgress={true}
                            title="Enviando"
                            message="Por favor espere un momento!"
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                        />

                    </View>
                );

            }


        }

    }

    onAgregarAlerta(){

        Actions.crear_alerta()

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

});
