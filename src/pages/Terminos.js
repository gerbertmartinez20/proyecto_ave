
import React , {Component} from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native';

import { Actions } from 'react-native-router-flux';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};

class TermsAndConditions extends Component{

    constructor(props){

        super(props);

        this.state = {
            telefono: props.telefono,
            password: props.password,
            id_usuario: props.id_usuario,
            aceptando: false
        };

    }

    state = {
        accepted: false
    }

    render(){
        return (
        <View style={styles.container}>
                <Text style={styles.title}>TÉRMINOS Y CONDICIONES</Text>
                <ScrollView 
                style={styles.tcContainer}
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent)) {
                    this.setState({
                        accepted: true
                    })
                    }
                }}
                >
                    <Text style={styles.tcP}>Al descargar o utilizar la aplicación móvil AVE, acepta, reconoce y manifiesta automáticamente su conformidad con los siguientes términos y condiciones:</Text>

                        <Text style={[styles.title, { marginTop: 10 }]}>TÉRMINOS</Text>

                        <Text style={styles.tcL}>{'\u2022'} La aplicación móvil AVE funciona como un medio electrónico de comunicación por medio de la cual la Municipalidad de Guatemala pone a su disposición menús y herramientas a través de los cuales puede crear protocolos de atención a emergencias específicos de acuerdo a los eventos que sean priorizados por el usuario, permitiéndole recibir una alerta que le informa de la actividad que le corresponde realizar según el protocolo activado.</Text>
                        <Text style={styles.tcL}>{'\u2022'} La información que se muestra en su aplicación móvil AVE, así como los accesos a los distintos menús, dependerá del nivel de autorización que su usuario tenga dentro de la plataforma de la aplicación móvil AVE de acuerdo al protocolo en el que se encuentre agregado.</Text>
                        <Text style={styles.tcL}>{'\u2022'} La aplicación móvil AVE requerirá de un proceso de registro, para ello será necesario ingresar la información requerida, la cual será utilizada para fines de identificación y de carácter confidencial. Usted acepta que en todo momento es el único responsable de mantener en resguardo la clave de acceso a la aplicación móvil AVE.</Text>
                        <Text style={styles.tcL}>{'\u2022'} La Municipalidad de Guatemala, en cualquier momento y a su entera discreción podrá restringirle los accesos a la aplicación móvil AVE o de dar de baja su usuario.</Text>
                        <Text style={styles.tcL}>{'\u2022'} La Municipalidad de Guatemala no hace responsable, si las personas que hacen uso de la aplicación móvil AVE, lo realizan con fines distintos para el cual fue diseñada o contrario a las disposiciones legales vigentes. Para lo cual la Municipalidad de Guatemala, se reserva el derecho de actuar de forma legal, en contra de las personas que hagan mal uso de dicha aplicación.</Text>

                        <Text style={[styles.title, { marginTop: 10 }]}>CONDICIONES</Text>

                        <Text style={styles.tcL}>{'\u2022'} La aplicación móvil AVE es para su uso personal sin ningún costo, pero deberá contar con dispositivo móvil inteligente (Smartphone) con sistema operativo Android o iOS con acceso a internet; la Municipalidad de Guatemala no se hace responsable de que realice la descarga o uso de la aplicación móvil AVE fuera de zonas con conexión a internet Wi-Fi y que derivado de ello su proveedor de servicios o datos móviles realice cargos por el consumo durante la descarga o conexión así como tampoco de los daños o afectaciones que pueda sufrir por virus informáticos (malware).</Text>

                        <Text style={styles.tcL}>{'\u2022'} La descarga de esta aplicación móvil AVE móvil no le autoriza copiar o modificar la misma, así como ninguna parte de ésta.</Text>

                        <Text style={styles.tcL}>
                            {'\u2022'} No deberá intentar extraer el código fuente de la aplicación móvil AVE, traducir la aplicación móvil AVE a otros idiomas ni crear versiones derivadas.
                        </Text>

                        <Text style={styles.tcL}>
                            {'\u2022'} Usted acepta que la Municipalidad de Guatemala, podrá solicitar a usted en cualquier momento la actualización de la versión de la aplicación móvil AVE, con la finalidad de garantizar que la aplicación móvil AVE funcione eficientemente.
                        </Text> 

                        <Text style={styles.tcL}>
                            {'\u2022'} La aplicación móvil AVE, los derechos de autor, los derechos sobre bases de datos, código fuente, divulgación, publicación, reproducción, distribución y transformación son propiedad exclusiva de la Municipalidad de Guatemala.
                        </Text>   

                        <Text style={styles.tcL}>
                            {'\u2022'} La Municipalidad de Guatemala, se reserva el derecho de efectuar cambios en la aplicación móvil AVE, actualizar cualquiera de sus elementos, o retirarla en cualquier momento y por cualquier motivo.
                        </Text>

                        <Text style={styles.tcL}>
                            {'\u2022'} La Municipalidad de Guatemala en cualquier momento podrá modificar los presentes términos y condiciones.
                        </Text>

                </ScrollView>

                <TouchableOpacity 
                    disabled={ !this.state.accepted || this.state.aceptando } 
                    onPress={ ()=> {

                        //El usuario acepta los terminos

                        this.setState({
                            aceptando: true
                        })

                        let body = JSON.stringify(
                            {
                                name: 'aceptarTerminos',
                                param: {
                                    id_usuario: this.state.id_usuario
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

                            if (responseJson.response.status == 200) {
                                
                                AsyncStorage.setItem('@AVE2:USER_ID', (this.state.id_usuario).toString())
                                .then((valor) => {

                                    AsyncStorage.setItem('@AVE2:USER_PHONE', this.state.telefono )
                                    .then((valor) => {

                                        AsyncStorage.setItem('@AVE2:USER_PASS', this.state.password )
                                        .then((valor) => {

                                            Actions.reset('home_routes')

                                        })
                                        .catch((error) => {
                                        })         
                                        
                                    })
                                    .catch((error) => {
                                    })       

                                    //Actions.reset('home_routes')
                                })
                                .catch((error) => {
                                })

                            }
            
                        })
                        .catch((error) => {
                            
                            console.log(error)
            
                        });

                    }} 
                    style={ this.state.accepted ? styles.button : styles.buttonDisabled 
                }>
                    <Text style={styles.buttonLabel}>ACEPTO</Text>
                </TouchableOpacity>
        </View>
        );
    }

}

const { width , height } = Dimensions.get('window');

const styles = {

  container:{
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
      fontSize: 22,
      alignSelf: 'center'
  },
  tcP: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 12
  },
  tcP:{
      marginTop: 10,
      fontSize: 12
  },
  tcL:{
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 10,
      fontSize: 12
  },
  tcContainer: {
      marginTop: 15,
      marginBottom: 15,
      height: height * .6
  },

  button:{
      backgroundColor: 'rgb(16, 6, 159)',
      borderRadius: 5,
      padding: 10
  },

  buttonDisabled:{
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10
 },

  buttonLabel:{
      fontSize: 14,
      color: '#FFF',
      alignSelf: 'center'
  }

}

export default TermsAndConditions;
