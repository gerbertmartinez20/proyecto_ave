import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    RefreshControl,
    Alert,
    TouchableOpacity
} from 'react-native';

import { List, ListItem, SearchBar, Card, Button, Icon } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import AwesomeAlert from 'react-native-awesome-alerts'

export default class NotificacionesReaded extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            data: '',
            isRefreshing: false,
            alerta_limpiar: false
        };

    }

    componentDidMount(){

        this.getNotifications()

    }

    componentDidUpdate(prevProps){

        if (this.props.limpiar != prevProps.limpiar) {
            
            console.log('limpiar')
        
            if (this.state.data.length > 0) {
                
                this.setState({
                    alerta_limpiar: true
                })

            }
            
        }

    }

    // UNSAFE_componentWillReceiveProps(props){

    //     console.warn('UNSAFE UPDATE');

    //     this.getNotifications()
    // }

    render() {

        if (this.state.isLoading) {

            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>
            );

        }else{

            if(this.state.data <= 0){

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

            }else{

                let items = this.state.data || []

                return (

                    <View style={{height: 30, flex: 1, backgroundColor: '#ffffff'}}>

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
                                    title={item.PROTOCOLO}
                                    titleNumberOfLines={10}
                                    containerStyle={{
                                        borderRadius: 10,
                                        borderTopColor: '#d2d4d8',
                                        borderRightColor: '#d2d4d8',
                                        borderBottomColor: '#d2d4d8',
                                        borderLeftColor: '#d2d4d8',
                                        borderColor: '#d2d4d8',
                                        borderWidth: 2
                                    }}
                                    key={key}
                                >

                                <View style={{ flex: 1, marginBottom: 10}}>

                                    <Text
                                        numberOfLines={100}
                                        style={{ fontWeight: 'bold', textAlign: 'justify'}}
                                    >
                                        { item.MENSAJE }
                                    </Text>

                                </View>

                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{ marginBottom: 10}}>
                                                {item.FECHA_ENVIO}
                                            </Text>
                                        </View>



                                    </View>
                                </Card>

                            )
                            )
                        }
                        </ScrollView>
            
                        <AwesomeAlert
                            show={this.state.alerta_limpiar}  
                            showProgress={this.state.limpiando}     
                            title="Limpiar Notificaciones"
                            message="¿Está seguro? Una vez eliminadas no se podrán recuperar."
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                            showCancelButton={true}
                            showConfirmButton={true}
                            cancelText="Cancelar"
                            confirmText={ this.state.limpiando ? 'Limpiando...' : 'Limpiar' }
                            confirmButtonColor={ this.state.limpiando ? '#D0D0D0' : '#DD6B55' }
                            onCancelPressed={() => {

                                if (!this.state.limpiando) {
                                    
                                    this.setState({
                                        alerta_limpiar: false
                                    })

                                    Actions.refresh({ limpiar: false })

                                }

                            }}
                            onConfirmPressed={() => {

                                this.limpiarNotificaciones()

                            }}
                        />

                        <AwesomeAlert
                            show={this.state.notificaciones_limpiadas}
                            title="La bandeja de notificaciones ha sido limpiada exitosamente."
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                            showConfirmButton={true}
                            confirmButtonColor="#DD6B55"
                            confirmText="Aceptar"
                            onConfirmPressed={() => {

                                this.getNotifications()

                                this.setState({
                                    notificaciones_limpiadas: false
                                })

                            }}
                        />

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
                    name: 'getNotificationsReaded',
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

    getNotifications(){

        this.setState({ isLoading: true })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getNotificationsReaded',
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

                this.setState({ isLoading: false, data: responseJson.response.result })

                // Si no existen datos no mostrar el boton para limpiar
                if (this.state.data.length <= 0) {
                    
                    Actions.refresh({ rightTitle: '' })

                }

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

    async limpiarNotificaciones(){

        if (!this.state.limpiando) {
            
            this.setState({
                limpiando: true
            })
    
            const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
    
            let body = JSON.stringify(
                {
                    name: 'limpiarNotificaciones',
                    param: {
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
                    limpiando: false,
                    alerta_limpiar: false,
                    notificaciones_limpiadas: true
                })

            })
            .catch((error) => {

                this.setState({ isLoading: false })

            });
            
        }

    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

});
