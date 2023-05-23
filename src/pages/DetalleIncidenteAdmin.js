import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    AsyncStorage,
    ScrollView,
    RefreshControl
} from 'react-native';

import { List, ListItem, SearchBar, Card, Button, Icon, Badge } from 'react-native-elements'

export default class DetalleIncidenteAdmin extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            data: ''
        };

    }

    componentDidMount(){

        this.getData()

    }

    UNSAFE_componentWillReceiveProps(props){

        this.getData()
    }

    getData(){

        this.setState({ isLoading: true })

        AsyncStorage.getItem('@AVE2:INCIDENTE_ID')
        .then((incidente_id) => {

            let body = JSON.stringify(
                {
                    name: 'getIncidentActivities',
                    param: {
                        incidentID: incidente_id
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

                console.log(responseJson);

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

            console.log(error);

        })

    }

    render() {

        if (this.state.isLoading) {

            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>

            )

        }else{

            let items = this.state.data || []

            return (

                <View style={{ flex: 1, backgroundColor: '#ffffff'}}>

                    < SearchBar
                    value={this.state.searchText}
                    onChangeText={ (searchText) => {
                        {/*
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
                        */}

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
                                title={item.NOMBRE}
                                titleNumberOfLines={10}
                                containerStyle={{
                                    borderRadius: 10,
                                    borderColor: '#d2d4d8',
                                    borderWidth: 2
                                }}
                                key={key}
                            >

                                <View style={{ flex: 1, marginBottom: 10}}>

                                    <Text
                                        style={{ fontWeight: 'bold'}}
                                    >
                                        Responsable
                                    </Text>

                                    <Text
                                        style={{ textAlign: 'justify'}}
                                    >
                                        { item.PERSONA }
                                    </Text>

                                </View>

                                <View style={{ flex: 1, marginBottom: 10}}>

                                    <Text
                                        style={{ fontWeight: 'bold'}}
                                    >
                                        Descripción
                                    </Text>

                                    <Text
                                        style={{ textAlign: 'justify'}}
                                    >
                                        { item.DESCRIPCION }
                                    </Text>

                                </View>



                                <View style={{ height: 40, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                                    <View style={{ justifyContent: 'center', alignItems: 'flex-start'}}>
                                        <Text style={{ fontWeight: 'bold'}}>
                                        Estado
                                        </Text>

                                        {/* <Badge containerStyle={{ backgroundColor: item.FECHA_FINALIZACION ? 'green' : 'red'}}>

                                        </Badge> */}
                                         <Text style={{ fontWeight: 'bold', color: item.FECHA_FINALIZACION ? 'green' : 'red'}}>{ item.FECHA_FINALIZACION ? 'Realizada' : 'Pendiente' }</Text>

                                    </View>

                                    <View style={{ justifyContent: 'center', alignItems: 'center'}}>



                                    </View>

                                </View>

                                <Fecha fecha_finalizacion={item.FECHA_FINALIZACION} />

                                <Comentario comentario={item.COMENTARIO} />

                            </Card>

                        )
                        )
                    }
                    </ScrollView>

                </View>

            );
        }
    }

}

const Comentario = (props) => {

    if (props.comentario != null) {

        return (

            <View style={{ backgroundColor: 'rgb(241, 240, 123)', borderWidth: 2, borderColor: 'black', borderRadius: 10, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5}}>
                <Text style={{ fontWeight: 'bold'}}>Comentario</Text>
                <Text style={{ textAlign: 'justify'}}>{ props.comentario }</Text>
            </View>

        )

    }else {

        return (

            <View>
            </View>

        )
    }

}

const Fecha = (props) => {

    if (props.fecha_finalizacion != null) {

        return (
            <View style={{ paddingTop: 10}}>
                <Text style={{ fontWeight: 'bold'}}>
                    {props.fecha_finalizacion}
                </Text>
            </View>
        )

    }else{

        return (

            <View>
            </View>

        )

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)'

    },

});
