import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Alert
} from 'react-native';

import { List, ListItem, SearchBar, Icon, CheckBox } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import ViewMoreText from 'react-native-view-more-text';

import { Fab } from 'native-base';

import Swipeable from 'react-native-swipeable';

import CheckAdmin from '../functions/checkAdmin';

import AwesomeAlert from 'react-native-awesome-alerts';

export default class Mensajes extends React.Component {

    elevation = 10
    shadow_height = 2

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            data: '',
            isRefreshing: false,
            searchText: '',
            searching: false,
            isUserAdmin: false,
            isSwiping: false,
            administrador: false,
            checkEliminar: false,
            notAdministrador: false,
            mensajes_eliminar: [],
            alerta_eliminar: false,
            alerta_eliminar: false,
            eliminada: false
        };

    }

    async componentDidMount(){

        this.getMensajes(true)

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
        
        let check = new CheckAdmin()
        let userAdmin = await check.check(id_usuario)

        this.setState({
            isUserAdmin: userAdmin
        })

    }

    componentDidUpdate(prevProps){

        if (this.props.editando != prevProps.editando) {
            
            if (!this.state.administrador) {
                
                this.setState({
                    notAdministrador: true
                }) 

            }else{

                this.setState({

                    checkEliminar: this.props.editando

                })
                
                if (this.props.editando) {
                    
                    Actions.refresh({ rightTitle: "Cancelar" })

                    let mensajes = this.state.data

                    mensajes.forEach(element => {
                        
                        //Desmarcar los elementos en la lista
                        element.ELIMINAR = false

                    });

                    this.setState({

                        mensajes_eliminar: [],
                        data: mensajes

                    })

                }else{

                    Actions.refresh({ rightTitle: "Editar" })

                }

            }

        }

        if (this.props.mensaje_agregado != prevProps.mensaje_agregado) {
            
            this.getMensajes(true)

            Actions.refresh({ mensaje_agregado: false })

        }

    }

    checkEliminar(item){

        if (this.state.checkEliminar) {
            
            let mensaje = item

            return(

                <CheckBox 
                    center
                    size={30}
                    checked={mensaje.ELIMINAR}
                    containerStyle={{
                        backgroundColor: 'white',
                        borderColor: 'white',
                        padding: 0,
                        margin: 0
                    }}
                    checkedIcon='check-circle-o'
                    uncheckedIcon='circle-o'
                    title={
                        <View>

                        </View>
                    }
                    onPress={ () =>{

                        mensaje.ELIMINAR = !mensaje.ELIMINAR

                        if (mensaje.ELIMINAR) {
                            
                            let mensajes_eliminar = this.state.mensajes_eliminar

                            mensajes_eliminar.push(mensaje.ID_MENSAJE)

                            this.setState({

                                mensajes_eliminar: mensajes_eliminar

                            })

                        }else{

                            let mensajes_eliminar = this.state.mensajes_eliminar

                            mensajes_eliminar.splice(mensajes_eliminar.indexOf(mensaje.ID_MENSAJE), 1)

                            this.setState({

                                mensajes_eliminar: mensajes_eliminar

                            })

                        }

                    }}
                />

            )

        }

    }

    barraEliminar(){

        if (this.props.editando && this.state.administrador) {
            
            return (
                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgb(16, 6, 159)' }}>

                    { this.botonMarcarTodos() }
                    { this.botonEliminar() }

                </View>
            )

        }   

    }

    botonMarcarTodos(){

        if (this.state.mensajes_eliminar.length < this.state.data.length) {
            
            return(

                <TouchableOpacity onPress={ () => {
    
                    let mensajes = this.state.data
                    let mensajes_marcados = []
    
                    mensajes.forEach(element => {
                        
                        // Llenar el array con los ID de las actividades
                        mensajes_marcados.push(element.ID_MENSAJE)

                        //Marcar los elementos en la lista
                        element.ELIMINAR = true

                    });
    
                    this.setState({
    
                        mensajes_eliminar: mensajes_marcados,
                        data: mensajes
    
                    })
        
                }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Marcar Todas</Text>
                </TouchableOpacity>

            )

        }else{

            return (
                <TouchableOpacity onPress={ () => {

                    let mensajes = this.state.data

                    mensajes.forEach(element => {
                        
                        //Desmarcar los elementos en la lista
                        element.ELIMINAR = false

                    });

                    this.setState({

                        mensajes_eliminar: [],
                        data: mensajes

                    })

                }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Desmarcar Todas</Text>
                </TouchableOpacity>
            )

        }

    }

    botonEliminar(){

        if (this.state.mensajes_eliminar.length > 0) {
            
            return(

                <TouchableOpacity onPress={ () => {

                    this.setState({
                        alerta_eliminar: true
                    })

                }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Eliminar</Text>
                </TouchableOpacity>

            )

        }

    }

    eliminarMensajes(){

        console.log(this.state.mensajes_eliminar)

        if (!this.state.eliminando) {
            
            this.setState({

                eliminando: true

            })

            let body = JSON.stringify(
                {
                    name: 'deleteMessage2',
                    param: {
                        id_mensajes: this.state.mensajes_eliminar
                    }
                }
            )

            console.log(body)

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

                    this.setState({
                        alerta_eliminar: false,
                        equipo_eliminado: true,
                        eliminando: false,
                        mensajes_eliminar: [],
                    })

                }

            })
            .catch((error) => {

                console.log(error)

            });

        }

    }

    // UNSAFE_componentWillReceiveProps(props){

    //     console.log('UNSAFE UPDATE');

    //     this.getMensajes()
    // }

    renderViewMore(onPress){

        return(

            <Text style={{ fontSize: 12, color: 'blue', paddingTop: 5 }} onPress={onPress}>Ver más</Text>

        )
    }

    renderViewLess(onPress){

        return(

            <Text style={{ fontSize: 12, color: 'blue', paddingTop: 5 }} onPress={onPress}>Ver menos</Text>
            
        )
    }

    renderSubtitle(description, id_mensaje){

        if (description) {
            
            return(

                <View style={{ flex: 1, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                    <ViewMoreText
                        numberOfLines={2}
                        renderViewMore={this.renderViewMore}
                        renderViewLess={this.renderViewLess}
                        textStyle={{ fontSize: 12, textAlign: 'justify'}}
                    >
                        <Text>
                            { description }
                        </Text>
                    </ViewMoreText>

                </View> 

            )

        }else{

            return (

                <View>
                </View>

            )
        }

    }

    render() {

        if (this.state.isLoading) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

        }else{

            if (this.state.data <= 0  && this.state.searchText == '') {
                
                if (this.state.searching) {
                    
                    return (
                    <View style={ styles.container }>

                        < SearchBar
                            value={this.state.searchText}
                            onChangeText={ (searchText) => {

                                this.setState({searchText})

                                this.setState({ searching: true })

                                AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')
                                .then((valor) => {

                                    let body = JSON.stringify(
                                        {
                                            name: 'searchMessages',
                                            param: {
                                                protocolID: valor,
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

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <ActivityIndicator size='large' />

                        </View>
                        
                        <Fab
                            containerStyle={{}}
                            position="bottomRight"
                            onPress={() => this.onAgregarMensaje() }
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

                    return (

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>

                            <View>
                                <Icon 
                                    name='page-search'
                                    type='foundation'
                                    size={100}
                                />
                            </View>

                            <View>
                                <Text>Aún no se han registrado mensajes</Text>
                            </View>

                            <View>
                                <Icon 
                                    name='refresh'
                                    type='foundation'
                                    onPress={ () => this.getMensajes() }
                                    size={30}
                                />
                            </View>

                            {/* <Fab
                                containerStyle={{}}
                                position="bottomRight"
                                onPress={() => this.onAgregarMensaje() }
                            >
                                <Icon 
                                    reverse
                                    name='plus'
                                    type='font-awesome'
                                    color='blue'
                                    size={14}
                                />    
                            </Fab> */}
                            { this.botonAgregar() }

                        </View>

                    );

                }

            }else if(this.state.data <= 0 && this.state.searchText != ''){
            
                return (

                    <View style={ styles.container }>
                        
                        < SearchBar
                            value={this.state.searchText}
                            onChangeText={ (searchText) => {

                                this.setState({searchText})

                                this.setState({ searching: true })

                                AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')
                                .then((valor) => {

                                    let body = JSON.stringify(
                                        {
                                            name: 'searchMessages',
                                            param: {
                                                protocolID: valor,
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

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View>
                                <Icon 
                                    name='page-search'
                                    type='foundation'
                                    size={100}
                                />
                            </View>

                            <View>
                                <Text> No se han encontrado registros</Text>
                            </View>
                        </View>

                        {/* <Fab
                            containerStyle={{}}
                            position="bottomRight"
                            onPress={() => this.onAgregarMensaje() }
                        >
                            <Icon 
                                reverse
                                name='plus'
                                type='font-awesome'
                                color='blue'
                                size={14}
                            />    
                        </Fab> */}
                        { this.botonAgregar() }

                    </View>

                )

            }else{

                let items = this.state.data || []

                return(

                    <View style={ styles.container }>

                    < SearchBar
                        value={this.state.searchText}
                        onChangeText={ (searchText) => {

                            this.setState({searchText})

                            this.setState({ searching: true })

                            AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')
                            .then((valor) => {

                                let body = JSON.stringify(
                                    {
                                        name: 'searchMessages',
                                        param: {
                                            protocolID: valor,
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

                        <List containerStyle={{
                            marginTop: 0,
                            flex: 1,
                            borderBottomColor: '#d2d4d8',
                            borderWidth: 0
                        }}>
                            <ScrollView
                                style={{ backgroundColor: 'white'}}
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

                                        <ListItem
                                            // title={item.NOMBRE}
                                            title={
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 10 }}>
                                                    { item.NOMBRE }
                                                </Text>
                                            }
                                            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                            subtitle={
                                                this.renderSubtitle(item.MENSAJE, item.ID_MENSAJE)
                                            }
                                            avatar={ item.ESTADO == 'A' ?  require('../images/message_activate.png') : require('../images/message_desactivate.png') }
                                            avatarStyle={{
                                                backgroundColor: 'rgb(255, 255, 255)'
                                            }}
                                            key={key}
                                            leftIcon={
                                                this.checkEliminar(item)
                                            }
                                            hideChevron={true}
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
                                                backgroundColor: 'white'
                                            }}
                                            onPress={ detailMessage = () => {
                            
                                                AsyncStorage.setItem('@AVE2:MENSAJE_ID', (item.ID_MENSAJE).toString())
                                                .then((valor) => {
                            
                                                    Actions.detalles_mensaje()
                            
                                                })
                                                .catch((error) => {
                            
                                                    console.warn(error);
                            
                                                })
                            
                            
                                            }}
                        
                                        />

                                        // <Swipeable
                                        //     leftButtons={ 
                                        //     [
                                        //         <TouchableOpacity  
                                        //             style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'red', paddingRight: 25, marginTop: 10, marginBottom: 10, borderRadius: 10 }}
                                        //             onPress={ () => {

                                        //                 if (this.state.isUserAdmin) {
                                                            
                                        //                     Alert.alert(
                                        //                         'Eliminar Mensaje',
                                        //                         '¿Está seguro?, una vez eliminado no se podrá recuperar',
                                        //                         [
                                        //                             {text: 'Si', onPress: () => {
        
                                        //                                 console.log('Eliminar protocolo')
        
                                        //                                 let body = JSON.stringify(
                                        //                                     {
                                        //                                         name: 'deleteMessage',
                                        //                                         param: {
                                        //                                             messageID: item.ID_MENSAJE
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
        
                                        //                                     if (responseJson.response.status == 200) {

                                        //                                         Alert.alert(
                                        //                                             'AVE',
                                        //                                             'Mensaje eliminado exitosamente',
                                        //                                             [
                                        //                                                 {text: 'OK', onPress: () => {

                                                                                            

                                        //                                                 }}
                                        //                                             ],
                                        //                                             {
                                        //                                                 cancelable: false
                                        //                                             }
                                        //                                         )
                                                                                
                                        //                                         this.getMensajes()
                                                                                    
                                        //                                     }else{
                                                        
                                        //                                         Alert.alert(
                                        //                                             'Error Código ' + responseJson.response.status,
                                        //                                             responseJson.response.message,
                                        //                                             [
                                        //                                                 {text: 'OK'}
                                        //                                             ],
                                        //                                             {
                                        //                                                 cancelable: false
                                        //                                             }
                                        //                                         )
                                                                                                            
                                        //                                     }
                                                                            
                                        //                                 })
        
                                        //                             }},
                                        //                             {text: 'Cancelar'},
                                        //                         ],
                                        //                         {cancelable: true}
                                        //                     )

                                        //                 }
                                        //             }}
    
                                        //         >
                                        //             <Icon 
                                        //                 name='trash-o'
                                        //                 color='white'
                                        //                 type='font-awesome'
                                        //                 size={30}
                                        //             />
                                        //         </TouchableOpacity>
                                        //     ]
                                        // }
                                        //     key={key}
                                        //     onSwipeStart={ () => this.setState({ isSwiping: true }) }
                                        //     onSwipeRelease={ () => this.setState({ isSwiping: false }) }
                                        // >



                                        // </Swipeable>
        
                                    ))
                                }

                            </ScrollView>

                            {/* <Fab
                                containerStyle={{}}
                                position="bottomRight"
                                onPress={() => this.onAgregarMensaje() }
                            >
                                <Icon 
                                    reverse
                                    name='plus'
                                    type='font-awesome'
                                    color='blue'
                                    size={14}
                                />    
                            </Fab> */}
                            { this.botonAgregar() }

                        </List>
                        
                        { this.barraEliminar() }

                        <AwesomeAlert
                            show={this.state.alerta_eliminar}  
                            showProgress={this.state.eliminando}     
                            title="Eliminar Mensaje"
                            message="¿Está seguro? Una vez eliminado no se podrá recuperar."
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                            showCancelButton={true}
                            showConfirmButton={true}
                            cancelText="Cancelar"
                            confirmText={ this.state.eliminando ? 'Eliminando...' : 'Eliminar' }
                            confirmButtonColor={ this.state.eliminando ? '#D0D0D0' : '#DD6B55' }
                            onCancelPressed={() => {

                                this.setState({
                                    alerta_eliminar: false
                                })

                            }}
                            onConfirmPressed={() => {

                                this.eliminarMensajes()

                            }}
                        />

                        <AwesomeAlert
                            show={this.state.equipo_eliminado}
                            title="El equipo ha sido eliminado exitosamente"
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                            showConfirmButton={true}
                            confirmButtonColor="#DD6B55"
                            confirmText="Aceptar"
                            onConfirmPressed={() => {

                                this.getMensajes(false)

                                this.setState({
                                    equipo_eliminado: false
                                })

                            }}
                        />

                        <AwesomeAlert
                            show={this.state.notAdministrador}
                            showProgress={false}
                            title="Permiso Denegado"
                            message="Debe ser administrador para eliminar los mensajes!"
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                            showCancelButton={true}
                            cancelText="Aceptar"
                            cancelButtonColor='#DD6B55'
                            onCancelPressed={() => {
                                this.setState({
                                    notAdministrador: false
                                })
                            }}

                        />

                    </View>

                )

            }

        }


    }

    onAgregarMensaje(){

        if (this.state.isUserAdmin) {
            
            Actions.agregar_mensaje()

        }

    }

    botonAgregar(){

        if (this.state.administrador) {
            return(
                <Fab
                    containerStyle={{}}
                    position="bottomRight"
                    onPress={() => this.onAgregarMensaje() }
                >
                    <Icon 
                        reverse
                        name='plus'
                        type='font-awesome'
                        color='blue'
                        size={14}
                    />    
                </Fab>
            )
        }

    }

    async getMensajes(loading){

        this.setState({ isLoading: loading })

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')

        AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')
        .then((protocolID) => {

            let body = JSON.stringify(
                {
                    name: 'getMessages2',
                    param: {
                        protocolID: protocolID,
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
                    isLoading: false,
                    data: responseJson.response.result.MENSAJES,
                    administrador: responseJson.response.result.ADMINISTRADOR
                })

            })
            .catch((error) => {

                this.setState({ isLoading: false })

            });

        })
        .catch((error) => {

            this.setState({ isSaving: false })

        })

    }

    _onRefresh = () => {

        this.setState({ isRefreshing: true })

        AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')
        .then((protocoloID) => {

            let body = JSON.stringify(
                {
                    name: 'getMessages',
                    param: {
                        protocolID: protocoloID
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

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)'

    },

});
