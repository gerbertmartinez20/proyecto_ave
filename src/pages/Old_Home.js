<ScrollView style={{ backgroundColor: 'white'}}>

                <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20}}>
                    
                    <View style={{ flexDirection: 'row'}}>
                        <View style={{width: '50%'}}>
                            <TouchableOpacity
                                delayPressIn={ 50 }
                                onPress={ (this.onProtocolos.bind(this))}
                            >

                                <Card
                                    image={require('../images/checklist.png')}
                                    imageProps={{ resizeMode: 'contain' }}
                                    imageStyle={{ width: 130, justifyContent: 'center', alignItems: 'center'}}
                                    containerStyle={styles.cardStyle}
                                >
                                    <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                        <Text h4 style={{ fontSize: 16, color: '#2089dc'}}>Protocolos</Text>
                                    </View>
                                </Card>

                            </TouchableOpacity>
                        </View>

                        <View style={{width: '50%'}}>
                            <TouchableOpacity 
                                onPress={ (this.onAlertas.bind(this)) }
                                delayPressIn={ 50 }
                                >
                                <Card
                                    image={require('../images/alarm.png')}
                                    imageProps={{ resizeMode: 'contain' }}
                                    imageStyle={{ width: 130, justifyContent: 'center', alignItems: 'center'}}
                                    containerStyle={styles.cardStyle}
                                >
                                    <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                        <Text h4 style={{ fontSize: 16, color: '#2089dc'}}>Alertas</Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        </View>



                    </View>

                    <View style={{ flexDirection: 'row'}}>

                        <View style={{width: '50%'}}>
                            <TouchableOpacity 
                                onPress={ (this.onEquipo.bind(this)) }
                                delayPressIn={ 50 }    
                                >
                                <Card
                                    image={require('../images/team.png')}
                                    imageProps={{ resizeMode: 'contain' }}
                                    imageStyle={{ width: 130, justifyContent: 'center', alignItems: 'center'}}
                                    containerStyle={styles.cardStyle}
                                >
                                    <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                        <Text h4 style={{ fontSize: 16, color: '#2089dc'}}>Equipo</Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        </View>

                        <View style={{width: '50%'}}>
                            <TouchableOpacity 
                                onPress={ (this.onNotificaciones.bind(this)) }
                                delayPressIn={ 50 }    
                                >
                                <Card
                                    image={require('../images/open-email.png')}
                                    imageProps={{ resizeMode: 'contain' }}
                                    imageStyle={{ width: 130, justifyContent: 'center', alignItems: 'center'}}
                                    containerStyle={styles.cardStyle}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Text h4 style={{ fontSize: 16, color: '#2089dc'}}>
                                        Notificaciones
                                        </Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row'}}>

                        <View style={{width: '50%'}}>
                            <TouchableOpacity 
                                onPress={ (this.onEnCurso.bind(this)) }
                                delayPressIn={ 50 }    
                                >
                                <Card
                                    image={require('../images/in-progress.png')}
                                    imageProps={{ resizeMode: 'contain' }}
                                    imageStyle={{ width: 130, justifyContent: 'center', alignItems: 'center'}}
                                    containerStyle={styles.cardStyle}
                                >
                                    <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                        <Text h4 style={{ fontSize: 16, color: '#2089dc'}}>En curso</Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        </View>

                        <View style={{width: '50%'}}>
                            <TouchableOpacity 
                                onPress={ (this.onSinConexion.bind(this)) }
                                delayPressIn={ 50 }
                                >
                                <Card
                                    image={require('../images/no-wifi.png')}
                                    imageProps={{ resizeMode: 'contain' }}
                                    imageStyle={{ width: 130, justifyContent: 'center', alignItems: 'center'}}
                                    containerStyle={styles.cardStyle}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Text h4 style={{ fontSize: 16, color: '#2089dc'}}>
                                        Sin conexión
                                        </Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row'}}>

                        <View style={{width: '50%'}}>

                            <TouchableOpacity 
                                onPress={ (this.onMiCuenta.bind(this)) }
                                delayPressIn={ 50 }
                                >
                                <Card
                                    image={require('../images/account.png')}
                                    imageProps={{ resizeMode: 'contain' }}
                                    imageStyle={{ width: 130, justifyContent: 'center', alignItems: 'center'}}
                                    containerStyle={styles.cardStyle}
                                >
                                    <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                        <Text h4 style={{ fontSize: 16, color: '#2089dc'}}>Mi Cuenta</Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>

                        </View>

                        <View style={{width: '50%'}}>

                            <TouchableOpacity 
                                onPress={ (this.onSalir.bind(this)) }
                                delayPressIn={ 50 }
                                >
                                <Card
                                    image={require('../images/exit.png')}
                                    imageProps={{ resizeMode: 'contain' }}
                                    imageStyle={{ width: 130, justifyContent: 'center', alignItems: 'center'}}
                                    containerStyle={styles.cardStyle}
                                >
                                    <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                        <Text h4 style={{ fontSize: 16, color: '#2089dc'}}>Salir</Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>

                        </View>

                    </View>
                    
                </View>

                </ScrollView>