import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    ActivityIndicator,
    ScrollView,
    Image,
    Dimensions,
    AsyncStorage
} from 'react-native';

import { Card, ListItem, List} from 'react-native-elements'

import { Actions } from 'react-native-router-flux';

export default class Login extends React.Component {

    _isMounted = false
    elevation = 10
    shadow_height = 2

    constructor(props){
        super(props);

        this.state = {

            notificaciones_not_readead: '',
            incidentes_en_curso: ''

        }
    }

    componentDidMount(){

        //Obtener el número de mensajes sin leer
        this._isMounted = true
        this._getData()

    }

    componentWillUnmount(){

        this._isMounted = false

    }

    UNSAFE_componentWillReceiveProps(props){

        this._getData()

    }

    _getData = async () => {

        if (this._isMounted) {
        
            try {
                const id_persona = await AsyncStorage.getItem('@AVE2:USER_ID')

                let body = JSON.stringify(
                    {
                        name: 'getNumberNotifications',
                        param: {
                            userID: id_persona
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
                        notificaciones_not_readead: responseJson.response.result.TOTAL,
                        incidentes_en_curso: responseJson.response.result.EN_CURSO
                    })

                })

            } catch (error) {
                
            }

        }

    }

    render() {

        return (

            <View style={{ flex: 1, backgroundColor: 'white' }}>

                <View style={{ 
                    flex: 1, 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '10%',
                    backgroundColor: 'rgb(16, 6, 159)',
                }}>

                    
                    <Image 
                        style={{ 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            borderRadius: 20,
                            resizeMode: "contain",
                            width: '100%', 
                            height: '100%',
                        }} 
                        resizeMode={"contain"}
                        source={ require('../images/icono_ave.png') } />
                    

                </View>

                <View style={{ height: '90%'}}>

                    <List containerStyle={{
                        marginTop: 0,
                        flex: 1,
                        borderBottomColor: '#2089dc',
                        borderWidth: 0                    
                    }}>
                        <ScrollView
                            style={{ backgroundColor: 'transparent'}}
                            contentContainerStyle={{ borderWidth: 0}}
                            showsVerticalScrollIndicator={false}
                            scrollsToTop={false}
                            
                        >
                            
                            <Card  
                                containerStyle={{ 
                                    borderRadius: 25, 
                                    // elevation: this.elevation, 
                                    // shadowColor: '#000',
                                    // shadowOffset: { width: 0, height: this.shadow_height },
                                    // shadowOpacity: 0.5,
                                    // shadowRadius: 2,
                                }}
                            >

                                <ListItem 
                                    onPress={ (this.onProtocolos.bind(this))}
                                    roundAvatar
                                    avatar={require('../images/checklist.png') }
                                    avatarStyle={{ width: 70, height: 70 }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Protocolos"
                                    hideChevron={true}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                
                            </Card>

                            <Card  
                                containerStyle={{ 
                                    borderRadius: 25, 
                                    // elevation: this.elevation,
                                    // shadowColor: '#000',
                                    // shadowOffset: { width: 0, height: this.shadow_height },
                                    // shadowOpacity: 0.5,
                                    // shadowRadius: 2,
                                }}
                            >

                                <ListItem 
                                    onPress={ (this.onAlertas.bind(this)) }
                                    roundAvatar
                                    avatar={ require('../images/alarm.png') }
                                    avatarStyle={{ width: 70, height: 70, backgroundColor: 'white' }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Alertas"
                                    hideChevron={true}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                

                            </Card>

                            {/* <Card  
                                containerStyle={{ 
                                    borderRadius: 25, 
                                    // elevation: this.elevation,
                                    // shadowColor: '#000',
                                    // shadowOffset: { width: 0, height: this.shadow_height },
                                    // shadowOpacity: 0.5,
                                    // shadowRadius: 2,
                                }}
                            >

                                <ListItem 
                                    onPress={ (this.onNoticias.bind(this)) }
                                    roundAvatar
                                    avatar={ require('../images/newspaper.png') }
                                    avatarStyle={{ width: 70, height: 70, backgroundColor: 'white' }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Noticias"
                                    hideChevron={true}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                

                            </Card> */}

                            <Card  
                                containerStyle={{ 
                                    borderRadius: 25, 
                                    // elevation: this.elevation,
                                    // shadowColor: '#000',
                                    // shadowOffset: { width: 0, height: this.shadow_height },
                                    // shadowOpacity: 0.5,
                                    // shadowRadius: 2, 
                                }}
                            >

                                <ListItem 
                                    roundAvatar
                                    onPress={ (this.onEquipo.bind(this)) }
                                    avatar={ require('../images/team.png') }
                                    avatarStyle={{ width: 70, height: 70, backgroundColor: 'white', marginRight: 10 }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Equipos"
                                    hideChevron={true}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                

                            </Card>

                            <Card  
                                containerStyle={{ 
                                    borderRadius: 25, 
                                    // elevation: this.elevation,
                                    // shadowColor: '#000',
                                    // shadowOffset: { width: 0, height: this.shadow_height },
                                    // shadowOpacity: 0.5,
                                    // shadowRadius: 2, 
                                }}
                            >

                                <ListItem 
                                    roundAvatar
                                    onPress={ (this.onNotificaciones.bind(this)) }
                                    avatar={ require('../images/open-email.png') }
                                    avatarStyle={{ width: 60, height: 60, backgroundColor: 'white' }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Notificaciones"
                                    hideChevron={true}
                                    badge={{ 
                                        value: this.state.notificaciones_not_readead, 
                                        textStyle: { 
                                            color: 'white', 
                                            fontSize: 20 
                                        }, 
                                        containerStyle: { 
                                            backgroundColor: this.state.notificaciones_not_readead > 0 ? 'red' : 'white' 
                                        } }}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                

                            </Card>

                            <Card  
                                containerStyle={{ 
                                    borderRadius: 25, 
                                    // elevation: this.elevation,
                                    // shadowColor: '#000',
                                    // shadowOffset: { width: 0, height: this.shadow_height },
                                    // shadowOpacity: 0.5,
                                    // shadowRadius: 2, 
                                }}
                            >
                                <ListItem 
                                    roundAvatar
                                    onPress={ (this.onEnCurso.bind(this)) }
                                    avatar={ require('../images/in-progress.png') }
                                    avatarStyle={{ width: 60, height: 60, backgroundColor: 'white' }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="En Curso"
                                    badge={{ 
                                        value: this.state.incidentes_en_curso, 
                                        textStyle: { 
                                            color: 'white', 
                                            fontSize: 20 
                                        }, 
                                        containerStyle: { 
                                            backgroundColor: this.state.incidentes_en_curso > 0 ? 'red' : 'white' 
                                        } }}
                                    hideChevron={true}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                
                            </Card>
                            
                            <Card  
                                containerStyle={{ 
                                    borderRadius: 25, 
                                    // elevation: this.elevation,
                                    // shadowColor: '#000',
                                    // shadowOffset: { width: 0, height: this.shadow_height },
                                    // shadowOpacity: 0.5,
                                    // shadowRadius: 2, 
                                    marginBottom: 10
                                }}
                            >
                                <ListItem 
                                    onPress={ (this.onSinConexion.bind(this)) }
                                    roundAvatar
                                    avatar={ require('../images/no-wifi.png') }
                                    avatarStyle={{ width: 60, height: 60, backgroundColor: 'white' }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Sin Conexion"
                                    hideChevron={true}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                
                            </Card>
                        
                        </ScrollView>

                    </List>

                </View>

            </View>

        )
    }

    onProtocolos(){

        Actions.protocolos()
    }

    onAlertas(){
        Actions.tabs_alertas()
    }

    onNoticias(){
        Actions.noticias()
    }

    onActividades(){
        Actions.actividades()
    }

    onNotificaciones(){
        Actions.tabs_notificaciones()
    }

    onEquipo(){
        Actions.equipo()
    }

    onEnCurso(){

        Actions.en_curso()

    }

    onSinConexion(){

        Actions.sin_conexion()

    }
}

const Item_Notificaciones = (props) => {

    return(
        <ListItem 
            roundAvatar
            onPress={ (this.onNotificaciones.bind(this)) }
            avatar={ require('../images/open-email.png') }
            avatarStyle={{ width: 60, height: 60, backgroundColor: 'white' }}
            avatarContainerStyle={{ width: 50, height: 50 }}
            containerStyle={{ borderBottomWidth: 0 }}
            title="Notificaciones"
            hideChevron={true}
            badge={{ value: this.state.notificaciones_not_readead, textStyle: { color: 'white', fontSize: 20 }, containerStyle: { backgroundColor: 'red' } }}
            titleContainerStyle={{ paddingLeft: 20 }}
            subtitleStyle={{ paddingLeft: 20 }}
            titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
        />
    )

}

const styles = StyleSheet.create({

    superContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#ffffff',

    },
    scrollView: {
        width: Dimensions.get('window').width,
        flex: 1,
        backgroundColor: '#ffffff'
    },
    botonIngreso: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardStyle: {
        borderRadius: 25,
        height: 180,
        borderTopColor: '#2089dc',
        borderRightColor: '#2089dc',
        borderBottomColor: '#2089dc',
        borderLeftColor: '#2089dc',
        borderColor: '#2089dc',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonStyle: {
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        width: 160,
        borderRadius: 25
    }

});
