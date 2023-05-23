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
    Keyboard
} from 'react-native';

export default class Registro extends React.Component {

    login(){

        Actions.registro()
  
    }

    render() {

        return (
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss } accesible={false}>
            <View style={styles.container}>

                <View style={{ height: '20%', justifyContent: 'center' }}>
                    <Logo/>
                </View>
            
                <View style={{ height: '70%' }}>
                </View>    
                
                <View style={{ flex: 1, flexDirection: 'row', height: '10%', justifyContent: 'center', alignContent: 'flex-end' }}>
                    {/* <Icon 
                    size={ 50 }
                    type='font-awesome'    
                    name='question-circle' 
                    color='rgb(182, 183, 186)'  /> */}
                    {/* <Text>¿Ya tiene una cuenta? </Text>
                    <TouchableOpacity
                        
                    >
                        <Text style={{ fontWeight: 'bold' }}>Iniciar Sesión</Text>
                    </TouchableOpacity> */}
                </View>    

            </View>
        </TouchableWithoutFeedback>
        );
    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)'

    },

});
