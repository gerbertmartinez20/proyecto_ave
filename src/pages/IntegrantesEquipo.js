import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    RefreshControl,
    Alert,
    TouchableOpacity,
    Text
} from 'react-native';

import { List, ListItem, SearchBar, Avatar, Badge, CheckBox } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import { Fab, Icon } from 'native-base';

import CheckAdmin from '../functions/checkAdmin';

import AwesomeAlert from 'react-native-awesome-alerts';

export default class Alertas extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            isRefreshing: false,
            data: '',
            isUserAdmin: false,
            isSwiping: false,
            active: false,
            administrador: false,
            checkEliminar: false,
            personas_eliminar: [],
            alerta_eliminar: false,
            eliminando: false,
            persona_eliminada: false
        };
    }

    async componentDidMount(){

        this.getTeam(true)

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
        
        let check = new CheckAdmin()
        let userAdmin = await check.check(id_usuario)

        this.setState({
            isUserAdmin: userAdmin
        })

    }

    componentDidUpdate(prevProps){

        if (this.state.administrador) {

            console.log('administrador')

            if (this.props.editando != prevProps.editando) {
                
                this.setState({

                    checkEliminar: this.props.editando

                })
                
                if (this.props.editando) {
                    
                    Actions.refresh({ rightTitle: "Cancelar" })

                    let personas = this.state.data

                    personas.forEach(element => {
                        
                        //Desmarcar los elementos en la lista
                        element.ELIMINAR = false

                    });

                    this.setState({

                        personas_eliminar: [],
                        data: personas

                    })

                }else{

                    Actions.refresh({ rightTitle: "Editar" })

                }

            }

            if (this.props.equipo_agregado != prevProps.equipo_agregado) {
                
                this.getTeam(true)

                Actions.refresh({ equipo_agregado: false })

            }

        }

    }

    checkEliminar(item){

        if (this.state.checkEliminar) {
            
            let persona = item

            return(

                <CheckBox
                    center
                    size={30}
                    checked={persona.ELIMINAR}
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

                        persona.ELIMINAR = !persona.ELIMINAR

                        if (persona.ELIMINAR) {
                            
                            let personas_eliminar = this.state.personas_eliminar

                            personas_eliminar.push(persona.ID)

                            this.setState({

                                personas_eliminar: personas_eliminar
    
                            })

                        }else{

                            let personas_eliminar = this.state.personas_eliminar

                            personas_eliminar.splice( personas_eliminar.indexOf(persona.ID), 1 )

                            this.setState({

                                personas_eliminar: personas_eliminar

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

    botonEliminar(){

        if (this.state.personas_eliminar.length > 0) {
            
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

    botonMarcarTodos(){

        if(this.state.personas_eliminar.length < this.state.data.length){

            return(

                <TouchableOpacity onPress={ () => {
    
                    let personas = this.state.data
                    let personas_marcadas = []
    
                    personas.forEach(element => {
                        
                        // Llenar el array con los ID de los equipos
                        personas_marcadas.push(element.ID)

                        //Marcar los elementos en la lista
                        element.ELIMINAR = true

                    });
    
                    this.setState({
    
                        personas_eliminar: personas_marcadas,
                        data: personas
    
                    })
        
                }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Marcar Todos</Text>
                </TouchableOpacity>
    
            )


        }else{

            return (
                <TouchableOpacity onPress={ () => {

                    let personas = this.state.data

                    personas.forEach(element => {
                        
                        //Desmarcar los elementos en la lista
                        element.ELIMINAR = false

                    });

                    this.setState({

                        personas_eliminar: [],
                        data: personas

                    })

                }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Desmarcar Todos</Text>
                </TouchableOpacity>
            )
        }

        

    }

    rol(rol){

        if (rol) {
            return(
                <Badge
                    textStyle={{ color: 'white' }}
                    containerStyle={{ backgroundColor: 'red' }}
                >
                    <Text style={{ fontSize: 8, color: 'white' }}>Administrador</Text>
                </Badge>
            )
        }else{
            return (
                <Badge
                    textStyle={{ color: 'white' }}
                    containerStyle={{ backgroundColor: 'green' }}
                >
                    <Text style={{ fontSize: 8, color: 'white' }}>Invitado</Text>
                </Badge>
            )
        }

        

    }

    renderRow ({ item }) {
        return (
            <ListItem

                title={item.NOMBRE}
                avatar={
                    <Avatar
                        medium
                        rounded
                        source={{uri: 'data:image/jpeg;base64,' + item.AVATAR}}
                    />

                }
                avatarStyle={{
                    backgroundColor: 'rgb(255, 255, 255)'
                }}
                hideChevron={true}
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
                    marginTop: 10,
                }}
                titleStyle={{ fontWeight: 'bold', fontSize: 18 }}
                onPress={()=>{
                                
                    Actions.detalles_integrante_equipo({ id_persona: item.ID })

                }}
            />
        )
    }

    render() {

        if (this.state.isLoading) {

            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}} >

                    <ActivityIndicator size='large' />

                </View>
            );

        }else{

            let items = this.state.data || []

            return (
                <View style={ styles.container }>

                    < SearchBar
                        value={this.state.searchText}
                        onChangeText={ (searchText) => {

                            this.setState({searchText})

                            this.setState({ searching: true })

                            AsyncStorage.multiGet(['@AVE2:ORGANIZACION_ID', '@AVE2:USER_ID'])
                            .then((valor) => {

                                let body = JSON.stringify(
                                    {
                                        name: 'searchTeam',
                                        param: {
                                            userID: valor[1][1],
                                            id_organizacion: valor[0][1],
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
                        borderBottomColor: '#2089dc',
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

                                    // <Swipeable
                                    //     leftButtons={ 
                                    //         [
                                    //             <TouchableOpacity  
                                    //                 style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'red', paddingRight: 25, marginTop: 10, marginBottom: 10, borderRadius: 10 }}
                                    //                 onPress={ () => {

                                    //                     if (this.state.isUserAdmin) {
                                                            
                                    //                         Alert.alert(
                                    //                             'Eliminar a Integrante de Equipo',
                                    //                             '¿Está seguro? una vez eliminado no se podra recuperar',
                                    //                             [
                                    //                                 {text: 'Si', onPress: async () => {

                                    //                                     const id_organizacion = await AsyncStorage.getItem('@AVE2:ORGANIZACION_ID')

                                    //                                     let body = JSON.stringify(
                                    //                                         {
                                    //                                             name: 'deletePerson2',
                                    //                                             param: {
                                    //                                                 id_persona: item.ID,
                                    //                                                 id_organizacion: id_organizacion
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
                                    //                                                 'Registro eliminado exitosamente.',
                                    //                                                 [
                                    //                                                     {text: 'OK', onPress: () => {
                                                        
                                    //                                                         this.getTeam()
                                                        
                                    //                                                     }
                                                        
                                    //                                                     }
                                    //                                                 ],
                                    //                                                 {
                                    //                                                     cancelable: false
                                    //                                                 }
                                    //                                             )
                                                        
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
                                    //                     type="FontAwesome" 
                                    //                     name="trash"
                                    //                     style={{ color: 'white' }}
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

                                    <ListItem
                                        key={key}
                                        title={item.NOMBRE}
                                        leftIcon={
                                            this.checkEliminar(item)
                                        }
                                        avatar={
                                            <Avatar
                                                medium
                                                rounded
                                                source={{uri: 'data:image/jpeg;base64,' + item.AVATAR}}
                                            />

                                        }
                                        subtitle={
                                            <View
                                                style={{ marginLeft: 10, flexDirection: 'column' }}
                                            >

                                                { this.rol(item.ADMINISTRADOR) }

                                            </View>
                                        }
                                        subtitleContainerStyle={{
                                            flexDirection: 'row',
                                            flex: 1
                                        }}
                                        avatarStyle={{
                                            backgroundColor: 'rgb(255, 255, 255)'
                                        }}
                                        hideChevron={true}
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
                                            marginTop: 10,
                                        }}
                                        titleStyle={{ fontWeight: 'bold', fontSize: 18 }}
                                        onPress={()=>{
                                            
                                            AsyncStorage.getItem('@AVE2:ORGANIZACION_ID')
                                            .then((valor) => {

                                                Actions.detalles_integrante_equipo({ id_persona: item.ID, id_organizacion: valor })

                                            })
                                            

                                        }}
                                    />

                                ))

                            }

                        </ScrollView>

                        { this.botonAgregar() }

                    </List>

                    { this.barraEliminar() }

                    <AwesomeAlert
                        show={this.state.alerta_eliminar}  
                        showProgress={this.state.eliminando}                      
                        title="Eliminar Persona"
                        message="¿Está seguro? Una vez eliminada no se podrá recuperar."
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText="Cancelar"
                        confirmText={ this.state.eliminando ? 'Eliminando...' : 'Eliminar' }
                        confirmButtonColor={ this.state.eliminando ? '#D0D0D0' : '#DD6B55' }
                        onCancelPressed={() => {

                            if (!this.state.eliminando) {
                                
                                this.setState({
                                    alerta_eliminar: false
                                })

                            }

                        }}
                        onConfirmPressed={() => {

                            this.eliminarPersonas()

                        }}
                    />

                    <AwesomeAlert
                        show={this.state.persona_eliminada}
                        title="La persona ha sido eliminada exitosamente"
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showConfirmButton={true}
                        confirmButtonColor="#DD6B55"
                        confirmText="Aceptar"
                        onConfirmPressed={() => {

                            this.setState({
                                persona_eliminada: false
                            })

                        }}
                    />

                </View>
            );

        }

    }

    botonAgregar(){

        if (this.state.administrador) {
            
            return(

                <Fab
                    containerStyle={{ }}
                    style={{ backgroundColor: 'blue' }}
                    position="bottomRight"
                    onPress={() => {
                        AsyncStorage.getItem('@AVE2:ORGANIZACION_ID')
                        .then((valor) => {
    
                            Actions.invitar_persona({ id_organizacion: valor })
    
                        })
                    }}>
    
                    <Icon
                        type="FontAwesome" 
                        name="plus" 
                    />
                </Fab>
    
            )

        }
        // else{

        //     return(

        //         <View>
        //         </View>

        //     )

        // }

    }

    async getTeam(loading){

        this.setState({ isLoading: loading })

        const id_organizacion = await AsyncStorage.getItem('@AVE2:ORGANIZACION_ID')

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getTeam2',
                    param: {
                        userID: valor,
                        organizacionID: id_organizacion
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
                    data: responseJson.response.result.PERSONAS,
                    administrador: responseJson.response.result.ADMINISTRADOR
                })

            })
            .catch((error) => {

                console.log(error)

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

    }

    _onRefresh = () => {

        this.setState({ isRefreshing: true })
        
        AsyncStorage.multiGet(['@AVE2:ORGANIZACION_ID', '@AVE2:USER_ID'])
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getTeam',
                    param: {
                        userID: valor[1][1],
                        organizacionID: valor[0][1]
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

    async eliminarPersonas(){

        if (!this.state.eliminando) {
            
            this.setState({
                eliminando: true
            })

            const id_organizacion = await AsyncStorage.getItem('@AVE2:ORGANIZACION_ID')

            let body = JSON.stringify(
                {
                    name: 'deletePerson3',
                    param: {
                        id_personas: this.state.personas_eliminar,
                        id_organizacion: id_organizacion
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

                console.log(responseJson)

                this.getTeam(false)

                this.setState({
                    alerta_eliminar: false,
                    eliminando: false,
                    persona_eliminada: true,
                    personas_eliminar: [],
                })

            })
            .catch((error) => {

                console.log(error)

            });
            
        }

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1

    },

});
