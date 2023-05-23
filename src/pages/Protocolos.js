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

import { List, ListItem, SearchBar, Icon, Divider } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import { Fab } from 'native-base';

import ViewMoreText from 'react-native-view-more-text';

import Swipeable from 'react-native-swipeable';

function updateState(isLoading){

    this.setState({isLoading})

}

const leftContent = <Text>Texto</Text>;

export default class Protocolos extends React.Component {

    _isMounted = false
    shadow_height = 3

    constructor(props){
        super(props);

        this.state = {
            isLoading: 0,
            data: '',
            isRefreshing: false,
            searchText: '',
            searching: false,
            isUserAdmin: false,
        };
    }

    componentDidMount(){

        this._isMounted = true
        this.getProtocols()

    }

    componentWillUnmount(){

        this._isMounted = false

    }

    UNSAFE_componentWillReceiveProps(props){

        console.log('UNSAFE UPDATE');

        this.getProtocols()
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

    renderSubtitle(description){

        if (description) {
            
            console.warn('Existe descripcion')

            return(

                <View style={{ flex: 1, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                    <ViewMoreText
                        numberOfLines={2}
                        renderViewMore={this.renderViewMore}
                        renderViewLess={this.renderViewLess}
                        textStyle={{ fontSize: 12,  textAlign: 'justify'}}
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

        if (this.state.isLoading == 1) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eff0f2'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

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
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={ this._onRefresh }
                                    />
                                }
                            >
                                {
                                    items.map((item, key)=>(

                                        <Swipeable leftContent={<Text>Prueba</Text>}>
                                            <ListItem
                
                                                title={item.NOMBRE}
                                                titleNumberOfLines={5}
                                                titleStyle={{ fontSize: 16, fontWeight: 'bold', numberOfLines: 5 }}
                                                subtitle={
                                                    this.renderSubtitle(item.DESCRIPCION)
                                                }
                                                avatar={ item.ESTADO == 'A' ?  require('../images/list_check.png') : require('../images/list_error.png')}
                                                avatarStyle={{
                                                    backgroundColor: 'white'
                                                }}
                                                key={key}
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
                                                    backgroundColor: 'white'
                                                }}
                                                hideChevron={true}
                                                onPress={ detailProtocol = () => {
                                
                                                    //Registrar en Almacenamiento el ID del protocolo a ver
                                                    AsyncStorage.setItem('@AVE2:PROTOCOLO_ID', (item.ID_PROTOCOLO).toString())
                                                    .then((valor) => {
                                
                                                        Actions.detail_protocol()
                                
                                                    })
                                                    .catch((error) => {
                                                    })
                                
                                                }}
                                            >

                                            </ListItem>
                                        </Swipeable>

                                    ))    
                                }

                                {/* <FlatList
                                    data={this.state.data}
                                    renderItem={this.renderRow}
                                    keyExtractor={item => item.ID_PROTOCOLO}
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

            );

        }

    }

    UNSAFE_componentWillReceiveProps(props){
        this.getProtocols()
    }

    getProtocols(){
            
    
        AsyncStorage.getItem('@AVE2:USER_ADMIN')
        .then((valor) => {

            if (valor != null) {

                this.setState({ isUserAdmin: true })
                console.log(valor);

            }


        })
        .catch((error) => {


        })

        this.setState({ isLoading: 1 })
        this.setState({ searchText: '' })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getProtocols',
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

                this.setState({ isLoading: 0, data: responseJson.response.result })

            })
            .catch((error) => {

                this.setState({ isLoading: 0 })

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

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getProtocols',
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

    onSearch(){

        console.warn(this.state.searchText);

    }

    onAgregar(){

        if (this.state.isUserAdmin) {
            Actions.agregar_protocolo()
        }

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#dee1e5'
    },

});
