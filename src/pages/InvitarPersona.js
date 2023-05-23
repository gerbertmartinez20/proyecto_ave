import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    AsyncStorage,
    ScrollView
} from 'react-native';

import { FormLabel, FormInput, Button, List, ListItem, SearchBar, Icon, Avatar } from 'react-native-elements'

export default class InvitarPersona extends React.Component {

    constructor(props){

        console.log(props)

        super(props);

        this.state = {
            telefono: '',
            nombre: '',
            email: '',
            busqueda: '',
            isSearching: false,
            data: [],
            id_organizacion: props.id_organizacion,
            busqueda_realizada: false,
            isSaving: false
        };

    }

    resultadoBusqueda(){

        let items = this.state.data

        if(items.length <= 0 && this.state.busqueda_realizada){

            return(
                <View style={{ backgroundColor: 'white'}}>
                    <ScrollView
                        style={{ backgroundColor: 'rgb(255, 255, 255)'}}
                        scrollEnabled={true}
                    >
                        <View style={[styles.container, { marginTop: 20 }]}>

                            <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Registro de Usuario AVE</Text>

                            <FormLabel>Nombre</FormLabel>
                            <View style={ styles.inputContainer }>
                                <FormInput
                                    value={this.state.nombre}
                                    onChangeText={ (nombre) => this.setState({nombre}) }
                                    inputStyle={styles.inputBox}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    keyboardType='default'
                                    multiline
                                />
                            </View>

                            <FormLabel>Teléfono</FormLabel>
                            <View style={ styles.inputContainer }>
                                <FormInput
                                    value={this.state.telefono}
                                    onChangeText={ (telefono) => this.setState({telefono}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    keyboardType='numeric'
                                    multiline
                                />
                            </View>

                            <FormLabel>Email</FormLabel>
                            <View style={ styles.inputContainer }>
                                <FormInput
                                    value={this.state.email}
                                    onChangeText={ (email) => this.setState({email}) }
                                    inputStyle={styles.inputMultiline}
                                    containerStyle={{ borderBottomWidth: 0}}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode='while-editing'
                                    keyboardAppearance='dark'
                                    keyboardType='email-address'
                                />
                            </View>

                            <View style={{  alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>

                                <Text style={{ fontWeight: 'bold', fontSize: 16, paddingBottom: 20, width: (Dimensions.get('window').width) - 80 }}>La contraseña por defecto con la que podrá acceder al sistema es 123456.</Text>

                                <Button
                                    icon={{name: 'save', type: 'font-awesome'}}
                                    title='REGISTRAR'
                                    rounded={true}
                                    backgroundColor='green'
                                    loading={ this.state.isSaving }
                                    onPress={ (this.onGuardar.bind(this)) }
                                    loadingRight={true}
                                    disabled={ this.state.isSaving }
                                />

                            </View>

                        </View>
                    </ScrollView>
                </View>
            )

        }else{

            return(

                <View style={{ backgroundColor: 'white', flex: 1 }}>

                    <List containerStyle={{
                        marginTop: 0,
                        borderBottomColor: '#d2d4d8',
                        borderWidth: 0,
                        backgroundColor: 'white',
                        flex: 1
                    }}>

                        {
                            items.map((item, key)=>(

                                <ListItem
                                title={item.NOMBRE}
                                titleNumberOfLines={5}
                                titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
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
                                key={key}
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
                                }}
                                onPressRightIcon={ async ()=> {

                                    const id_persona_invita = await AsyncStorage.getItem('@AVE2:USER_ID')

                                    if (id_persona_invita != null) {
                                        
                                        let body = JSON.stringify(
                                            {
                                                name: 'invitarPersona',
                                                param: {
                                                    id_persona: item.ID_PERSONA,
                                                    id_organizacion: this.state.id_organizacion,
                                                    id_persona_invita: id_persona_invita
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
                                                
                                                Alert.alert(
                                                    'AVE',
                                                    'La persona ha sigo agregada al equipo.',
                                                    [
                                                        {text: 'OK', onPress: () => {
                                                            this.setState({
                                                                data: []
                                                            })
                                                        }}
                                                    ],
                                                    {
                                                        cancelable: false
                                                    }
                                                )

                                            }else{

                                                Alert.alert(
                                                    'Error ' + responseJson.response.status,
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
                                        .catch((error) => {

                                            this.setState({ isLoadingData: false })

                                        });

                                        console.log(body)

                                    }

                                }}
                                // rightIcon={{
                                //     name: 'check',
                                //     size: 30
                                // }}
                                rightIcon={this.icono(item)}
                
                            />    

                            ))
                        }
                </List>
                </View>
            )

        }

    }

    icono(item){

        if (item.EXISTE_EQUIPO) {
            
            return(
                <Icon 
                    name='check'
                    color='green'
                    type='font-awesome'
                />
            )

        }else if(item.EXISTE_INVITACION){

            return(
                <Icon 
                    name='alarm'
                    color='#a83535'
                    type='material-community'
                />
            )

        }
        else{

            return(
                <Icon 
                    name='email'
                    color='#2089dc'
                    type='material-community'
                    onPress={ async () => {

                        const id_persona_invita = await AsyncStorage.getItem('@AVE2:USER_ID')

                        if (id_persona_invita != null) {
                            
                            let body = JSON.stringify(
                                {
                                    name: 'invitarPersona2',
                                    param: {
                                        id_persona: item.ID_PERSONA,
                                        id_organizacion: this.state.id_organizacion,
                                        id_persona_invita: id_persona_invita
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
                            .then( async (responseJson) => {

                                if (responseJson.response.status == 200) {
                                    
                                    Alert.alert(
                                        'AVE',
                                        'La invitación ha sido enviada exitosamente.',
                                        [
                                            {text: 'OK', onPress: () => {
                                               
                                                this.onSearch()

                                            }}
                                        ],
                                        {
                                            cancelable: false
                                        }
                                    )

                                }else{

                                    Alert.alert(
                                        'Error ' + responseJson.response.status,
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
                            .catch((error) => {

                                this.setState({ isLoadingData: false })

                            });

                            console.log(body)

                        }

                    } }
                />
            )

        }

    }

    render() {

        return (
            <View style={{ backgroundColor: 'white', justifyContent: 'center', flex: 1, paddingBottom: 20 }}>
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss } >
                <ScrollView>
                    <View style={{ backgroundColor: 'white' }}>
                    <View 
                        //style={{ backgroundColor: 'white', alignItems: 'center', flex: 1 }}
                        style={{ alignItems: 'center' }}
                    >
                        <FormLabel>Ingrese el número de télefono</FormLabel>
                        <View style={styles.inputContainer}>
                            <FormInput
                                value={this.state.busqueda}
                                onChangeText={ (busqueda) => this.setState({busqueda}) }
                                inputStyle={{ 
                                    fontSize: 24,
                                }}
                                containerStyle={{ borderBottomWidth: 0}}
                                underlineColorAndroid={'transparent'}
                                clearButtonMode='always'
                                keyboardAppearance='dark'
                                keyboardType='numeric'
                            />
                        </View>

                        <View 
                            style={{ alignItems: 'center', justifyContent: 'flex-start', marginTop: 10, marginBottom: 10}}
                        >
                            <Button
                                icon={{name: 'search', type: 'font-awesome'}}
                                title='Buscar'
                                rounded={true}
                                backgroundColor='#2089dc'
                                loading={ this.state.isSearching }
                                onPress={ (this.onSearch.bind(this)) }
                                loadingRight={true}
                                disabled={ this.state.isSearching }
                            />
                        </View>
                    </View>
                    <View 
                        // style={{ flex: 1 }}
                    >

                        { this.resultadoBusqueda() }

                    </View>
                </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            </View>
        );
    }

    async onSearch(){

        this.setState({
            isSearching: true
        })

        const id_usuario = await AsyncStorage.getItem('@AVE2:USER_ID');

        let body = JSON.stringify(
            {
                name: 'buscarPersonasInvitar2',
                param: {
                    busqueda: this.state.busqueda,
                    userID: id_usuario,
                    id_organizacion: this.state.id_organizacion
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

            if (responseJson.response.status == 200) {

                this.setState({
                    data: responseJson.response.result,
                    isSearching: false,
                    busqueda_realizada: true
                })

            }else if(responseJson.response.status == 300){

                this.setState({
                    data: [],
                    isSearching: false,
                    busqueda_realizada: true
                })

                Alert.alert(
                    'AVE',
                    responseJson.response.message,
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

            }else{
                
                Alert.alert(
                    'Error ' + responseJson.response.status,
                    responseJson.response.message,
                    [
                        {text: 'OK'}
                    ],
                    {
                        cancelable: false
                    }
                )

                this.setState({
                    isSearching: false
                })

            }

        })
        .catch((error) => {
            
            this.setState({
                isSearching: false
            })
            
        });

    }

    onGuardar(){

        if(this.state.nombre == ''){

            Alert.alert(
                'Error',
                'Debe ingresar el nombre de la persona',
                [
                    {text: 'OK'}
                ],
                {
                    cancelable: false
                }
            )

        }else if(this.state.telefono == ''){

            Alert.alert(
                'Error',
                'Debe ingresar el número de teléfono de la persona',
                [
                    {text: 'OK'}
                ],
                {
                    cancelable: false
                }
            )

        }
        else{

            this.setState({ isSaving: true })

            // AsyncStorage.getItem('@AVE2:USER_ID')
            // .then((user_id) => {

                

            // })
            // .catch((error) => {

            //     this.setState({ isSaving: false })

            // })

            let body = JSON.stringify(
                {
                    name: 'addPerson',
                    param: {
                        nombre: this.state.nombre,
                        telefono: this.state.telefono,
                        email: this.state.email,
                        id_organizacion: this.state.id_organizacion
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

                    Alert.alert(
                        'AVE',
                        'Registro creado exitosamente.',
                        [
                            {text: 'OK', onPress: () => {

                                // Actions.pop()

                            }

                            }
                        ],
                        {
                            cancelable: false
                        }
                    )

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

                this.setState({ isSaving: false })

            })
            .catch((error) => {

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

                this.setState({ isSaving: false })


            });

        }

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(255, 255, 255)'
        // backgroundColor: 'rgb(255, 255, 255)',
        // alignItems: 'center',
        // paddingBottom: 40
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
        borderLeftColor: '#d2d4d8',
    },

});
