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

import Logo from '../components/Logo';
import ObtenerClaveForm from '../components/ObtenerClaveForm';


export default class Login extends React.Component {

    render() {

        return (
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss } accesible={false}>
                <View style={styles.container}>
                    <View style={{ height: '20%', justifyContent: 'center' }}>
                        <Logo/>
                    </View>
                    <ObtenerClaveForm/>
                </View>
            </TouchableWithoutFeedback>
        );
    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(255, 255, 255)'
    },

});
