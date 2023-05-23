import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    RefreshControl,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions
} from 'react-native';

import { SearchBar, Card, Button, Icon, FormLabel, FormInput } from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

import ProgressCircle from 'react-native-progress-circle';

import Modal from "react-native-modal";

import CheckAdmin from '../functions/checkAdmin';

export default class EnCurso extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            data:'',
            isRefreshing: false,
            searchText: '',
            searching: false,
            isModalVisible: false,
            evacuados: '',
            heridos: '',
            fallecidos: '',
            notas: '',
            id_incidente: '',
            showFiltro: false,
            showEnded: false,
            isUserAdmin: false

        };
    }

    _toggleModal(){

        this.setState({ isModalVisible: !this.state.isModalVisible })

    }

    async componentDidMount(){

        this.getIncidents()

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')
        
        let check = new CheckAdmin()
        let userAdmin = await check.check(id_usuario)

        this.setState({
            isUserAdmin: userAdmin
        })

    }

    botonFinalizar(id_incidente, fecha_finalizacion, administrador){

        if(!fecha_finalizacion){
            return(
                <Button
                    title='Finalizar'
                    rounded={true}
                    icon={{name: 'check-circle', type: 'font-awesome'}}
                    backgroundColor="red"
                    disabled={!administrador}
                    onPress={ () =>  {
                        // this.setState({
                        //     evacuados: '',
                        //     heridos: '',
                        //     fallecidos: '',
                        //     notas: '',
                        //     id_incidente: id_incidente,
                        //     isModalVisible: true,
                        // })

                        Alert.alert(
                            '¿Está seguro que desea finalizar el protocolo?',
                            'Los participantes ya no podrán finalizar sus actividades',
                            [
                                {text: 'Si', onPress: () => {

                                    let body = JSON.stringify(
                                        {
                                            name: 'endProtocol',
                                            param: {
                                                id_incidente: id_incidente,
                                                // evacuados: this.state.evacuados,
                                                // heridos: this.state.heridos,
                                                // fallecidos: this.state.fallecidos,
                                                // notas: this.state.notas
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

                                        Alert.alert(
                                            'AVE',
                                            'Incidente finalizado exitosamente.',
                                            [
                                                {text: 'OK', onPress: () => {
                
                                                    this.getIncidents()
                
                                                }
                
                                                }
                                            ],
                                            {
                                                cancelable: false
                                            }
                                        )

                                    })

                                }},
                                {text: 'Cancelar'},
                            ],
                            )
                    }}
                >
                </Button>
            )
        }else{
            return(
                <View></View>
            )
        }
    }

    textoIncidentes(){
        if (this.state.showEnded) {

            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
                    <Text
                        style={{ fontSize: 24, fontWeight: 'bold' }}
                    >
                        Incidentes Finalizados
                    </Text>
                </View>

            ) 

        }else{

            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
                    <Text
                        style={{ fontSize: 24, fontWeight: 'bold' }}
                    >
                        Incidentes En Curso
                    </Text>
                </View>
            )

        }
        
    }

    textoFinalizado(evacuados, heridos, fallecidos, notas){

        if (this.state.showEnded) {
            
            return (
                <View style={{ flex: 1, width: '100%', marginTop: 20, marginLeft: 10, borderWidth: 2, padding: 10, borderRadius: 5, backgroundColor: 'rgb(241, 240, 123)' }}>
                    <View style={{ flexDirection: 'row'}}>
                        <Text>Evacuados: </Text>
                        <Text style={{ fontWeight: 'bold'}}> {evacuados} </Text>
                    </View>
                    <View style={{ flexDirection: 'row'}}>
                        <Text>Heridos: </Text>
                        <Text style={{ fontWeight: 'bold'}}> {heridos} </Text>
                    </View>
                    <View style={{ flexDirection: 'row'}}>
                        <Text>Fallecidos: </Text>
                        <Text style={{ fontWeight: 'bold'}}> {fallecidos} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginRight: 25}}>
                        <Text>Notas: </Text>
                        <Text style={{ fontWeight: 'bold'}}> {notas} </Text>
                    </View>
                </View>
            )

        }else{

            return(
                <View>
                </View>
            )

        }

    }

    UNSAFE_componentWillReceiveProps(props){

        if (props.filtro) {

            this.setState({
                showFiltro: true
            })

            props.filtro = false

        }else{
            this.getIncidents()
        }
    }

    getIncidents(){

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
                    name: 'getIncidents2',
                    param: {
                        userID: valor,
                        ended: this.state.showEnded
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
                    name: 'getIncidents2',
                    param: {
                        userID: valor,
                        ended: this.state.showEnded
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

    activadoPor(item){

        if (item.ACTIVADO_POR) {
            
            return(

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text>Activado por: </Text>
                    <Text style={{ fontWeight: 'bold'}}>{ item.ACTIVADO_POR }</Text>
                </View>

            )

        }
        
    }

    render() {

        if (this.state.isLoading) {

            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>
            );

        }else{

            let items = this.state.data || []

            if (items.length <= 0) {
                
                return(

                    <View style={{ flex: 1, backgroundColor: '#ffffff'}}>

                        {this.textoIncidentes()}

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

                        <Modal
                            style={{                     
                                borderColor: "rgba(0, 0, 0, 0.1)" ,
                                justifyContent: "flex-end",
                                margin: 0,
                            }}
                            isVisible={this.state.showFiltro}
                            swipeDirection="down"
                            onSwipe={() => this.setState({ showFiltro: false })}
                        >
                            <View style={{ backgroundColor: 'white', borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
                                <Icon
                                    name='angle-down'
                                    type='font-awesome'
                                    color='#d2d4d8'
                                    size={40}
                                    containerStyle={{ borderBottomWidth: 2, marginRight: 20, marginLeft: 20, borderColor: '#d2d4d8' }}
                                    onPress={ () => this.setState({ showFiltro: false }) }
                                />

                                <View style={{ paddingTop: 20, flexDirection: 'column', justifyContent: 'space-around' }}>
                                    <Button
                                        large
                                        icon={{name: 'clock-o', type: 'font-awesome'}}
                                        title='INCIDENTES EN CURSO'
                                        backgroundColor='green'
                                        buttonStyle={{ paddingBottom: 20, borderRadius: 25, marginBottom: 20 }}
                                        containerStyle={{ paddingBottom: 20, marginBottom: 20 }}
                                        onPress={ () => {
                                            console.log('Filtrar por incidentes en curso')

                                            this.setState({
                                                showEnded: false
                                            })

                                            this.getIncidents()

                                            this.setState({
                                                showFiltro: false
                                            })

                                        } }
                                    >

                                    </Button>

                                    <Button
                                        large
                                        icon={{name: 'check', type: 'font-awesome'}}
                                        title='INCIDENTES FINALIZADOS'
                                        backgroundColor='red'
                                        buttonStyle={{ paddingBottom: 20, borderRadius: 25, marginBottom: 20 }}
                                        onPress={ () => {
                                            console.log('Filtrar por incidentes finalizados')
                                            this.setState({
                                                showEnded: true
                                            })

                                            this.getIncidents()

                                            this.setState({
                                                showFiltro: false
                                            })
                                        }}
                                    >

                                    </Button>
                                </View>

                            </View>
                        </Modal>

                    </View>

                )

            }else {

                return (
                    <View style={{ flex: 1, backgroundColor: '#ffffff'}}>

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

                        {this.textoIncidentes()}

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

                                        <View style={{ flexDirection: 'row'}}>

                                            <View style={{ width: '30%', justifyContent: 'center', alignItems: 'center'}}>

                                            <ProgressCircle
                                                percent={item.PORCENTAJE}
                                                radius={50}
                                                borderWidth={8}
                                                color="#3399FF"
                                                shadowColor="#999"
                                                bgColor="#fff"
                                            >
                                                <Text style={{ fontSize: 18 }}>{item.PORCENTAJE + '%'}</Text>
                                            </ProgressCircle>

                                            </View>

                                            <View style={{ width: '70%', alignItems: 'flex-start',  padding: 10}}>

                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text>Fecha: </Text>
                                                    <Text style={{ fontWeight: 'bold'}}>{item.FECHA_ACTIVACION}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text>Actividades pendientes: </Text>
                                                    <Text style={{ fontWeight: 'bold'}}>{ item.ACTIVIDADES_PENDIENTES }</Text>
                                                </View>
                                                
                                                { this.activadoPor(item) }

                                                {/* {this.textoFinalizado(item.EVACUADOS, item.HERIDOS, item.FALLECIDOS, item.NOTAS)} */}

                                            </View>

                                        </View>

                                        <View style={{ flexDirection: 'row', paddingTop: 30, alignItems: 'center', justifyContent: 'center'}}>
                                            <Button
                                                title="Detalles"
                                                icon={{name: 'eye', type: 'font-awesome'}}
                                                rounded={true}
                                                buttonStyle={styles.buttonStyle}
                                                backgroundColor="#2089dc"
                                                onPress={ () => {

                                                    //Validar si el usuario es administrador o invitado
                                                    //this.checkAdministrador(item)

                                                    AsyncStorage.setItem('@AVE2:INCIDENTE_ID', (item.ID_CORRELATIVO).toString())
                                                    .then((valor) => {

                                                        if (item.ADMINISTRADOR) {
                                                        
                                                            Actions.tabs_detalle_incidente_admin()
    
                                                        }else{
    
                                                            Actions.detalles_incidente_user()
    
                                                        }
    
                                                    })
                                                    .catch((error) => {

                                                        console.warn(error);

                                                    })


                                                }}

                                            >
                                            </Button>    

                                            {this.botonFinalizar(item.ID_CORRELATIVO, item.FECHA_FINALIZACION, item.ADMINISTRADOR)}

                                        </View>

                                        {/* Activado por */}
                                        <View>
                                            
                                        </View>

                                        <Modal
                                            style={{ 
                                                flex: 1,    
                                                backgroundColor: "white",
                                                borderTopRightRadius: 25,
                                                borderTopLeftRadius: 25,
                                                borderColor: "rgba(0, 0, 0, 0.1)" ,
                                                justifyContent: "flex-end",
                                                margin: 0,
                                                marginTop: 30
                                            }}
                                            isVisible={this.state.isModalVisible}
                                            swipeDirection="down"
                                            onSwipe={() => this.setState({ isModalVisible: false })}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Icon
                                                    name='angle-down'
                                                    type='font-awesome'
                                                    color='#d2d4d8'
                                                    size={40}
                                                    containerStyle={{ borderBottomWidth: 2, marginRight: 20, marginLeft: 20, borderColor: '#d2d4d8' }}
                                                    onPress={ (this._toggleModal.bind(this)) } 
                                                />
                                                    <TouchableWithoutFeedback onPress={ Keyboard.dismiss } style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}} ref="foo" accesible={false}>
                                                        <ScrollView>
                                                            <View style={styles.container}>
                                                                <View style={{ marginLeft: 20 }}>
                                                                    <FormLabel>Número de Evacuados</FormLabel>
                                                                    <View style={ styles.inputContainer }>
                                                                        <FormInput
                                                                            value={this.state.evavuados}
                                                                            onChangeText={ (evacuados) => this.setState({evacuados}) }
                                                                            inputStyle={styles.inputBox}
                                                                            containerStyle={{ borderBottomWidth: 0}}
                                                                            underlineColorAndroid={'transparent'}
                                                                            clearButtonMode='while-editing'
                                                                            keyboardAppearance='dark'
                                                                            keyboardType='numeric'
                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ marginLeft: 20 }}>
                                                                    <FormLabel>Número de Heridos</FormLabel>
                                                                    <View style={ styles.inputContainer }>
                                                                        <FormInput
                                                                            value={this.state.heridos}
                                                                            onChangeText={ (heridos) => this.setState({heridos}) }
                                                                            inputStyle={styles.inputBox}
                                                                            containerStyle={{ borderBottomWidth: 0}}
                                                                            underlineColorAndroid={'transparent'}
                                                                            clearButtonMode='while-editing'
                                                                            keyboardAppearance='dark'
                                                                            keyboardType='numeric'
                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ marginLeft: 20 }}>
                                                                    <FormLabel>Número de Fallecidos</FormLabel>
                                                                    <View style={ styles.inputContainer }>
                                                                        <FormInput
                                                                            value={this.state.fallecidos}
                                                                            onChangeText={ (fallecidos) => this.setState({fallecidos}) }
                                                                            inputStyle={styles.inputBox}
                                                                            containerStyle={{ borderBottomWidth: 0, width: '50%'}}
                                                                            underlineColorAndroid={'transparent'}
                                                                            clearButtonMode='while-editing'
                                                                            keyboardAppearance='dark'
                                                                            keyboardType='numeric'
                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ marginLeft: 20 }}>
                                                                    <FormLabel>Notas</FormLabel>
                                                                    <View style={ styles.inputContainer2 }>
                                                                        <FormInput
                                                                            value= {this.state.notas}
                                                                            onChangeText={ (notas) => this.setState({notas}) }
                                                                            inputStyle={styles.inputMultiline}
                                                                            containerStyle={{ borderBottomWidth: 0}}
                                                                            underlineColorAndroid={'transparent'}
                                                                            clearButtonMode='while-editing'
                                                                            keyboardAppearance='dark'
                                                                            keyboardType='default'
                                                                            multiline
                                                                            editable={true}
                                                                        />
                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 20}}>
                                                                    <Button
                                                                        large
                                                                        icon={{name: 'save', type: 'font-awesome'}}
                                                                        title='GUARDAR'
                                                                        rounded={true}
                                                                        backgroundColor='#2089dc'
                                                                        loading={ this.state.isSaving }
                                                                        loadingRight={true}
                                                                        disabled={ this.state.isSaving }
                                                                        onPress={ () => {

                                                                            this.setState({
                                                                                isSaving: true
                                                                            })

                                                                            let body = JSON.stringify(
                                                                                {
                                                                                    name: 'endProtocol',
                                                                                    param: {
                                                                                        id_incidente: this.state.id_incidente,
                                                                                        // evacuados: this.state.evacuados,
                                                                                        // heridos: this.state.heridos,
                                                                                        // fallecidos: this.state.fallecidos,
                                                                                        // notas: this.state.notas
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

                                                                                Alert.alert(
                                                                                    'AVE',
                                                                                    'Incidente finalizado exitosamente.',
                                                                                    [
                                                                                        {text: 'OK', onPress: () => {
                                                        
                                                                                            this.setState({
                                                                                                isSaving: false,
                                                                                                isModalVisible: false
                                                                                            })
                
                                                                                            this.getIncidents()
                                                        
                                                                                        }
                                                        
                                                                                        }
                                                                                    ],
                                                                                    {
                                                                                        cancelable: false
                                                                                    }
                                                                                )

                                                                            })

                                                                        }}
                                                                    />
                                                                </View>
                                                            </View>
                                                        </ScrollView>    
                                                    </TouchableWithoutFeedback>
                                            </View>    
                                        </Modal>
                                    </View>

                                </Card>

                            ))
                        }

                        </ScrollView>

                        <Modal
                            style={{                     
                                borderColor: "rgba(0, 0, 0, 0.1)" ,
                                justifyContent: "flex-end",
                                margin: 0,
                            }}
                            isVisible={this.state.showFiltro}
                            swipeDirection="down"
                            onSwipe={() => this.setState({ showFiltro: false })}
                        >
                            <View style={{ backgroundColor: 'white', borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
                                <Icon
                                    name='angle-down'
                                    type='font-awesome'
                                    color='#d2d4d8'
                                    size={40}
                                    containerStyle={{ borderBottomWidth: 2, marginRight: 20, marginLeft: 20, borderColor: '#d2d4d8' }}
                                    onPress={ () => this.setState({ showFiltro: false }) }
                                />

                                <View style={{ paddingTop: 20, flexDirection: 'column', justifyContent: 'space-around' }}>
                                    <Button
                                        large
                                        icon={{name: 'clock-o', type: 'font-awesome'}}
                                        title='INCIDENTES EN CURSO'
                                        backgroundColor='green'
                                        buttonStyle={{ paddingBottom: 20, borderRadius: 25, marginBottom: 20 }}
                                        containerStyle={{ paddingBottom: 20, marginBottom: 20 }}
                                        onPress={ () => {
                                            console.log('Filtrar por incidentes en curso')

                                            this.setState({
                                                showEnded: false
                                            })

                                            this.getIncidents()

                                            this.setState({
                                                showFiltro: false
                                            })

                                        } }
                                    >

                                    </Button>

                                    <Button
                                        large
                                        icon={{name: 'check', type: 'font-awesome'}}
                                        title='INCIDENTES FINALIZADOS'
                                        backgroundColor='red'
                                        buttonStyle={{ paddingBottom: 20, borderRadius: 25, marginBottom: 20 }}
                                        onPress={ () => {
                                            console.log('Filtrar por incidentes finalizados')
                                            this.setState({
                                                showEnded: true
                                            })

                                            this.getIncidents()

                                            this.setState({
                                                showFiltro: false
                                            })
                                        }}
                                    >

                                    </Button>
                                </View>

                            </View>
                        </Modal>

                    </View>
                );

            }
        }

    }

    async checkAdministrador(item){

        console.log(item)

        // const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID')

        // let body = JSON.stringify(
        //     {
        //         name: 'administradorEquipo',
        //         param: {
        //             id_correlativo: item.ID_CORRELATIVO,
        //             id_usuario: id_usuario
        //         }
        //     }
        // )

        // fetch('https://udicat.muniguate.com/apps/ave_api/', {
            
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'CONTENT-TYPE': 'application/json'
        //     },
        //     body: body
        // })
        // .then((response) => response.json())
        // .then((responseJson) => {

        //     console.log(responseJson)

        // })

        // console.log(body)

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)'
    },
    buttonStyle: {
    },
    inputContainer: {
        width: (Dimensions.get('window').width) - 50,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        borderRightColor: '#d2d4d8',
        borderBottomColor: '#d2d4d8',
        borderLeftColor: '#d2d4d8'
    },
    inputContainer2: {
        width: (Dimensions.get('window').width) - 50,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        borderRightColor: '#d2d4d8',
        borderBottomColor: '#d2d4d8',
        borderLeftColor: '#d2d4d8'
    },
    inputMultiline: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
        alignItems: 'flex-start',
        height: 200,
        textAlignVertical: 'top'
    },
    inputBox: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#d2d4d8',
    },

});
