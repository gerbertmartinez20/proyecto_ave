import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import { Button } from 'react-native-elements';

import Logo from '../components/Logo';
import SignupForm from '../components/SignupForm'

export default class Signup extends React.Component {
  render() {

    return (
        // <TouchableWithoutFeedback onPress={ Keyboard.dismiss } accesible={false}>

        // </TouchableWithoutFeedback>
                <View style={styles.container}>
                    {/* <Logo/> */}
                    {/* <View style={{ height: '20%', justifyContent: 'center' }}>
                        <Logo/>
                    </View> */}
                    <SignupForm/>
                    
                </View>
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
    signupTextCont: {
        flex: 0.5,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    signupText: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    signupButton: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
    }
});
