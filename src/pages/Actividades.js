import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native'

import { List, ListItem, SearchBar, Icon, CheckBox } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import { Fab } from 'native-base';

// import ViewMoreText from 'react-native-view-more-text';

// import Swipeable from 'react-native-swipeable';

import CheckAdmin from '../functions/checkAdmin';

import AwesomeAlert from 'react-native-awesome-alerts';

export default class Actividades extends React.Component {

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
            actividades_eliminar: [],
            alerta_eliminar: false,
            alerta_eliminar: false,
            eliminada: false
        };

    }

    // UNSAFE_componentWillReceiveProps(props){

    //     this.getActividades()
    // }

    async componentDidMount(){

        this.getActividades(true)

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

                    let actividades = this.state.data

                    actividades.forEach(element => {
                        
                        //Desmarcar los elementos en la lista
                        element.ELIMINAR = false

                    });

                    this.setState({

                        actividades_eliminar: [],
                        data: actividades

                    })

                }else{

                    Actions.refresh({ rightTitle: "Editar" })

                }

            }

        }

        if (this.props.actividad_agregada != prevProps.actividad_agregada) {
            
            this.getActividades(true)

            Actions.refresh({ actividad_agregada: false })

        }

    }

    checkEliminar(item){

        if (this.state.checkEliminar) {
            
            let actividad = item

            return(

                <CheckBox 
                    center
                    size={30}
                    checked={actividad.ELIMINAR}
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
                    onPress={ () => {

                        actividad.ELIMINAR = !actividad.ELIMINAR

                        if (actividad.ELIMINAR) {
                            
                            let actividades_eliminar = this.state.actividades_eliminar

                            actividades_eliminar.push(actividad.ID_ACTIVIDAD)

                            this.setState({

                                actividades_eliminar: actividades_eliminar

                            })

                        }else{

                            let actividades_eliminar = this.state.actividades_eliminar

                            actividades_eliminar.splice(actividades_eliminar.indexOf(actividad.ID_ACTIVIDAD), 1)

                            this.setState({

                                actividades_eliminar: actividades_eliminar

                            })

                        }

                        console.log(this.state.actividades_eliminar)

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

    botonEliminar(){

        if (this.state.actividades_eliminar.length > 0) {
            
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

    eliminarActividades(){

        if (!this.state.eliminando) {
            
            this.setState({
                eliminando: true
            })

            let body = JSON.stringify(
                {
                    name: 'deleteActivity2',
                    param: {
                        actividades: this.state.actividades_eliminar
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

                    this.setState({
                        alerta_eliminar: false,
                        equipo_eliminado: true,
                        eliminando: false,
                        actividades_eliminar: [],
                    })

                }

            })
            .catch((error) => {

                console.log(error)

            });
        }

    }

    botonMarcarTodos(){

        if (this.state.actividades_eliminar.length < this.state.data.length) {
            
            return(

                <TouchableOpacity onPress={ () => {
    
                    let actividades = this.state.data
                    let actividades_marcadas = []
    
                    actividades.forEach(element => {
                        
                        // Llenar el array con los ID de las actividades
                        actividades_marcadas.push(element.ID_ACTIVIDAD)

                        //Marcar los elementos en la lista
                        element.ELIMINAR = true

                    });
    
                    this.setState({
    
                        actividades_eliminar: actividades_marcadas,
                        data: actividades
    
                    })
        
                }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Marcar Todas</Text>
                </TouchableOpacity>

            )

        }else{

            return (
                <TouchableOpacity onPress={ () => {

                    let actividades = this.state.data

                    actividades.forEach(element => {
                        
                        //Desmarcar los elementos en la lista
                        element.ELIMINAR = false

                    });

                    this.setState({

                        actividades_eliminar: [],
                        data: actividades

                    })

                }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Desmarcar Todas</Text>
                </TouchableOpacity>
            )

        }

    }

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

    encargadoActividad(item){

        return(
            <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Responsable</Text>
                <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 12 }}>{ item.RESPONSABLE }</Text>
            </View>
        )

    }

    renderSubtitle(item){

        // if (item.DESCRIPCION) {

            

        //     )

        // }else{

        //     return (

        //         <View>
        //         </View>

        //     )
        // }

        return(

            <View style={{ flex: 1, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                {/* <ViewMoreText
                    numberOfLines={2}
                    renderViewMore={this.renderViewMore}
                    renderViewLess={this.renderViewLess}
                    textStyle={{ fontSize: 12, textAlign: 'justify'}}
                >

                </ViewMoreText> */}

                <Text style={{ fontSize: 12, textAlign: 'justify' }}>
                    { item.DESCRIPCION }
                </Text>

                { this.encargadoActividad(item) }

            </View>
        )

    }

    render() {

        if (this.state.isLoading) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

        }else{

            if (this.state.data <= 0 && this.state.searchText == '') {

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
                                                name: 'searchActivities',
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
                                onPress={() => this.onAgregarActividad() }
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
                                <Text>Aún no se han registrado actividades</Text>
                            </View>

                            <View>
                                <Icon
                                    name='refresh'
                                    type='foundation'
                                    onPress={ () => this.getActividades() }
                                    size={30}
                                />
                            </View>

                            <Fab
                                containerStyle={{}}
                                position="bottomRight"
                                onPress={() => this.onAgregarActividad() }
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
                                            name: 'searchActivities',
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

                        <Fab
                            containerStyle={{}}
                            position="bottomRight"
                            onPress={() => this.onAgregarActividad() }
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
                                        name: 'searchActivities',
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

                                    <ListItem
                                        // title={item.NOMBRE}
                                        title={
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 10 }}>
                                                { item.NOMBRE }
                                            </Text>
                                        }
                                        titleNumberOfLines={5}
                                        titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                        subtitle={
                                            this.renderSubtitle(item)
                                        }
                                        avatar={ item.ESTADO == 'A' ?  require('../images/clipboard.png') : require('../images/error.png') }
                                        avatarStyle={{
                                            backgroundColor: 'rgb(255, 255, 255)'
                                        }}
                                        avatarContainerStyle={{
                                            marginTop: 0,
                                            paddingTop: 0,
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-start'
                                         }}
                                        leftIcon={
                                            this.checkEliminar(item)
                                        }
                                        key={key}
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
                                        onPress={ detailActivity = () => {
        
                                            //Registrar en Almacenamiento el ID del protocolo a ver
                                            AsyncStorage.setItem('@AVE2:ACTIVIDAD_ID', (item.ID_ACTIVIDAD).toString())
                                            .then((valor) => {
        
                                                Actions.detalles_actividad()
        
                                            })
                                            .catch((error) => {
        
                                                console.warn(error);
        
                                            })
        
                                        }}
        
                                    />
    

                                    // <Swipeable
                                    //     leftButtons={
                                    //         [
                                    //             <TouchableOpacity
                                    //                 style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'red', paddingRight: 25, marginTop: 10, marginBottom: 10, borderRadius: 10 }}
                                    //                 onPress={ () => {

                                    //                     if (this.state.isUserAdmin) {
                                                            
                                    //                         Alert.alert(
                                    //                             'Eliminar Actividad',
                                    //                             '¿Está seguro? una vez eliminada no se podrá recuperar',
                                    //                             [
                                    //                                 {text: 'Si', onPress: () => {

                                    //                                     let body = JSON.stringify(
                                    //                                         {
                                    //                                             name: 'deleteActivity',
                                    //                                             param: {
                                    //                                                 activityID: item.ID_ACTIVIDAD
                                    //                                             }
                                    //                                         }
                                    //                                     )

                                    //                                     fetch('https://udicat.muniguate.com/apps/ave_api/', {
                                    //                                         method: 'POST',
                                    //                                         headers: {
                                    //                                             'CONTENT-TYPE': 'application/json'
                                    //                                         },
                                    //                                         body: body
                                    //                                     })
                                    //                                     .then((response) => response.json())
                                    //                                     .then((responseJson) => {

                                    //                                         if (responseJson.response.status == 200) {

                                    //                                             Alert.alert(
                                    //                                                 'AVE',
                                    //                                                 'Actividad eliminada exitosamente',
                                    //                                                 [
                                    //                                                     {text: 'OK'}
                                    //                                                 ],
                                    //                                                 {
                                    //                                                     cancelable: false
                                    //                                                 }
                                    //                                             )

                                    //                                             this.getActividades()

                                    //                                         }else{

                                    //                                             Alert.alert(
                                    //                                                 'Error Código ' + responseJson.response.status,
                                    //                                                 responseJson.response.message,
                                    //                                                 [
                                    //                                                     {text: 'OK'}
                                    //                                                 ],
                                    //                                                 {
                                    //                                                     cancelable: false
                                    //                                                 }
                                    //                                             )

                                    //                                         }

                                    //                                     })

                                    //                                 }},
                                    //                                 {text: 'Cancelar'},
                                    //                             ],
                                    //                             {cancelable: true}
                                    //                         )

                                    //                     }
                                    //                 }}
                                    //             >
                                    //                 <Icon
                                    //                     name='trash-o'
                                    //                     color='white'
                                    //                     type='font-awesome'
                                    //                     size={30}
                                    //                 />
                                    //             </TouchableOpacity>
                                    //         ]
                                    //     }

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
                                onPress={() => this.onAgregarActividad() }
                            >
                                <Icon
                                    reverse
                                    name='plus'
                                    type='font-awesome'
                                    color='blue'
                                    size={14}
                                />
                            </Fab> */}

                            {this.botonAgregar()}

                        </List>
                        
                        { this.barraEliminar() }
                            
                        <AwesomeAlert
                            show={this.state.alerta_eliminar}  
                            showProgress={this.state.eliminando}     
                            title="Eliminar Actividad"
                            message="¿Está seguro? Una vez eliminada no se podrá recuperar."
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

                                this.eliminarActividades()

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

                                this.getActividades(false)

                                this.setState({
                                    equipo_eliminado: false
                                })

                            }}
                        />

                        <AwesomeAlert
                            show={this.state.notAdministrador}
                            showProgress={false}
                            title="Permiso Denegado"
                            message="Debe ser administrador para eliminar las actividades!"
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

    botonAgregar(){

        if (this.state.administrador) {
            
            return(

                <Fab
                    containerStyle={{}}
                    position="bottomRight"
                    onPress={() => this.onAgregarActividad() }
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

    onAgregarActividad(){

        if (this.state.isUserAdmin) {

            Actions.agregar_actividad()

        }

    }

    async getActividades(loading){

        AsyncStorage.getItem('@AVE2:USER_ADMIN')
        .then((valor) => {

            if (valor != null) {

                this.setState({ isUserAdmin: true })

            }

        })
        .catch((error) => {


        })

        this.setState({ isLoading: loading })

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')

        AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')
        .then((protocoloID) => {

            let body = JSON.stringify(
                {
                    name: 'getActivities2',
                    param: {
                        protocolID: protocoloID,
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
                    data: responseJson.response.result.ACTIVIDADES,
                    administrador: responseJson.response.result.ADMINISTRADOR
                })

            })
            .catch((error) => {

                this.setState({ isLoading: false })

            });

        })
        .catch((error) => {

            this.setState({ isLoading: false })

        })

    }

    _onRefresh = async () => {

        this.setState({ isRefreshing: true })

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')

        AsyncStorage.getItem('@AVE2:PROTOCOLO_ID')
        .then((protocoloID) => {

            let body = JSON.stringify(
                {
                    name: 'getActivities2',
                    param: {
                        protocolID: protocoloID,
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

                this.setState({ 
                    isRefreshing: false, 
                    data: responseJson.response.result.ACTIVIDADES,
                    administrador: responseJson.response.result.ADMINISTRADOR 
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



}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)'

    },

});
