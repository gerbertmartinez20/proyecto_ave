import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import { Button } from 'react-native-elements'

export default class BotonFinalizarIncidente extends React.Component {

    render() {

        return (
            <Button
                title='Finalizar'
                rounded={true}
                icon={{name: 'check-circle', type: 'font-awesome'}}
                backgroundColor="red"
            >
            </Button>
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
