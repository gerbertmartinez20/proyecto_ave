import React from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    Image
} from 'react-native';

import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default class Noticias extends React.Component {

    render() {

        return (
            <Container>

                <Content>

                
          <Card style={{
              borderRadius: 10,
              borderTopWidth: 2,
              borderRightWidth: 2,
              // borderBottomWidth: 2,
              borderLeftWidth: 2,
              borderTopColor: '#d2d4d8',
              borderRightColor: '#d2d4d8',
              // borderBottomColor: '#d2d4d8',
              borderLeftColor: '#d2d4d8',
              marginBottom: 10,
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              backgroundColor: 'white',
              // elevation: 5,
              // shadowColor: '#000',
              // shadowOffset: { width: 0, height: this.shadow_height },
              // shadowOpacity: 0.5,
              // shadowRadius: 2,
              backgroundColor: 'white'
          }}>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'http://static.tumblr.com/0da653bd0da73f87057f7ee8e2a1e25c/dzealsw/qebopg48o/tumblr_static_2vvl6h9xw3k0kc8g00so804wg.jpg'}} />
                <Body>
                  <Text>Municipalidad de Guatemala</Text>
                  <Text note>Héctor Flores</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: 'https://cdn.chapintv.com/files/2018/09/30/DoXzMZUUUAADXPE.jpg'}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
              <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comentarios</Text>
                </Button>
              </Left>
              {/* <Body>
                <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comments</Text>
                </Button>
              </Body> */}
              <Right>
                <Text>11h ago</Text>
              </Right>
            </CardItem>
          </Card>


                </Content>
            </Container>
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
