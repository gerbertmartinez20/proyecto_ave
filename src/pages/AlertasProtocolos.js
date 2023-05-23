import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    Alert
} from 'react-native';

import { ListItem, SearchBar, Card, Button, Icon } from 'react-native-elements'

import { Accordion } from 'native-base';

import AwesomeAlert from 'react-native-awesome-alerts';

import CheckAdmin from '../functions/checkAdmin'

export default class AlertasProtocolos extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            data: '',
            isRefreshing: false,
            isUserAdmin: false,
            searchText: '',
            searching: false,
            sendingNotifications: false,
            resultNotifications: false,
            totalNotifications: ''
        };
    }

    async componentDidMount(){

        this.getProtocols()

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
        
        let check = new CheckAdmin()
        let userAdmin = await check.check(id_usuario)

        this.setState({
            isUserAdmin: userAdmin
        })

    }

    checkAdmin(){

        

    }

    renderRow ({ item }) {
        return (
            <ListItem

                title={item.NOMBRE}
                subtitle={item.DESCRIPCION}
                hideChevron={true}
                containerStyle={{
                    borderRadius: 25,
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
                    width: 300,
                    height: 200
                }}

            >

                <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Texto</Text>
                </View>

            </ListItem>
        )
    }

    _renderHeader(item, expanded) {
        return (
            <View style={{
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-between",
                alignItems: "center" ,
                borderRadius: 10,
                marginTop: 10,
                marginRight: 10,
                marginLeft: 10,
                backgroundColor: "rgb(233, 84, 64)" }}>

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
                <View>
                    {

                        items.map((item, key)=>(

                            <Card
                                title={item.NOMBRE}
                                containerStyle={styles.cardStyle}
                                key={key}
                            >
                            <Text
                                numberOfLines={3}
                                style={{ marginBottom: 10, textAlign: 'justify'}}>
                                {item.DESCRIPCION}
                            </Text>
                                <View style={ styles.botonIngreso }>
                                    <Button
                                        disabled={!item.ADMINISTRADOR}
                                        rightIcon={{name: 'play', type: 'font-awesome', size: 20}}
                                        backgroundColor='rgb(233, 84, 64)'
                                        buttonStyle={styles.buttonStyle}
                                        title='ACTIVAR'
                                        // disabled={!this.state.isUserAdmin}
                                        onPress={  () => {

                                            Alert.alert(
                                            '¿Esta seguro que desea activar el protocolo?',
                                            'Se enviara notificación a todos los participantes',
                                            [
                                                {text: 'Si', onPress: async () => {

                                                    this.setState({ sendingNotifications: true })

                                                    const id_persona = await AsyncStorage.getItem('@AVE2:USER_ID')
                                                    
                                                    let body = JSON.stringify(
                                                        {
                                                            protocolID: item.ID_PROTOCOLO,
                                                            id_persona: id_persona
                                                        }
                                                    )

                                                    fetch('https://udicat.muniguate.com/ave2_api/public/activar_protocolo2', {
                                                        method: 'POST',
                                                        headers: {
                                                            'content-type': 'application/json'
                                                        },
                                                        body: body
                                                    })
                                                    .then((response) => response.json())
                                                    .then((responseJson) => {

                                                        console.log(responseJson);

                                                        this.setState({
                                                            sendingNotifications: false,
                                                            resultNotifications: true,
                                                            totalNotifications: responseJson.toString()
                                                        })

                                                    })
                                                    .catch((error) => {

                                                        console.log(error)
                                                        this.setState({ sendingNotifications: false })

                                                    });

                                                }},
                                                {text: 'Cancelar'},
                                            ],
                                            )

                                        }}
                                    />

                                </View>
                            </Card>

                        ))
                    } 

                </View>
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

            if (this.state.data.length <= 0 && this.state.searchText == '') {

                if (this.state.searching) {
                  
                    return(

                        <View style={{ flex: 1, backgroundColor: 'rgb(255, 255, 255)' }}>

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

                                            console.log(error);

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
                                <Text>Aún no se han registrado protocolos que activar</Text>
                            </View>
    
                            <View>
                                <Icon 
                                    name='refresh'
                                    type='foundation'
                                    onPress={ () => this.getProtocols() }
                                    size={30}
                                />
                            </View>
    
                        </View>
    
                    )

                }


            }else if(this.state.data <= 0 && this.state.searchText != ''){

                return(

                    <View style={{ flex: 1, backgroundColor: 'rgb(255, 255, 255)' }}>

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

                                        console.log(error);

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

                    </View>

                )

            }else{

                let items = this.state.data || []

                return (

                    <View style={{ flex: 1, backgroundColor: '#ffffff'}}>

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

                                        console.log(error);

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

                        <ScrollView
                            style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                            showsVerticalScrollIndicator={true}
                        >

                            <Accordion
                                dataArray={this.state.data}
                                animation={true}
                                expanded={true}
                                renderHeader={this._renderHeader}
                                renderContent={this._renderContent.bind(this)}
                            />
                        
                        {/* {

                            items.map((item, key)=>(

                                <Card
                                    title={item.NOMBRE}
                                    containerStyle={styles.cardStyle}
                                    key={key}
                                >
                                <Text
                                    numberOfLines={3}
                                    style={{ marginBottom: 10, textAlign: 'justify'}}>
                                    {item.DESCRIPCION}
                                </Text>
                                    <View style={ styles.botonIngreso }>
                                        <Button
                                            rightIcon={{name: 'play', type: 'font-awesome', size: 20}}
                                            backgroundColor='rgb(233, 84, 64)'
                                            buttonStyle={styles.buttonStyle}
                                            title='ACTIVAR'
                                            disabled={!this.state.isUserAdmin}
                                            onPress={ activateProtocol = () => {

                                                Alert.alert(
                                                '¿Esta seguro que desea activar el protocolo?',
                                                'Se enviara notificación a todos los participantes',
                                                [
                                                    {text: 'Si', onPress: () => {

                                                        this.setState({ sendingNotifications: true })

                                                        let body = JSON.stringify(
                                                            {
                                                                protocolID: item.ID_PROTOCOLO
                                                            }
                                                        )

                                                        fetch('https://udicat.muniguate.com/ave2_api/public/activar_protocolo', {
                                                            method: 'POST',
                                                            headers: {
                                                                'content-type': 'application/json'
                                                            },
                                                            body: body
                                                        })
                                                        .then((response) => response.json())
                                                        .then((responseJson) => {

                                                            console.log(responseJson);

                                                            this.setState({
                                                                sendingNotifications: false,
                                                                resultNotifications: true,
                                                                totalNotifications: responseJson.toString()
                                                            })

                                                        })
                                                        .catch((error) => {

                                                            console.log(error)
                                                            this.setState({ sendingNotifications: false })

                                                        });

                                                    }},
                                                    {text: 'Cancelar'},
                                                ],
                                                )

                                            }}
                                        />

                                    </View>
                                </Card>

                            )
                            )
                        }  */}
                        </ScrollView>

                        <AwesomeAlert
                        show={this.state.sendingNotifications}
                        showProgress={true}
                        title="Enviando"
                        message="Por favor espere un momento!"
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        />

                        <AwesomeAlert
                        show={this.state.resultNotifications}
                        title="Personas Notificadas"
                        message={ this.state.totalNotifications }
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showConfirmButton={true}
                        confirmButtonColor="#DD6B55"
                        confirmText="Aceptar"
                        onConfirmPressed={() => {
                            this.setState({ resultNotifications: false })
                        }}
                        />

                    </View>


                )

            }

        }

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

        this.setState({ isLoading: true })

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            let body = JSON.stringify(
                {
                    name: 'getActivesProtocols3',
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

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardImageStyle: {
        flex: 1
    },
    botonIngreso: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 20
    },
    cardStyle: {
        borderRadius: 25,
        borderTopColor: '#d2d4d8',
        borderRightColor: '#d2d4d8',
        borderBottomColor: '#d2d4d8',
        borderLeftColor: '#d2d4d8',
        borderColor: '#d2d4d8',
        alignContent: 'center',
        justifyContent: 'center',
        borderWidth: 2
    },
    buttonStyle: {
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        borderRadius: 25
    }

});
