import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import Video from 'react-native-af-video-player'
import { Actions } from 'react-native-router-flux';
import { Text } from 'react-native-elements'

const url = 'https://udicat.muniguate.com/apps/ave_api/videos/tutorial_ave.mp4'

export default class Login extends React.Component {

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Video 
                    url={url} 
                    rotateToFullScreen={true}
                    lockPortraitOnFsExit={true}
                    onFullScreen={(value) =>{
                        Actions.refresh({hideNavBar: value})
                    }}
                />
                <View style={{ flex: 1, margin: 10 }}>
                    <Text h4 style={{ fontWeight: 'bold' }}>Descripción:</Text>
                    <Text h5 style={{ textAlign: 'justify' }}>El siguiente video tutorial le mostrará todas las funciones con las que cuenta AVE Personalizado y el proceso que deberá de seguir para establecer equipos para la atenció de emergencia, creación de protocolos y activación de alertas.</Text>
                </View>
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
