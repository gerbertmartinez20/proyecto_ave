import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Dimensions,
    Linking,
    ScrollView,
    AsyncStorage
} from 'react-native';

import { Avatar, Icon } from 'react-native-elements';

import { Actions } from 'react-native-router-flux';

import { FormLabel, FormInput, Button } from 'react-native-elements'

import { Item, Picker } from "native-base";

import SectionedMultiSelect  from "react-native-sectioned-multi-select";

const items = [
    {
        name: 'Roles',
        id: 0,
        children: [
            {
            name: 'Invitado',
            id: '',
            },
            {
            name: 'Administrador',
            id: 'S',
            },
        ],
    },

];

export default class DetallesIntegranteEquipo extends React.Component {

    constructor(props){

        super(props);

        this.state = {
            id_persona: props.id_persona,
            id_organizacion: props.id_organizacion,
            data: '',
            nombre: '',
            telefono: '',
            email: '',
            rol: [],
            rol_backup: '',
            avatar: '',
            selected: "key1",
            saving: false,
            usuario_edita_administrador: false
        };

    }

    componentDidMount(){

        this.getData()

    }

    onValueChange(value) {

        this.setState({
            rol: value
        });

    }

    onSelectedItemsChange = (selectedItems) => {

        this.setState({ rol: selectedItems });

        console.log(this.state.rol)

    }
    
    cambiarRol(){

        if (this.state.usuario_edita_administrador) {

            if (this.state.rol_backup[0] == this.state.rol[0]) {
                
                return true

            }else{

                return false

            }
        }else{

            return true

        }

    }

    async getData(){

        const id_persona_edita = await AsyncStorage.getItem('@AVE2:USER_ID') 

        let body = JSON.stringify(
            {
                name: 'infoIntegranteEquipo',
                param: {
                    userID: this.state.id_persona,
                    id_organizacion: this.state.id_organizacion,
                    id_persona_edita: id_persona_edita
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
                data: responseJson.response.result,
                nombre: responseJson.response.result.NOMBRE,
                telefono: responseJson.response.result.TELEFONO,
                email: responseJson.response.result.EMAIL,
                rol: [responseJson.response.result.ADMINISTRADOR],
                rol_backup: [responseJson.response.result.ADMINISTRADOR],
                usuario_edita_administrador: responseJson.response.result.USUARIO_EDITA_ADMINISTRADOR
            })

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

    }

    render() {

        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <View
                    style={{
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '30%',
                        backgroundColor: 'rgb(16, 6, 159)',
                        paddingTop: 20, 
                        paddingBottom: 20
                    }}
                >
                    <Avatar 
                        size={100}
                        rounded
                        avatarStyle={{ width: '100%', height: '100%' }}
                        title="Titulo"
                        imageProps={{ resizeMode: 'cover' }}
                        width={100}
                        source={{ uri:  'data:image/jpeg;base64,' + this.state.data.AVATAR }}
                        
                    />

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20 }}>

                        <Icon 
                            reverse
                            raised
                            name='wechat'
                            type='font-awesome'
                            color='#84c2ce'
                            size={14}
                            onPress={()=>{
                                
                                Actions.chat({ id_usuario_recibe: this.state.data.ID_PERSONA, nombre_usuario_recibe: this.state.data.NOMBRE, title: this.state.data.NOMBRE })

                            }}
                        />

                        <Icon 
                            reverse
                            raised
                            name='phone'
                            type='font-awesome'
                            color='green'
                            size={14}
                            onPress={()=>{
                                
                                //Actions.chat({ id_usuario_recibe: this.state.data.ID_PERSONA, nombre_usuario_recibe: this.state.data.NOMBRE, title: this.state.data.NOMBRE })
                                Linking.openURL( `tel:${this.state.data.TELEFONO}`)

                            }}
                        />

                        <Icon 
                            reverse
                            raised
                            name='whatsapp'
                            type='font-awesome'
                            color='#25d366'
                            size={14}
                            onPress={()=>{
                                
                                Linking.openURL( `whatsapp://send?phone=502${this.state.data.TELEFONO}`)

                                //Actions.chat({ id_usuario_recibe: this.state.data.ID_PERSONA, nombre_usuario_recibe: this.state.data.NOMBRE, title: this.state.data.NOMBRE })

                            }}
                        />

                        <Icon 
                            reverse
                            raised
                            name='envelope-o'
                            type='font-awesome'
                            color='#42a4f4'
                            size={14}
                            onPress={()=>{
                                
                                console.log('delete')

                                Linking.openURL( `mailto:${this.state.data.EMAIL}`)

                            }}
                        />

                    </View>

                </View>

