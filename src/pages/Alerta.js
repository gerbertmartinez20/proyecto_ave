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
    Keyboard,
    ScrollView,
    Image,
    Dimensions,
    AsyncStorage
} from 'react-native';

import { Card, ListItem, Button} from 'react-native-elements'

export default class Alertas extends React.Component {

    render() {

        return (
            <View style={styles.container}>

            <Card
                title='TITULO'

                containerStyle={styles.cardStyle}
            >
            <Text style={{ marginBottom: 10}}>
                Descripcion
            </Text>
                <View style={ styles.botonIngreso }>
                    <Button
                        rightIcon={{name: 'play', type: 'font-awesome', size: 20}}
                        backgroundColor='rgb(233, 84, 64)'
                        buttonStyle={styles.buttonStyle}
                        title='ACTIVAR'
                    />

                </View>
            </Card>

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
    cardImageStyle: {
        flex: 1
    },
    botonIngreso: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 20
    },
    cardStyle: {
        borderRadius: 25,
        width: 300,
        borderTopColor: '#2089dc',
        borderRightColor: '#2089dc',
        borderBottomColor: '#2089dc',
        borderLeftColor: '#2089dc',
        borderColor: '#2089dc'
    },
    buttonStyle: {
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        borderRadius: 25
    }

});
