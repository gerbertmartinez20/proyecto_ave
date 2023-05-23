import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

import { Icon } from 'react-native-elements'


export default class BotonFiltrar extends React.Component {

    render() {

        return (
            <View style={styles.container}>

                <Icon
                    name='angle-down'
                    type='font-awesome'
                    color='#d2d4d8'
                    size={40}
                />

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