                <ScrollView
                    style={{
                        flex: 1,
                        // alignItems: 'center',
                        backgroundColor: 'rgb(255, 255, 255)',
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center'
                        }}
                    >
                    <FormLabel>Nombre</FormLabel>
                    <View style={ styles.inputContainerDisabled }>
                        <FormInput
                            value={this.state.nombre}
                            inputStyle={styles.inputBox}
                            containerStyle={{ borderBottomWidth: 0}}
                            underlineColorAndroid={'transparent'}
                            keyboardAppearance='dark'
                            keyboardType='default'
                            clearButtonMode='while-editing'
                            editable={false}
                            textAlign={'center'}
                        />
                    </View>

                    <FormLabel>Teléfono</FormLabel>
                    <View style={ styles.inputContainerDisabled }>
                        <FormInput
                            value={this.state.telefono}
                            inputStyle={styles.inputBox}
                            containerStyle={{ borderBottomWidth: 0}}
                            underlineColorAndroid={'transparent'}
                            clearButtonMode='while-editing'
                            keyboardAppearance='dark'
                            keyboardType='numeric'
                            editable={false}
                            textAlign={'center'}
                        />
                    </View>
                    <FormLabel>Email</FormLabel>
                    <View style={ styles.inputContainerDisabled }>
                        <FormInput
                            value={this.state.email}
                            inputStyle={styles.inputBox}
                            containerStyle={{ borderBottomWidth: 0}}
                            underlineColorAndroid={'transparent'}
                            clearButtonMode='while-editing'
                            keyboardAppearance='dark'
                            keyboardType='email-address'
                            editable={false}
                            textAlign={'center'}
                        />
                    </View>

                    <FormLabel>Rol</FormLabel>
                    <View style={ styles.inputContainer }>
                        <SectionedMultiSelect
                            single={true}
                            styles={{ fontSize: 20 }}
                            expandDropDowns={true}
                            items={items}
                            uniqueKey='id'
                            subKey='children'
                            selectText='Seleccion un rol'
                            selectedText='seleccionados'
                            searchPlaceholderText='Buscar...'
                            confirmText='Confirmar'
                            showCancelButton={true}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={this.state.rol}
                            showRemoveAll={true}
                            colors={{ cancel: 'red' }}
                            selectChildren={true}
                            showDropDowns={true}
                            readOnlyHeadings={false}
                            highlightChildren={true}
                            styles={{ 
                                itemText: {fontSize: 24},
                                subItemText: {fontSize: 20}
                            }}                            
                            
                        />
                    </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingBottom: 20}}>
                        <Button
                            icon={{name: 'trash-o', type: 'font-awesome'}}
                            title='Eliminar'
                            disabled={!this.state.usuario_edita_administrador}
                            rounded={true}
                            backgroundColor='red'
                            onPress={ () => {

                                Alert.alert(
                                    'Eliminar Persona',
                                    '¿Está seguro?, una vez eliminada no se podrá recuperar',
                                    [
                                        {text: 'Si', onPress: async () => {
                                            
                                            const id_organizacion = await AsyncStorage.getItem('@AVE2:ORGANIZACION_ID')

                                            let body = JSON.stringify(
                                                {
                                                    name: 'deletePerson2',
                                                    param: {
                                                        id_persona: this.state.id_persona,
                                                        id_organizacion: id_organizacion
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
                                                        'Persona eliminada exitosamente.',
                                                        [
                                                            {text: 'OK', onPress: () => {
            
                                                                Actions.pop()
            
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

                                        }},
                                        {text: 'Cancelar'},
                                    ],
                                    {cancelable: true}
                                )

                                

                            }}
                        />

                        <Button
                            icon={{name: 'edit', type: 'font-awesome'}}
                            title='Guardar Cambios'
                            rounded={true}
                            backgroundColor='green'
                            onPress={ () => {

                                this.setState({
                                    saving: true
                                })

                                let body = JSON.stringify(
                                    {
                                        name: 'cambiarRol',
                                        param: {
                                            id_persona: this.state.id_persona,
                                            id_organizacion: this.state.id_organizacion,
                                            rol: this.state.rol[0]
                                            
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

                                        Alert.alert(
                                            'AVE',
                                            'Rol actualizado exitosamente.',
                                            [
                                                {text: 'OK', onPress: () => {

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

                                    this.setState({ saving: false })

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

                                    this.setState({ saving: false })


                                });

                                console.log(body)

                            }}
                            disabled={this.cambiarRol() || this.state.saving}
                            loadingRight={true}
                            loading={this.state.saving}
                        />
                    </View>
                    
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)',

    },
    containerActivityIndicator: {

        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(255, 255, 255)'

    },
    inputBox: {
        width: (Dimensions.get('window').width) - 80,
        fontSize: 18,
        color: '#000000',
        borderBottomWidth: 0,
        borderRadius: 10,
        borderTopColor: '#2089dc',
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
    inputContainerDisabled: {
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
        backgroundColor: 'rgb(228, 228, 228)'

    },
    button: {
        width: 200,
        backgroundColor: 'rgb(0,191,111)'
    },
    buttonPress: {
        width: 200,
        backgroundColor: 'rgb(85, 185, 16)'
    }

});