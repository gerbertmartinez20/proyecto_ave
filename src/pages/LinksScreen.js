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

import { List, ListItem, SearchBar, Icon, CheckBox } from 'react-native-elements'

export default class Login extends React.Component {

    render() {

        return (
            <View style={styles.container}>
                <Text>Links Screen</Text>
            </View>
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
