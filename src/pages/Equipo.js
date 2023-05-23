import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    RefreshControl,
    Alert,
    Text,
    TouchableOpacity
} from 'react-native';

import { List, ListItem, SearchBar, Icon, Avatar, CheckBox, Button } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import { Fab } from 'native-base';

import Modal from "react-native-modal";

import CheckAdmin from '../functions/checkAdmin';
import DetallesIntegranteEquipo from './DetallesIntegranteEquipo';
import AwesomeAlert from 'react-native-awesome-alerts';

// import Swipeable from 'react-native-swipeable';

export default class Alertas extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            isRefreshing: false,
            data: '',
            isUserAdmin: false,
            isSwiping: false,
            checkEliminar: false,
            checkList: [],
            reload: false,
            equipos_eliminar: [],
            alerta_eliminar: false,
            eliminando: false,
            equipo_eliminado: false,
            notAdministrador: false,
            realoadingData: false
        };

        this.data = [] 

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

        if (this.props.editando != prevProps.editando) {
            
            this.setState({

                checkEliminar: this.props.editando

            })
            
            if (this.props.editando) {
                
                Actions.refresh({ rightTitle: "Cancelar" })

                let equipos = this.state.data

                equipos.forEach(element => {
                    
                    //Desmarcar los elementos en la lista
                    element.ELIMINAR = false

                });

                this.setState({

                    equipos_eliminar: [],
                    data: equipos

                })

            }else{

                Actions.refresh({ rightTitle: "Editar" })

            }

        }

        if (this.props.equipo_agregado != prevProps.equipo_agregado) {
            
            this.getTeam(true)

            Actions.refresh({ equipo_agregado: false })

        }

        if (this.props.equipo_abandonado != prevProps.equipo_abandonado) {
            
            this.getTeam(true)

            Actions.refresh({ equipo_abandonado: false })

        }

    }

    alertAdministrador(){

        return(

            <AwesomeAlert
                show={notAdministrador}
                showProgress={false}
                title="Permiso Denegado"
                message="Debe ser administrador para eliminar el equipo!"
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                cancelText="OK"
                onCancelPressed={() => {
                    this.setState({
                        notAdministrador: false
                    })
                }}
                // onConfirmPressed={() => {
                //     this.hideAlert();
                // }}
            />

        )

    }

    checkEliminar(item){

        if (this.state.checkEliminar) {
            
            let equipo = item

            return(

                <CheckBox
                    center
                    size={30}
                    checked={equipo.ELIMINAR}
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

                        if(equipo.ADMINISTRADOR){

                            equipo.ELIMINAR = !equipo.ELIMINAR

                            if (equipo.ELIMINAR) {
                                
                                let equipos_eliminar = this.state.equipos_eliminar

                                equipos_eliminar.push(equipo.ID_ORGANIZACION)

                                this.setState({

                                    equipos_eliminar: equipos_eliminar

                                })

                                console.log(this.state.equipos_eliminar)

                            }else{

                                let equipos_eliminar = this.state.equipos_eliminar

                                equipos_eliminar.splice( equipos_eliminar.indexOf(equipo.ID_ORGANIZACION), 1 )

                                this.setState({

                                    equipos_eliminar: equipos_eliminar

                                })

                                console.log(this.state.equipos_eliminar)

                            }

                            this.setState({
                                reload: true
                            })

                        }else{

                            console.log('Debe ser administrador para eliminar el equipo')

                            this.setState({
                                notAdministrador: true
                            })

                        }
                        
                    }}
                />


            )

        }

    }

    barraEliminar(){

        if (this.props.editando) {
            
            return (
                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgb(16, 6, 159)' }}>

                    { this.botonMarcarTodos() }
                    { this.botonEliminar() }

                </View>
            )

        }   

    }

    botonEliminar(){

        if (this.state.equipos_eliminar.length > 0) {
            
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

        if(this.state.equipos_eliminar.length < this.state.data.length){

            return(

                <TouchableOpacity onPress={ () => {
    
                    let equipos = this.state.data
                    let equipos_marcados = []
    
                    equipos.forEach(element => {
                        
                        if (element.ADMINISTRADOR) {
                            
                            // Llenar el array con los ID de los equipos
                            equipos_marcados.push(element.ID_ORGANIZACION)
        
                            //Marcar los elementos en la lista
                            element.ELIMINAR = true

                        }

                    });
    
                    this.setState({
    
                        equipos_eliminar: equipos_marcados,
                        data: equipos
    
                    })
        
                }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Marcar Todos</Text>
                </TouchableOpacity>
    
            )


        }else{

            return (
                <TouchableOpacity onPress={ () => {

                    let equipos = this.state.data

                    equipos.forEach(element => {
                        
                        //Desmarcar los elementos en la lista
                        element.ELIMINAR = false

                    });

                    this.setState({

                        equipos_eliminar: [],
                        data: equipos

                    })

                }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Desmarcar Todos</Text>
                </TouchableOpacity>
            )
        }

        

    }

    botonMarcar(){
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

                            AsyncStorage.getItem('@AVE2:USER_ID')
                            .then((valor) => {

                                let body = JSON.stringify(
                                    {
                                        name: 'buscarEquipo',
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

                                    console.log(responseJson)

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

                                    <ListItem
                                        key={key}
                                        leftIcon={
                                            this.checkEliminar(item)
                                        }
                                        title={item.NOMBRE}
                                        titleContainerStyle={{
                                            marginLeft: 5
                                        }}
                                        subtitleContainerStyle={{
                                            marginLeft: 5
                                        }}
                                        titleNumberOfLines={10}
                                        avatar={
                                            <Avatar
                                                medium
                                                rounded
                                                source={{uri: 'data:image/jpeg;base64,' + item.AVATAR}}
                                            />

                                        }
                                        subtitle={item.DESCRIPCION}
                                        subtitleNumberOfLines={10}
                                        avatarStyle={{
                                            backgroundColor: 'rgb(255, 255, 255)',
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
                                                        

                                            AsyncStorage.setItem('@AVE2:ORGANIZACION_ID', (item.ID_ORGANIZACION).toString())
                                            .then((valor) => {

                                                Actions.tab_detalle_equipo()

                                            })
                                            .catch((error) => {

                                                console.warn(error);

                                            })

                                        }}
                                />

                                ))


                            }

                        </ScrollView>

                        <Fab
                            containerStyle={{}}
                            position="bottomRight"
                            onPress={() => {

                                if (this.state.isUserAdmin) {

                                    Actions.refresh({ agregar_equipo: false })

                                    Actions.agregar_equipo()

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

                    { this.barraEliminar() }

                    <AwesomeAlert
                        show={this.state.alerta_eliminar}  
                        showProgress={this.state.eliminando}     
                        title="Eliminar Equipo"
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

                            this.eliminar_equipos()

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

                            this.setState({
                                equipo_eliminado: false
                            })

                        }}
                    />

                    <AwesomeAlert
                        show={this.state.notAdministrador}
                        showProgress={false}
                        title="Permiso Denegado"
                        message="Debe ser administrador para eliminar el equipo!"
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
            );

        }

    }

    getTeam(loading){

        this.setState({ isLoading: loading })
    
        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getTeams',
                    param: {
                        userID: valor
                    }
                }
            )

            this.setState({
                realoadingData: true
            })

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

    _onRefresh = () => {

        this.setState({ isRefreshing: true })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getTeams',
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

    eliminar_equipos(){

        if (!this.state.eliminando) {
            
            this.setState({
                eliminando: true
            })

            let body = JSON.stringify({
                name: 'deleteTeam2',
                param: {
                    id_equipos: this.state.equipos_eliminar
                }
            })

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

                if (responseJson.response.status == 200) {

                    this.getTeam(false)

                    this.setState({
                        alerta_eliminar: false,
                        equipo_eliminado: true,
                        eliminando: false,
                        equipos_eliminar: [],
                    })



                }else{

                    // Alert.alert(
                    //     'Error Código ' + responseJson.response.status,
                    //     responseJson.response.message,
                    //     [
                    //         {text: 'OK'}
                    //     ],
                    //     {
                    //         cancelable: false
                    //     }
                    // )
            
                }
            })
            .catch((error) => {

                console.log(error)

            });
            console.log('Eliminando')

        }

    }

    vista_alerta(){

        return(
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>Eliminar Equipos</Text>

                <Text>¿Está seguro? Una vez eliminado no se podra recuperar.</Text>

                {/* Botones */}
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        rightIcon={{name: 'code'}}
                        title='LARGE WITH RIGHT ICON' 
                    />

                    <Button
                        rightIcon={{name: 'code'}}
                        title='LARGE WITH RIGHT ICON' 
                    />
                </View>

            </View>
        )

    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

});
