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
    ScrollView
} from 'react-native';

import { Card, ListItem, Button} from 'react-native-elements'

export default class Login extends React.Component {

    render() {

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                <Card
                    title="PROTOCOLOS"
                    image={require('../images/icon-protocol.png')}
                    imageProps={{ resizeMode: 'contain' }}
                    >
                    <Text style={{marginBottom: 10}}>
                    The idea with React Native Elements is more about component structure than actual design.
                    </Text>
                    <Button
                        icon={{name: 'code'}}
                        backgroundColor='#03A9F4'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title='VIEW NOW'
                    />
                </Card>

                <Card
                    title="ALERTAS"
                    image={require('../images/alert.png')}
                    imageProps={{ resizeMode: 'contain' }}
                    >
                    <Text style={{marginBottom: 10}}>
                    The idea with React Native Elements is more about component structure than actual design.
                    </Text>
                    <Button
                        icon={{name: 'code'}}
                        backgroundColor='#03A9F4'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title='VIEW NOW'
                    />
                </Card>

                <Card
                    title="ACTIVIDADES"
                    image={require('../images/activity-list.png')}
                    imageProps={{ resizeMode: 'contain' }}
                    >
                    <Text style={{marginBottom: 10}}>
                    The idea with React Native Elements is more about component structure than actual design.
                    </Text>
                    <Button
                        icon={{name: 'code'}}
                        backgroundColor='#03A9F4'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title='VIEW NOW'
                    />
                </Card>

                <Card
                    title='MI CUENTA'
                    image={require('../images/account.png')}
                    imageProps={{ resizeMode: 'contain' }}
                    >

                    <Text style={{marginBottom: 10}}>
                    The idea with React Native Elements is more about component structure than actual design.
                    </Text>
                    <Button
                        icon={{name: 'code'}}
                        backgroundColor='#03A9F4'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title='VIEW NOW'
                    />
                </Card>
                </ScrollView>
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
