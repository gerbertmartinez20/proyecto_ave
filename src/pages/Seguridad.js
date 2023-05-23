import React from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage
} from 'react-native';

import { ListItem, List, Card} from 'react-native-elements'

import TouchID from 'react-native-touch-id'

const optionalConfigObject = {
    title: "Authentication Required", // Android
    imageColor: "#e00606", // Android
    imageErrorColor: "#ff0000", // Android
    sensorDescription: "Touch sensor", // Android
    sensorErrorDescription: "Failed", // Android
    cancelText: "Cancel", // Android
    fallbackLabel: "Show Passcode", // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false // iOS
  }
  
export default class Seguridad extends React.Component {

    constructor(props){
        super(props);

        this.state = {

            switch: false,
            disableBiometry: false
        }
    }

    componentDidMount(){

        this.loadData()

    }

    loadData(){

        //Validar si soporta Lector de Huella o Face ID
        TouchID.isSupported()
        .then(biometryType => {
            if (biometryType === 'TouchID') {
            // Touch ID is supported on iOS
            } else if (biometryType === 'FaceID') {
            // Face ID is supported on iOS
            } else if (biometryType === true) {
            // Touch ID is supported on Android
                this.setState({
                    disableBiometry: true
                })
            }
        })
        .catch(error => {
            // User's device does not support Touch ID (or Face ID)
            // This case is also triggered if users have not enabled Touch ID on their device
        });

        AsyncStorage.getItem('@AVE2:TOUCH_ID')
        .then((valor) => {

            if (valor != null) {

                this.setState({
                    switch: JSON.parse(valor)
                }) 

            }
            
        })
        .catch((error) => {

            console.warn(error);

        })

    }

    switch(){
        
        //Cambio el estado del switch
        
        if (this.state.switch) {
            
            AsyncStorage.setItem('@AVE2:TOUCH_ID', JSON.stringify(false))
                .then((valor) => {

                    this.setState({
                        switch: false
                    }) 

                })
                .catch((error) => {

                    console.warn(error);

                })
            

        } else {
            
            TouchID.authenticate('Inicio de Sesión', optionalConfigObject)
            .then(success => {

                AsyncStorage.setItem('@AVE2:TOUCH_ID', JSON.stringify(true))
                .then((valor) => {

                    this.setState({
                        switch: true
                    })
                
                })
                .catch((error) => {

                    console.warn(error);

                })

                TouchID.isSupported()
                .then(biometryType => {
                    // if (biometryType === 'TouchID') {

                    //     console.warn(biometryType)

                    // // Touch ID is supported on iOS
                    // } else if (biometryType === 'FaceID') {

                    //     console.warn(biometryType)

                    // // Face ID is supported on iOS
                    // } else if (biometryType === true) {

                    //     console.warn(biometryType)
                        
                    // // Touch ID is supported on Android
                        
                    // }

                    console.warn(biometryType)

                    AsyncStorage.setItem('@AVE2:TOUCH_ID_TIPE', JSON.stringify(biometryType))
                    .then((valor) => {

                        console.warn('Tipo de Biometrico')

                    })
                    .catch((error) => {

                        console.warn(error);

                    })

                })

                

            })
            .catch(error => {
                
                this.setState({
                    switch: false
                })

            });

        }

        //Si es True solicitar Touch ID
        {/* 
        if (this.state.switch == true) {

            TouchID.authenticate('Inicio de Sesión', optionalConfigObject)
            .then(success => {

                AsyncStorage.setItem('@AVE2:TOUCH_ID', JSON.stringify(this.state.switch))
                .then((valor) => {

                
                })
                .catch((error) => {

                    console.warn(error);

                })

            })
            .catch(error => {
                console.warn(error)

                this.setState({
                    switch: false
                })
                
            });

        }else{

            AsyncStorage.setItem('@AVE2:TOUCH_ID', JSON.stringify(this.state.switch))
                .then((valor) => {

                
                })
                .catch((error) => {

                    console.warn(error);

                })            

        }
        */}

    }

    render() {

        return (
            <View style={styles.container}>

                <List containerStyle={{
                    marginTop: 0,
                    flex: 1,
                    borderBottomColor: '#2089dc',
                    borderWidth: 0                    
                }}>

                    <Card
                        containerStyle={{ borderRadius: 25 }}
                    >
                        <ListItem
                            roundAvatar
                            avatar={ require('../images/touch.png') }
                            hideChevron={true}
                            title="Habilitar Touch ID"
                            titleStyle={{ fontWeight: 'bold' }}
                            subtitle="Únicamente para dispositivos iOS"
                            subtitleNumberOfLines={5}
                            subtitleStyle={{ fontSize: 16, color: 'red' }}
                            switchButton={true}
                            avatarStyle={{ backgroundColor: 'white' }}
                            containerStyle={{ borderBottomWidth: 0 }}
                            switched={ this.state.switch }
                            onSwitch={(this.switch.bind(this))}
                            switchDisabled={this.state.disableBiometry}
                        />
                    </Card>
 
                </List>
            </View>
        );
    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)'

    },

});
