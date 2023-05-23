import React from 'react';

import { Router, Stack, Scene } from 'react-native-router-flux';

import Home from './pages/Home';

export default class RoutesHome extends React.Component {

    render() {

        return (

            <Router>
                <Stack key='root'>
                    <Scene key='home'  component={HomeScreen} title="Home" initial={true}  />
                </Stack>
            </Router>

        );
    }

}
