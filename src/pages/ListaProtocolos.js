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
} from 'react-native'

import { List, ListItem, SearchBar, Icon } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import { Fab, Accordion } from 'native-base';

import ViewMoreText from 'react-native-view-more-text';

import Swipeable from 'react-native-swipeable';

import CheckAdmin from '../functions/checkAdmin';

const dataArray = [
    { title: "First Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
  ];
  

export default class ListaProtocolos extends React.Component {

    elevation = 10
    shadow_height = 2
    swipeable = null

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            data: '',
            isRefreshing: false,
            searchText: '',
            searching: false,
            isUserAdmin: false,
            isSwiping: false
        };

    }

    handleUserBeganScrollingParentView(){

        this.swipeable.recenter()

    }

    // UNSAFE_componentWillReceiveProps(props){

    //     this.getProtocolos()
    // }

    async componentDidMount(){

        this.getProtocolos()

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
        
        let check = new CheckAdmin()
        let userAdmin = await check.check(id_usuario)

        this.setState({
            isUserAdmin: userAdmin
        })

    }

    componentDidUpdate(prevProps){

        if (this.props.protocolo_agregado != prevProps.protocolo_agregado) {
            
            this.getProtocolos()

            Actions.refresh({ protocolo_agregado: false })

        }

    }

    componentWillUnmount(){

        console.log('Desmontado')

    }


    _renderHeader(item, expanded) {
        return (
            <View style={{
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-between",
                alignItems: "center" ,
                borderRadius: 10,
                margin: 10,
                backgroundColor: "rgb(16, 6, 159)" }}>

                    <Text style={{ fontWeight: "600", color: 'white' }}>
                        {" "}{item.title}
                    </Text>

                {expanded
                ? <Icon color='white' style={{ fontSize: 18 }} name="remove-circle" />
                : <Icon color='white' style={{ fontSize: 18 }} name="add-circle" />}
            </View>
        );
      }

    _renderContent(item) {

        let items = item.content || []

        return (
            <List containerStyle={{
                marginTop: 0,
                flex: 1,
                borderBottomColor: '#d2d4d8',
                borderWidth: 0
            }}>

                {
                    items.map((item, key)=>(

                        <ListItem
                            key={key}
                            title={item.NOMBRE}
                            titleNumberOfLines={5}
                            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                            subtitle={item.DESCRIPCION}
                            subtitleNumberOfLines={10}
                            avatar={ item.ESTADO == 'A' ?  require('../images/list_check.png') : require('../images/list_error.png')}
                            avatarStyle={{
                                backgroundColor: 'white'
                            }}
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
                                backgroundColor: 'white',
                                flex: 1
                            }}
                            onPress={ detailProtocol = () => {
            
                                //Registrar en Almacenamiento el ID del protocolo a ver
                                AsyncStorage.setItem('@AVE2:PROTOCOLO_ID', (item.ID_PROTOCOLO).toString())
                                .then((valor) => {
            
                                    Actions.detail_protocol()
            
                                })
                                .catch((error) => {
                                })
            
                            }}
        
                        />  

                    ))
                }

            </List>
        );

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
                    
                    return(
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
                                onPress={() => this.onAgregar() }
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
                                <Text>Aún no se han registrado protocolos</Text>
                            </View>

                            <View>
                                <Icon 
                                    name='refresh'
                                    type='foundation'
                                    onPress={ () => this.getProtocolos() }
                                    size={30}
                                />
                            </View>

                            <Fab
                                containerStyle={{}}
                                position="bottomRight"
                                onPress={() => this.onAgregar() }
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
        
                                AsyncStorage.getItem('@AVE2:USER_ID')
                                .then((valor) => {
        
                                    let body = JSON.stringify(
                                        {
                                            name: 'searchProtocolCollapse',
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
                            onPress={() => this.onAgregar() }
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
    
                            AsyncStorage.getItem('@AVE2:USER_ID')
                            .then((valor) => {
    
                                let body = JSON.stringify(
                                    {
                                        name: 'searchProtocolCollapse',
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

                            <Accordion
                                dataArray={this.state.data}
                                animation={true}
                                expanded={true}
                                renderHeader={this._renderHeader}
                                renderContent={this._renderContent}
                            />

                            {/* {
                                items.map((item, key)=>(

                                    <Swipeable 
                                        leftButtons={ 
                                            [
                                                <TouchableOpacity  
                                                    style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'red', paddingRight: 25, marginTop: 10, marginBottom: 10, borderRadius: 10 }}
                                                    onPress={ () => {

                                                        if (this.state.isUserAdmin) {
                                                            Alert.alert(
                                                                'Eliminar Protocolo',
                                                                '¿Está seguro? una vez eliminado no se podrá recuperar',
                                                                [
                                                                    {text: 'Si', onPress: () => {
    
                                                                        let body = JSON.stringify(
                                                                            {
                                                                                name: 'deleteProtocol',
                                                                                param: {
                                                                                    protocolID: item.ID_PROTOCOLO
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
    
                                                                            if (responseJson.response.status == 200) {
    
                                                                                Alert.alert(
                                                                                    'AVE',
                                                                                    'Protocolo eliminado exitosamente',
                                                                                    [
                                                                                        {text: 'OK'}
                                                                                    ],
                                                                                    {
                                                                                        cancelable: false
                                                                                    }
                                                                                )
                                                                                
                                                                                this.getProtocolos()
                                                                                    
                                                                            }else{
                                                        
                                                                                Alert.alert(
                                                                                    'Error Código ' + responseJson.response.status,
                                                                                    responseJson.response.message,
                                                                                    [
                                                                                        {text: 'OK'}
                                                                                    ],
                                                                                    {
                                                                                        cancelable: false
                                                                                    }
                                                                                )
                                                                                                            
                                                                            }
                                                                            
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
                                            titleNumberOfLines={5}
                                            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                            // subtitle={item.DESCRIPCION}
                                            subtitle={
                                                this.renderSubtitle(item.DESCRIPCION)
                                            }
                                            avatar={ item.ESTADO == 'A' ?  require('../images/list_check.png') : require('../images/list_error.png')}
                                            avatarStyle={{
                                                backgroundColor: 'white'
                                            }}
                                            // key={key}
                                            hideChevron={true}
                                            containerStyle={{
                                                borderRadius: 10,
                                                borderTopWidth: 2,
                                                borderRightWidth: 2,
                                                // borderBottomWidth: 2,
                                                borderLeftWidth: 2,
                                                borderTopColor: '#d2d4d8',
                                                borderRightColor: '#d2d4d8',
                                                // borderBottomColor: '#d2d4d8',
                                                borderLeftColor: '#d2d4d8',
                                                marginBottom: 10,
                                                marginLeft: 10,
                                                marginRight: 10,
                                                marginTop: 10,
                                                backgroundColor: 'white',
                                                // elevation: 5,
                                                // shadowColor: '#000',
                                                // shadowOffset: { width: 0, height: this.shadow_height },
                                                // shadowOpacity: 0.5,
                                                // shadowRadius: 2,
                                                backgroundColor: 'white',
                                                flex: 1

                                            }}
                                            onPress={ detailProtocol = () => {
                            
                                                //Registrar en Almacenamiento el ID del protocolo a ver
                                                AsyncStorage.setItem('@AVE2:PROTOCOLO_ID', (item.ID_PROTOCOLO).toString())
                                                .then((valor) => {
                            
                                                    Actions.detail_protocol()
                            
                                                })
                                                .catch((error) => {
                                                })
                            
                                            }}
                            
                                        />    
                                    </Swipeable>

                                ))
                            } */}

                                {/* <FlatList
                                    data={this.state.data}
                                    renderItem={this.renderRow}
                                    keyExtractor={item => item.ID_ACTIVIDAD}
                                /> */}
    
                            </ScrollView>
    
                            <Fab
                                containerStyle={{}}
                                position="bottomRight"
                                onPress={() => this.onAgregar() }
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
    
                    </View>
    
                )

            }

        }
    }

    onAgregar(){

        if (this.state.isUserAdmin) {
            
            Actions.agregar_protocolo()

        }
        
    }

    getProtocolos(){

        AsyncStorage.getItem('@AVE2:USER_ADMIN')
        .then((valor) => {

            if (valor != null) {

                this.setState({ isUserAdmin: true })

            }

        })
        .catch((error) => {


        })

        this.setState({ isLoading: true })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'protocolosAgrupados',
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

                this.setState({
                    isLoading: false,
                    data: responseJson.response.result
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

    _onRefresh = () => {

        this.setState({ isRefreshing: true })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'protocolosAgrupados',
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



}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)'

    },

});
