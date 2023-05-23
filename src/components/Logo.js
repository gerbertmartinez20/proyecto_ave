import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

export default class Logo extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={ require('../images/icon_ave.png') } />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {

    },

});
