import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    AsyncStorage
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import { Card, ListItem, List} from 'react-native-elements'

import { Avatar } from 'react-native-elements';

export default class Login extends React.Component {

    elevation = 5

    constructor(props){
        super(props);

        this.state = {

            isDataLoad: false,
            userID: '',
            userName: '',
            userPhone: '',
            userMail: '',
            avatarSource: ''

        }

    }

    componentDidMount(){

        this.loadData()

    }

    componentWillReceiveProps(nextProps){
        this.loadData()
    }

    loadData(){

        AsyncStorage.getItem('@AVE2:USER_ID')
        .then((valor) => {

            if (valor != null) {

                let body = JSON.stringify(
                    {
                        name: 'userInfo',
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

                    console.log(responseJson.response)

                    this.setState({ userName: responseJson.response.result.NOMBRE })
                    this.setState({ userPhone: responseJson.response.result.TELEFONO })
                    this.setState({ userMail: responseJson.response.result.EMAIL })
                    this.setState({ avatarSource: responseJson.response.result.AVATAR })
                    this.setState({ isDataLoad: true })

                })
                .catch((error) => {

                });

            }else{

            }

        })
        .catch((error) => {
            console.warn(error);
        })

    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                
                <View
                    style={{
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '30%',
                        backgroundColor: 'rgb(16, 6, 159)',
                    }}
                >

                    <Avatar 
                        size={100}
                        rounded
                        avatarStyle={{ width: '100%', height: '100%' }}
                        source={{ uri:  'data:image/jpeg;base64,' + this.state.avatarSource }}
                        title="Titulo"
                        imageProps={{ resizeMode: 'cover' }}
                        width={100}
                        
                    />

                    <Text style={{ color: 'white', paddingTop: 5, fontSize: 20 }}>
                        { this.state.userName }
                    </Text>
                    {/* 
                    <Text style={{ color: 'white', paddingTop: 5, fontSize: 10, fontWeight: 'bold' }}>
                        Administrador
                    </Text>
                    */}

                </View>

                <View style={{ height: '70%'}}>

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
                                containerStyle={{ borderRadius: 25 }}
                           >           
                                <ListItem 
                                    onPress={ (this.onMiCuenta.bind(this)) }
                                    roundAvatar
                                    avatar={ require('../images/account.png') }
                                    avatarStyle={{ width: 60, height: 60, backgroundColor: 'white' }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Mi Cuenta"
                                    hideChevron={true}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                
                            </Card>

                            <Card  
                                containerStyle={{ borderRadius: 25 }}
                            >
                                <ListItem 
                                    onPress={ (this.onSeguridad.bind(this)) }
                                    roundAvatar
                                    avatar={ require('../images/locked.png') }
                                    avatarStyle={{ width: 60, height: 60, backgroundColor: 'white' }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Seguridad"
                                    hideChevron={true}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                
                            </Card>

                            <Card  
                                containerStyle={{ borderRadius: 25 }}
                            >
                                <ListItem 
                                    onPress={ () => {
                                        Actions.tutorial()
                                    }}
                                    roundAvatar
                                    avatar={ require('../images/question.png') }
                                    avatarStyle={{ width: 60, height: 60, backgroundColor: 'white' }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Ayuda"
                                    hideChevron={true}
                                    titleContainerStyle={{ paddingLeft: 20 }}
                                    subtitleStyle={{ paddingLeft: 20 }}
                                    titleStyle={{ fontSize: 25, fontWeight: 'bold' }}
                                />
                                
                            </Card>

                            <Card  
                                containerStyle={{ borderRadius: 25, marginBottom: 10 }}
                            >
                                <ListItem 
                                    onPress={ (this.onSalir.bind(this)) }
                                    roundAvatar
                                    avatar={ require('../images/exit.png') }
                                    avatarStyle={{ width: 60, height: 60, backgroundColor: 'white' }}
                                    avatarContainerStyle={{ width: 50, height: 50 }}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    title="Salir"
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
        );
    }

    onMiCuenta(){
        Actions.mi_cuenta()
    }

    onSeguridad(){
        Actions.seguridad()
    }

    onSalir(){

        Alert.alert(
            'AVE',
            '¿Está seguro que desea salir?',
            [
                {text: 'Salir', onPress: () => {

                    AsyncStorage.removeItem('@AVE2:USER_ADMIN')
                    .then((valor) => {

                    })
                    .catch((error) => {
                        console.warn(error);
                    })

                    AsyncStorage.removeItem('@AVE2:USER_ID')
                    .then((valor) => {

                        Actions.reset('login_routes')

                    })
                    .catch((error) => {
                        console.warn(error);
                    })


                }},
                {text: 'Cancelar'}
            ],
            { cancelable: false }
        )

    }


}

const Datos = (props) => {



}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)'

    },
    button: {

        width: 200,
        borderRadius: 25,
        backgroundColor: 'rgb(18, 37, 204)',
        marginVertical: 20,

    },
    buttonText: {

        fontSize: 24,
        fontWeight: '500',
        color: 'rgb(255, 255, 255)',
        textAlign: 'center',
        alignContent: 'center'

    },

});
