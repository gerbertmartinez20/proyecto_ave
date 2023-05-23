import React from 'react';
import {
    StyleSheet,
    AppRegistry,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    Dimensions
} from 'react-native';

//import Video from 'react-native-video';

import Video from 'react-native-af-video-player'

import Onboarding from 'react-native-onboarding-swiper';

import { Actions } from 'react-native-router-flux';

import { FormLabel, FormInput, Button, Badge } from 'react-native-elements'

const url = 'https://udicat.muniguate.com/apps/ave_api/videos/tutorial_ave.mp4'

export default class ModalVideo extends React.Component {

    constructor(props){
        super(props);

        this.state = {

            loading: false

        }

        this.player = ""
    }

    componentDidMount(){

        this.setState({
            loading: true
        })

    }

    video(){

        return(
            <View style={{ width: '100%', height: '100%' }}>
                <Image style={{  width: '100%', height: '100%', resizeMode: "contain" }} resizeMode={"contain"} source={require('../images/elearning.png')}  />

                { this.boton_descargar() }
            </View>
                // <View style={{ flex: 1, width:'100%', height: '100%' }}>
                    
                //     {/* <Video 
                    
                //         source={{uri: "https://udicat.muniguate.com/apps/ave_api/videos/tutorial_ave.mp4"}}   // Can be a URL or a local file.
                //         style={{ width: '100%', height: '100%' }}
                //         resizeMode="none"
                //         controls={true}
                //         paused={true}
                //         fullscreenAutorotate={true}
                //         fullscreen={true}
                //         // resizeMode="cover"
                //         onLoad={ () => {

                //             this.setState({
                //                 loading: false
                //             })

                //         }}
                //         ref={ (ref) =>{
                //             this.player = ref
                //         }}
        
                //     /> */}

                //     {/* { this.cargando() } */}

                //     {/* { this.boton_descargar() } */}

                //     <Video url={url} />

                // </View>

                // <View style={{ flex: 1 }}>
                //     <Video 
                //         url={url} 
                //         rotateToFullScreen={true}
                //     />
                // </View>
        )

    }

    cargando(){

        if (this.state.loading) {
            
            return(

                <View style={{ justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'white', marginTop: 10, marginBottom: 10}} >
    
                    <ActivityIndicator size='large' />
    
                </View>
    
            )

        }

    }

    boton_descargar(){

            
            return(
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}} >
    
                    <Button
                        icon={{name: 'youtube-play', type: 'font-awesome'}}
                        title='VER TUTORIAL'
                        rounded={true}
                        backgroundColor='#2089dc'
                        onPress={() =>{
                            Actions.tutorial()
                        }}
                        // loading={ this.state.isSaving }
                        // onPress={ (this.onGuardar.bind(this)) }
                        // loadingRight={true}
                        // disabled={ this.state.isSaving }
                    />
    
                </View>
            )

        

    }

    render() {

        return (

            <View style={{ flex: 1 }}>
                <Onboarding
                    pages={[
                        {
                            backgroundColor: 'white',
                            image: 
                            <View style={{ width: '100%', height: '100%' }}>
                                <Image style={{  width: '100%', height: '100%', resizeMode: "contain" }} resizeMode={"contain"} source={require('../images/icono_ave.png')}  />
                            </View>,
                            title: 'Bienvenido a AVE Personalizado',
                            subtitle: 'Aplicación para apoyo en la gestión y administración de protocolos de emergencia.',
                        },
                        {
                            backgroundColor: 'white',
                            image: 
                            this.video(),
                            title: '',
                            subtitle: 'Antes de iniciar te invitamos a ver el tutorial sobre todas las funciones con que cuenta AVE Personalizado.',
                            
                        },
                    ]}
                    showSkip={true}
                    skipLabel="Omitir"
                    nextLabel="Siguiente"
                    bottomBarColor="rgb(16, 6, 159)"
                    imageContainerStyles = {{  width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center' }}
                    containerStyles = {{ flex: 1 }}
                    onSkip={()=>{
                        Actions.pop()
                    }}
                    onDone={()=>{
                        Actions.pop()

                    }}
                />
            </View>
            // <View style={{ flex: 1 }}>
            //     <Video 
            //         url={url} 
            //         rotateToFullScreen={true}
            //     />
            // </View>
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
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },

});
