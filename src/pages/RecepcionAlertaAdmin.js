import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';

import { Icon } from 'react-native-elements'

import { Card, CardItem,  Body, Left, Thumbnail, Text, Badge  } from 'native-base';

import ViewMoreText from 'react-native-view-more-text'

import AwesomeAlert from 'react-native-awesome-alerts';

export default class DetalleProtocoloAdmin extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            data: [],
            reenviar_alerta: false,
            reenviando: false,
            item_reenvio: []
        };

        this.interval = null

    }

    componentDidMount(){

        this.getData(true)

        this.interval = setInterval( () => { this.getData(false) }, 1000 )

    }


    componentWillUnmount(){

        clearInterval(this.interval);

    }

    renderViewMore(onPress){
        return(
            <Text style={{ color: '#2089dc', fontWeight: 'bold' }} onPress={onPress}>Ver más</Text>
        )
    }

    renderViewLess(onPress){
        return(
            <Text style={{ color: '#2089dc', fontWeight: 'bold' }} onPress={onPress}>Ver menos</Text>
        )
    }

    iconReenviarAlerta(item){

        if (!item.FECHA_LECTURA) {
            return(
                <Icon 
                    name='repeat'
                    color='#2089dc'
                    type='font-awesome'
                    onPress={ () => {
                        console.log('volver a enviar')
                        this.setState({
                            reenviar_alerta: true,
                            item_reenvio: item
                        })
                    }}
                />
            )
        }
        
    }

    render() {

        let items = this.state.data.MENSAJES_ENVIADOS || []

        if (this.state.isLoading) {

            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}} >

                    <ActivityIndicator size='large' />

                </View>
            );

        }else{

            return (
                <View style={styles.container}>
                    <ScrollView>

                        {/* Indicador de Porcentaje */}

                        <Card >
                            <CardItem style={{ justifyContent: 'center', alignItems: 'center' }} header>
                                <Text style={{ fontSize: 20 }}>Efectividad de la Alerta</Text>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'column', width: '60%' }}>
                                            <Text style={{ fontSize: 60, fontWeight: 'bold' }}>
                                                {this.state.data.PORCENTAJE}%
                                            </Text>
                                        </View>
                                        <View style={{ flex:1, flexDirection: 'column', width: '40%', alignItems: 'flex-end' }}>
                                            <Badge style={{ width: '90%' }} success>
                                                <Text style={{ fontSize: 12 }}>Recibidas: { this.state.data.TOTAL_RECIBIDOS }</Text>
                                            </Badge>
                                            <Badge style={{ marginTop: 5, width: '90%' }} danger>
                                                <Text style={{ fontSize: 12 }}>Pendientes: { this.state.data.TOTAL_FALTANTES }</Text>
                                            </Badge>
                                        </View>
                                    </View>
                                </Body>
                            </CardItem>
                        </Card>

                        {/* Mensajes enviados */}

                        {

                            items.map((item, key)=>(

                                <Card 
                                    key={key}
                                >
                                    <CardItem header bordered>
                                        <Left>
                                            <Thumbnail source={ item.FECHA_LECTURA ? require('../images/checked.png') : require('../images/error.png') } />
                                            <Body>
                                                <Text style={{ fontWeight: 'bold' }}>{ item.PERSONA }</Text>
                                                <Text note>{ item.FECHA_ENVIO }</Text>
                                            </Body>
                                        </Left>
                                    </CardItem>
                                    <CardItem>
                                    <Body>
                                        <Text style={{ fontWeight: 'bold' }}>Mensaje Enviado</Text>
                                        <ViewMoreText
                                            numberOfLines={2}
                                            renderViewMore={this.renderViewMore}
                                            renderViewLess={this.renderViewLess}
                                            textStyle={{ textAlign: 'justify' }}
                                        >
                                            <Text style={{ fontStyle: 'italic' }}>
                                                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu euismod nisi. Cras urna ligula, faucibus sed pellentesque sed, convallis sodales metus. Sed congue, ligula et lobortis aliquet, erat orci pretium odio, vel hendrerit nibh lectus nec risus. Praesent non volutpat enim. */}
                                                { item.MENSAJE }
                                            </Text>
                                        </ViewMoreText>
                                        
                                    </Body>
                                    </CardItem>
                                    <CardItem footer>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Recibida</Text>
                                                {/* <Text note>22/05/2019 22:12:22</Text> */}
                                                <Text style={ !item.FECHA_LECTURA ? {color: 'red'} : null } note>{ item.FECHA_LECTURA ? item.FECHA_LECTURA : "PENDIENTE" }</Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', width: '50%', alignItems: 'flex-end' }}>
                                                {/* <Text style={{ fontWeight: 'bold' }}>Fecha Recepción</Text>
                                                <Text>22/05/2019 22:12:22</Text> */}
                                                { this.iconReenviarAlerta(item) }
                                            </View>
                                        </View>
            
                                    </CardItem>
                                </Card>
                            ))

                        }

                    </ScrollView>

                    <AwesomeAlert
                        show={this.state.reenviar_alerta}  
                        showProgress={this.state.reenviando}     
                        title="Reenviar Alerta"
                        message="¿Está seguro? La alerta será enviada nuevamente."
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText="Cancelar"
                        confirmText={ this.state.reenviando ? 'Reenviando...' : 'Reenviar' }
                        confirmButtonColor={ this.state.reenviando ? '#D0D0D0' : '#DD6B55' }
                        onCancelPressed={() => {

                            if (!this.state.reenviando) {
                                this.setState({
                                    reenviar_alerta: false
                                })
                            }

                        }}
                        onConfirmPressed={() => {

                            this.reenviarAlerta()

                        }}
                    />

                    <AwesomeAlert
                        show={this.state.alerta_reenviada}
                        title="La alerta se ha reenviado exitosamente"
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showConfirmButton={true}
                        confirmButtonColor="#DD6B55"
                        confirmText="Aceptar"
                        onConfirmPressed={() => {

                            this.setState({
                                alerta_reenviada: false
                            })

                        }}
                    />
                </View>
            );

        }
    }

    reenviarAlerta(){

        if (!this.state.reenviando) {
            
            this.setState({
                reenviando: true
            })

            let body = JSON.stringify(
                {
                    id_log: this.state.item_reenvio.ID_LOG,
                    id_persona: this.state.item_reenvio.ID_PERSONA,
                    mensaje: this.state.item_reenvio.MENSAJE,
                    id_correlativo: this.state.item_reenvio.ID_CORRELATIVO
                }
            )

            console.log(this.state.item_reenvio)

            fetch('https://udicat.muniguate.com/ave2_api/public/reenviar_alerta', {
                method: 'POST',
                headers: {
                    'CONTENT-TYPE': 'application/json'
                },
                body: body
            })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson)

                this.setState({
                    reenviando: false,
                    reenviar_alerta: false,
                    alerta_reenviada: true
                })

            })

        }

    }

    async getData(show_loading){

        this.setState({
            isLoading: show_loading
        })

        const id_correlativo = await AsyncStorage.getItem('@AVE2:INCIDENTE_ID');

        let body = JSON.stringify(
            {
                name: 'efectividadAlarma',
                param: {
                    id_correlativo: id_correlativo,
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
                isLoading: false
            })

        })
        .catch((error) => {

            this.setState({
                isLoading: false
            })
            console.log(error)

        });

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)',
        paddingLeft: 10,
        paddingRight: 10
    },

});
