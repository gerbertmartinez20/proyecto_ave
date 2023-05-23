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
    Image
} from 'react-native';

import { Router, Stack, Scene } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './pages/HomeScreen';
import LinksScreen from './pages/LinksScreen';
import SettingsScreen from './pages/SettingsScreen';
import Login from './pages/Login';


class TabIcon extends React.Component {
  render() {
    var color = this.props.selected ? '#00f240' : '#545454';

    return (
        <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
            <Icon style={{color: color}} name={this.props.iconName || "circle"} size={18}/>
        </View>
    );
  }
}


class TabsHome extends React.Component {

    render() {

        return (

            <Router>
                <Stack key='root' tabs={true}>
                    <Scene key='Inicio' iconName="tags" icon={TabIcon}  component={HomeScreen} title="Inicio" initial={true}  />
                    <Scene key='Links'  component={LinksScreen} title="Links"  />
                    <Scene key='Settings'  component={SettingsScreen} title="Configuración"  />
                </Stack>


            </Router>

        );
    }

}

export default TabsHome
