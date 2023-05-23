import React from 'react';

import {

    StyleSheet,
    PixelRatio,
    View,

} from 'react-native';

import { Router, Scene, Actions, Tabs, Modal, Lightbox } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ObtenerClave from './pages/ObtenerClave'
import Home from './pages/Home';
import Terminos from './pages/Terminos'
import ModalVideo from './pages/ModalVideo'
import Tutorial from './pages/Tutorial'

// import Protocolos from './pages/Protocolos'
import ListaProtocolos from './pages/ListaProtocolos'
import Actividades from './pages/Actividades'

import MiCuenta from './pages/MiCuenta'
import CambiarPassword from './pages/CambiarPassword'

import Seguridad from './pages/Seguridad'
import Notificaciones from './pages/Notificaciones'
import Noticias from './pages/Noticias'

// Componentes para la seccion de Equipos
import Equipo from './pages/Equipo'
import IntegrantesEquipo from './pages/IntegrantesEquipo'
import DetallesEquipo from './pages/DetallesEquipo'
import AgregarPersona from './pages/AgregarPersona'
import InvitarPersona from './pages/InvitarPersona'

import DetallesIntegranteEquipo from './pages/DetallesIntegranteEquipo'
import Chat from './pages/Chat'
import AgregarEquipo from './pages/AgregarEquipo'

import SinConexion from './pages/SinConexion'
import EnCurso from './pages/EnCurso'

//Componentes para barra de navegacion
import BotonFiltrar from './components/BotonFiltrar'

// Componentes de la seccion de Protocolos
import AgregarProtocolo from './pages/AgregarProtocolo'
import DetallesProtocolo from './pages/DetallesProtocolo'
import AgregarActividad from './pages/AgregarActividad'
import DetallesActividad from './pages/DetallesActividad'
import Mensajes from './pages/Mensajes'
import AgregarMensaje from './pages/AgregarMensaje'
import DetallesMensaje from './pages/DetallesMensaje'

//Componentes de la seccion de Alertas
import Alertas from './pages/Alertas'
import AlertasProtocolos from './pages/AlertasProtocolos'
import ListaAlertas from './pages/ListaAlertas'
import EditarAlerta from './pages/EditarAlerta'

//Componentes de la seccion de Notificaciones
import DetallesNotificacion from './pages/DetallesNotificacion'
import NotificationsReaded from './pages/NotificationsReaded'

//Incidentes
import DetalleIncidenteUser from './pages/DetalleIncidenteUser'
import DetalleIncidente from './pages/DetalleIncidente'
import RecepcionAlertaAdmin from './pages/RecepcionAlertaAdmin'
import DetalleIncidenteAdmin from './pages/DetalleIncidenteAdmin'
import EditarActividadIncidente from './pages/EditarActividadIncidente'
import EditarActividadIncidenteUser from './pages/EditarActividadIncidenteUser'

import AddButton from './components/AddButton'
import LinksScreen from './pages/LinksScreen';
import SettingsScreen from './pages/SettingsScreen';

let editando_actividades = false
let editando_mensajes = false

class TabIcon extends React.Component {
    render() {
        var color = this.props.focused ? '#ffffff' : 'rgb(199, 199, 201)';

        return (
            <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                <Icon style={{color: color}} name={this.props.iconName || "circle"} size={18}/>
            </View>
        );
    }
}

class Routes extends React.Component {

    render() {
        
        return (
            
            <Router>
                {/* <Modal>
                <Scene 

                    key='modal_video' 

                    component={ModalVideo}
                    modal={true}

                />
                </Modal> */}
                <Scene key='root'  >

                    <Scene key="login_routes" hideNavBar={true} back={false} initial={true} >

                        <Scene key='login' hideNavBar={true} component={Login} title="Iniciar Sesión" />
                        <Scene key='signup' hideNavBar={true}  component={Signup} title="Registro"  />
                        <Scene key='obtener_clave' hideNavBar={true}  component={ObtenerClave} title="Obtener Clave"  />


                    </Scene>

                    <Scene 

                        key='terminos' 
                        navigationBarStyle={ styles.navigationBarStyle } backButtonTintColor="#ffffff"
                        backButtonTextStyle={{ color: '#ffffff'}} 
                        back={true} 
                        hideNavBar={false} 
                        component={Terminos}
                        
                    />

                    <Scene
                        key='modal_video' 
                        component={ModalVideo}
                        navigationBarStyle={ styles.navigationBarStyle }
                        back={true}
                        hideNavBar={true}
                        navBarButtonColor='white'
                        backButtonTextStyle={{ color: '#ffffff'}}
                        title="Tutorial de Uso"
                    />

                    <Scene
                        key='tutorial' 
                        component={Tutorial}
                        navigationBarStyle={ styles.navigationBarStyle }
                        back={true}
                        hideNavBar={false}
                        navBarButtonColor='white'
                        backButtonTextStyle={{ color: '#ffffff'}}
                        title="Tutorial de Uso"
                    />

                    <Tabs
                        key="home_routes"
                        hideNavBar={true}
                        tabBarStyle={{ backgroundColor: 'rgb(16, 6, 159)', color: '#ffffff'}}
                        navigationBarStyle={ styles.navigationBarStyle }
                        navBarButtonColor='white'
                        activeTintColor='white'
                        title='Inicio'

                    >

                        <Scene
                            key='home'
                            hideNavBar={true}
                            component={Home}
                            title="Inicio"
                            tabBarLabel="Inicio"
                            iconName="home"
                            icon={TabIcon}
                            on={ () => {
                                console.log('Ingreso a Home')
                                Actions.refresh({contador: 5})
                            }}
                        >

                        </Scene>

                        <Scene
                            key='settings'
                            hideNavBar={true}
                            component={SettingsScreen} title="Configuración"
                            tabBarLabel="Configuración"
                            iconName="cogs"
                            icon={TabIcon}
                            title="Configuración"
                            success={ (this.onSuccessSettings.bind(this)) }
                            on={ (this.onSettings.bind(this)) }
                        />

                    </Tabs>


                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }
                            back={true}
                            hideNavBar={true}
                            navBarButtonColor='white'
                            key='protocolos'
                            hideNavBar={false}
                            component={ListaProtocolos}
                            title="Protocolos"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Inicio"
                            // on={ (this.onProtocolos.bind(this)) }
                            protocolo_agregado={false}
                            on={ (prop) => {

                                if (prop.protocolo_agregado) {
                                    
                                    console.log('Protocolo agregado')

                                    Actions.refresh({ protocolo_agregado: prop.protocolo_agregado })

                                }

                            }}
                        />

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }
                            back={true}
                            hideNavBar={true}
                            navBarButtonColor='white'
                            key='agregar_protocolo'
                            hideNavBar={false}
                            component={AgregarProtocolo}
                            title="Agregar Protocolo"
                        />

                        {/* Tab para el detalle, actividades y mensajes de un protocolo */}

                        <Tabs
                            key="detail_protocol"
                            tabBarStyle={{ backgroundColor: 'rgb(16, 6, 159)', color: '#ffffff'}}
                            navigationBarStyle={ styles.navigationBarStyle }
                            navBarButtonColor='white'
                            activeTintColor='white'
                            title='Protocolo'
                            hideNavBar={true}
                        >

                            <Scene
                                navBarButtonColor='white'
                                key='detalle_protocolo'
                                hideNavBar={false}
                                component={DetallesProtocolo}
                                title="Información"
                                back={true}
                                navigationBarStyle={ styles.navigationBarStyle }
                                tabBarLabel="Información"
                                iconName="info"
                                icon={TabIcon}
                                backButtonTintColor="#ffffff"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                backTitle={'Protocolos'}

                            />

                            <Scene
                                navBarButtonColor='white'
                                key='actividades'
                                hideNavBar={false}
                                component={Actividades}
                                title="Actividades"
                                back={true}
                                navigationBarStyle={ styles.navigationBarStyle }
                                tabBarLabel="Actividades"
                                iconName="list"
                                icon={TabIcon}
                                backButtonTintColor="#ffffff"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                success={ (this.onSuccessActividades.bind(this)) }
                                rightTitle={'Editar'}
                                actividad_agregada={false}
                                editando={false}
                                backTitle={'Protocolos'}
                                onRight={ () => { 

                                    this.editando_actividades = !this.editando_actividades
    
                                    Actions.refresh({ editando: this.editando_actividades })
    
                                }}
                                on={ (prop) => {

                                    if (prop.actividad_agregada) {
                                        
                                        Actions.refresh({ actividad_agregada: prop.actividad_agregada })
    
                                    }
    
                                }}
                                onBack={ () => {
                                    console.log('Back')
                                    Actions.popTo('protocolos')
                                } }
                            />

                            <Scene
                                navBarButtonColor='white'
                                key='mensajes'
                                hideNavBar={false}
                                component={Mensajes}
                                title="Mensajes"
                                back={true}
                                navigationBarStyle={ styles.navigationBarStyle }
                                iconName="comment"
                                tabBarLabel="Mensajes"
                                icon={TabIcon}
                                backButtonTintColor="#ffffff"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                success={ (this.onSuccessMensajes.bind(this)) }
                                rightTitle={'Editar'}
                                backTitle={'Protocolos'}
                                editando={false}
                                mensaje_agregado={false}
                                onRight={ () => {

                                    this.editando_mensajes = !this.editando_mensajes
    
                                    Actions.refresh({ editando: this.editando_mensajes })

                                }}
                                on={ (prop) => {

                                    if (prop.mensaje_agregado) {
                                        
                                        Actions.refresh({ mensaje_agregado: prop.mensaje_agregado })
    
                                    }
    
                                }}
                                onBack={ () => {
                                    console.log('Back')
                                    Actions.popTo('protocolos')
                                } }
                            />

                        </Tabs>

                        <Tabs
                            tabBarStyle={{ backgroundColor: 'rgb(16, 6, 159)', color: '#ffffff'}}
                            navigationBarStyle={ styles.navigationBarStyle }
                            navBarButtonColor='white'
                            activeTintColor='white'
                            title='Alertas'
                            key="tabs_alertas"
                        >

                            <Scene
                                key='alertaProtocolos'
                                hideNavBar={true}
                                component={AlertasProtocolos}
                                title="Activar Protocolo"
                                tabBarLabel="Protocolos"
                                iconName="exclamation"
                                icon={TabIcon}
                                backTitle="Inicio"
                                back={true}
                            />

                            <Scene
                                key='alertas'
                                hideNavBar={true}
                                component={ListaAlertas}
                                title="Alertas"
                                iconName="bell"
                                icon={TabIcon}
                                backTitle="Inicio"
                                tabBarLabel="Alertas"
                                back={true}
                                backButtonTintColor="#ffffff"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                on={ (this.onProtocolos.bind(this)) }
                            />

                        </Tabs>

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }
                            navBarButtonColor='white'
                            key='crear_alerta'
                            hideNavBar={false}
                            component={Alertas}
                            title="Crear Alerta"
                            backTitle="Alertas"
                            backTitleEnable={true}
                            backButtonTintColor="#ffffff"
                            backButtonTextStyle={{ color: '#ffffff'}}
                        />

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }
                            back={true}
                            navBarButtonColor='white'
                            key='editar_alerta'
                            hideNavBar={false}
                            component={EditarAlerta}
                            title="Editar Alerta"
                            backTitle="Alertas"
                            backButtonTintColor="#ffffff"
                            backButtonTextStyle={{ color: '#ffffff'}}
                        />

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }  back={true} hideNavBar={true}
                            navBarButtonColor='white'
                            key='noticias'
                            hideNavBar={false}
                            component={Noticias}
                            title="Noticias"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Inicio"
                            on={ (this.onProtocolos.bind(this)) }
                        />

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }  back={true} hideNavBar={true}
                            navBarButtonColor='white'
                            key='equipo'
                            hideNavBar={false}
                            component={Equipo}
                            equipo_agregado={false}
                            equipo_abandonado={false}
                            title="Equipos"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Inicio"
                            rightTitle={"Editar"}
                            editando={false}
                            on={ (prop) => {

                                if (prop.equipo_agregado) {
                                    
                                    Actions.refresh({ equipo_agregado: prop.equipo_agregado })

                                }

                                if (prop.equipo_abandonado) {
                                    
                                    Actions.refresh({ equipo_abandonado: prop.equipo_abandonado })

                                }

                            }}
                            onRight={ () => { 

                                this.editando = !this.editando

                                Actions.refresh({ editando: this.editando })

                            }}
                        />

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }  back={true} hideNavBar={true}
                            navBarButtonColor='white'
                            key='chat'
                            hideNavBar={false}
                            component={Chat}
                            title="Chat"
                            backButtonTextStyle={{ color: '#ffffff'}}
                        />

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }  back={true} hideNavBar={true}
                            navBarButtonColor='white'
                            key='detalles_integrante_equipo'
                            hideNavBar={false}
                            component={DetallesIntegranteEquipo}
                            title="Equipo"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Inicio"
                        />

                        <Tabs
                            key="tab_detalle_equipo"
                            hideNavBar={true}
                            tabBarStyle={{ backgroundColor: 'rgb(16, 6, 159)', color: '#ffffff'}}
                            navigationBarStyle={ styles.navigationBarStyle }
                            navBarButtonColor='white'
                            activeTintColor='white'
                        >

                            <Scene 
                                hideNavBar={false}
                                navigationBarStyle={ styles.navigationBarStyle }  back={true}
                                navBarButtonColor='white'
                                key='detalles_equipo'
                                component={DetallesEquipo}
                                backButtonTextStyle={{ color: '#ffffff'}}
                                backTitle="Inicio"
                                iconName="info"
                                icon={TabIcon}
                                tabBarLabel="Información"
                                title='Detalles'
                                backTitle={'Equipos'}
                            />

                            <Scene 
                                hideNavBar={false}
                                navigationBarStyle={ styles.navigationBarStyle }  back={true}
                                navBarButtonColor='white'
                                key='integrantes_equipo'
                                component={IntegrantesEquipo}
                                title="Integrantes"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                backTitle="Inicio"
                                iconName="users"
                                icon={TabIcon}
                                tabBarLabel="Integrantes"
                                rightTitle={"Editar"}
                                integrante_agregado={false}
                                rol_cambiado={false}
                                editando={false}
                                rightTitle='Editar'
                                backTitle={'Equipos'}
                                onRight={ () => { 

                                    this.editando = !this.editando
    
                                    Actions.refresh({ editando: this.editando })
    
                                }}
                                onBack={ () =>{
                                    Actions.popTo('equipo')
                                }}
                            />

                        </Tabs>

                        <Scene 

                            navigationBarStyle={ styles.navigationBarStyle }  
                            back={true} 
                            hideNavBar={false}
                            navBarButtonColor='white'
                            key='agregar_persona'
                            component={AgregarPersona}
                            title="Agregar Persona"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Inicio"
                            on={ (this.onProtocolos.bind(this)) }
                            
                        />

                        <Scene 

                            navigationBarStyle={ styles.navigationBarStyle }  
                            back={true} 
                            hideNavBar={false}
                            navBarButtonColor='white'
                            key='invitar_persona'
                            component={InvitarPersona}
                            title="Invitar a Equipo"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Inicio"
                            on={ (this.onProtocolos.bind(this)) }

                        />

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }  back={true}
                            navBarButtonColor='white'
                            key='en_curso'
                            component={EnCurso}
                            title="Incidentes"
                            success={ (this.onSuccessEnCurso.bind(this)) }
                            on={ (this.onEnCurso.bind(this)) }
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Inicio"
                            rightButtonStyle={{ color:'white' }}
                            rightButtonTextStyle={{ color: '#ffffff'}}
                            onRight={ () => { Actions.refresh({ filtro: true }) } }
                            rightTitle="Filtrar"
                        />

                        {/* Detalles del Incidente */}
                        <Tabs
                            key="tabs_detalle_incidente_admin"
                            tabBarStyle={{ backgroundColor: 'rgb(16, 6, 159)', color: '#ffffff'}}
                            navigationBarStyle={ styles.navigationBarStyle }
                            navBarButtonColor='white'
                            activeTintColor='white'
                            title='Detalle del Incidente'

                        >

                            <Scene
                                navBarButtonColor='white'
                                key='recepcion_alerta'
                                hideNavBar={true}
                                component={RecepcionAlertaAdmin}
                                title="Recepción Alerta"
                                onBack={ (this.onBackIncidentes.bind(this)) }
                                navigationBarStyle={ styles.navigationBarStyle }
                                iconName="envelope-open"
                                icon={TabIcon}
                                backTitle="Inicio"
                                backButtonTintColor="#ffffff"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                tabBarLabel="Recepción Alerta"
                                success={ (this.onSuccessDetalleIncidenteAdmin.bind(this)) }
                                on={ (this.onDetalleIncidenteAdmin.bind(this)) }

                            />

                            <Scene
                                navBarButtonColor='white'
                                key='detalle_incidente_admin'
                                hideNavBar={true}
                                component={DetalleIncidenteAdmin}
                                title="Detalle del Incidente"
                                onBack={ (this.onBackIncidentes.bind(this)) }
                                navigationBarStyle={ styles.navigationBarStyle }
                                iconName="tasks"
                                icon={TabIcon}
                                backTitle="Inicio"
                                backButtonTintColor="#ffffff"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                tabBarLabel="Monitor Actividades"
                                success={ (this.onSuccessDetalleIncidenteAdmin.bind(this)) }
                                on={ (this.onDetalleIncidenteAdmin.bind(this)) }

                            />

                            <Scene
                                navBarButtonColor='white'
                                key='detalle_incidente'
                                hideNavBar={true}
                                component={DetalleIncidente}
                                title="Mis Actividades"
                                onBack={ (this.onBackIncidentes.bind(this)) }
                                navigationBarStyle={ styles.navigationBarStyle }
                                iconName="list-ul"
                                icon={TabIcon}
                                backTitle="Inicio"
                                backButtonTintColor="#ffffff"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                tabBarLabel="Mis Actividades"
                                success={ (this.onSuccessDetalleIncidente.bind(this)) }
                                on={ (this.onDetalleIncidente.bind(this)) }

                            />

                        </Tabs>

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }  back={true} hideNavBar={true}
                            navBarButtonColor='white'
                            key='sin_conexion'
                            hideNavBar={false}
                            component={SinConexion}
                            title="Sin Conexión"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Inicio"
                        />

                        {/* <Scene
                            navBarButtonColor='white'
                            key='notificaciones'
                            hideNavBar={false}
                            component={Notificaciones}
                            title="Notificaciones"
                            backButtonTextStyle={{ color: '#ffffff'}}
                        /> */}

                        <Tabs
                            key="tabs_notificaciones"
                            tabBarStyle={{ backgroundColor: 'rgb(16, 6, 159)', color: '#ffffff'}}
                            hideNavBar={true}
                        >

                            <Scene
                                navBarButtonColor='white'
                                key='detalle_notificacion'
                                hideNavBar={false}
                                back={true}
                                component={Notificaciones}
                                title="Notificaciones"
                                navigationBarStyle={ styles.navigationBarStyle }
                                iconName="envelope"
                                icon={TabIcon}
                                backTitle="Inicio"
                                backButtonTintColor="#ffffff"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                tabBarLabel="No Leídas"
                                success={ (this.onSuccessNoLeidas.bind(this)) }
                                on={ (this.onNoLeidas.bind(this)) }
                            />

                            <Scene
                                navBarButtonColor='white'
                                key='notificacions_readed'
                                hideNavBar={false}
                                back={true}
                                component={NotificationsReaded}
                                title="Notificaciones"
                                navigationBarStyle={ styles.navigationBarStyle }
                                iconName="envelope-open"
                                icon={TabIcon}
                                backTitle="Inicio"
                                backButtonTintColor="#ffffff"
                                backButtonTextStyle={{ color: '#ffffff'}}
                                tabBarLabel="Leídas"
                                // success={ (this.onSuccessLeidas.bind(this)) }
                                // on={ (this.onLeidas.bind(this)) }
                                rightTitle={'Limpiar'}
                                limpiar={false}
                                onRight={() => {

                                    Actions.refresh({ limpiar: true })

                                }}
                                onBack={() => {
                                    Actions.home()
                                }}
                                
                            />

                        </Tabs>

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }
                            navBarButtonColor='white'
                            key='mi_cuenta'
                            hideNavBar={false}
                            component={MiCuenta}
                            title="Mi Cuenta"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Configuración"
                            back={true}
                        />

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }
                            navBarButtonColor='white'
                            key='cambiar_password'
                            hideNavBar={false}
                            component={CambiarPassword}
                            title="Cambiar Contraseña"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Mi Cuenta"
                            back={true}
                        />

                        <Scene
                            navigationBarStyle={ styles.navigationBarStyle }  back={true} hideNavBar={true}
                            navBarButtonColor='white'
                            key='seguridad'
                            hideNavBar={false}
                            component={Seguridad}
                            title="Seguridad"
                            backButtonTextStyle={{ color: '#ffffff'}}
                            backTitle="Configuración"
                        />

                    <Scene
                        navBarButtonColor='white'
                        tabs={false}
                        hideNavBar={false}
                        back={true}
                        backTitleEnable={true}
                        key="agregar_actividad"
                        component={AgregarActividad}
                        title="Nueva Actividad"
                        backTitle="Actividades"
                        backButtonTintColor="#ffffff"
                        backButtonTextStyle={{ color: '#ffffff'}}
                        // onBack={ (this.onBackActividades.bind(this)) }
                        navigationBarStyle={ styles.navigationBarStyle }

                    />

                    <Scene
                        navBarButtonColor='white'
                        tabs={false}
                        key='detalles_actividad'
                        hideNavBar={false}
                        component={DetallesActividad}
                        title="Información"
                        backTitle="Actividades"
                        backButtonTintColor="#ffffff"
                        backButtonTextStyle={{ color: '#ffffff'}}
                        onBack={ (this.onBackActividades.bind(this)) }
                        navigationBarStyle={ styles.navigationBarStyle }
                    />

                    <Scene
                        navBarButtonColor='white'
                        key='agregar_mensaje'
                        hideNavBar={false}
                        component={AgregarMensaje}
                        title="Agregar Mensaje"
                        backTitle="Mensajes"
                        backButtonTintColor="#ffffff"
                        backButtonTextStyle={{ color: '#ffffff'}}
                        onBack={ (this.onBackMensajes.bind(this)) }
                        navigationBarStyle={ styles.navigationBarStyle }
                    />

                    <Scene
                        navigationBarStyle={ styles.navigationBarStyle }  back={true} hideNavBar={true}
                        navBarButtonColor='white'
                        key='agregar_equipo'
                        hideNavBar={false}
                        component={AgregarEquipo}
                        title="Crear Equipo"
                        backButtonTextStyle={{ color: '#ffffff'}}
                        backTitle="Inicio"
                    />

                    <Scene
                        navBarButtonColor='white'
                        key='detalles_mensaje'
                        hideNavBar={false}
                        component={DetallesMensaje}
                        title="Información"
                        backTitle="Mensajes"
                        backButtonTintColor="#ffffff"
                        backButtonTextStyle={{ color: '#ffffff'}}
                        onBack={ (this.onBackMensajes.bind(this)) }
                        navigationBarStyle={ styles.navigationBarStyle }
                    />

                    <Scene
                        navBarButtonColor='white'
                        key='detalles_incidente_user'
                        hideNavBar={false}
                        component={DetalleIncidenteUser}
                        title="Mis Actividades"
                        backTitle="Incidentes"
                        backButtonTintColor="#ffffff"
                        backButtonTextStyle={{ color: '#ffffff'}}
                        navigationBarStyle={ styles.navigationBarStyle }
                    />

                    <Scene
                        navBarButtonColor='white'
                        key='editar_actividad_incidente_user'
                        hideNavBar={false}
                        component={EditarActividadIncidenteUser}
                        title="Editar Actividad"
                        backTitle="Actividades"
                        backButtonTintColor="#ffffff"
                        backButtonTextStyle={{ color: '#ffffff'}}
                        navigationBarStyle={ styles.navigationBarStyle }

                    />

                    {/* Tab detalle de incidente para administrador
                    <Scene activeTintColor='#ffffff' inactiveTintColor='rgb(199, 199, 201)' hideNavBar={true}  tabBarStyle={{ backgroundColor: 'rgb(16, 6, 159)', color: '#ffffff'}}   lazy={true} titleStyle={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center'}} navBarButtonColor='white' tabs={true} tabBarPosition="bottom" legacy={true}  back={true}>





                    </Scene>
                    */}

                    <Scene
                        navBarButtonColor='white'
                        key='detalles_notificacion'
                        hideNavBar={false}
                        component={DetallesNotificacion}
                        title="Detalles"
                        backTitle="Notificaciones"
                        backButtonTintColor="#ffffff"
                        backButtonTextStyle={{ color: '#ffffff'}}
                        onBack={ (this.onBackNotificaciones.bind(this)) }
                        navigationBarStyle={ styles.navigationBarStyle }
                    />

                    <Scene
                        navBarButtonColor='white'
                        key='editar_actividad_incidente'
                        hideNavBar={false}
                        component={EditarActividadIncidente}
                        title="Editar Actividad"
                        backTitle="Actividades"
                        backButtonTintColor="#ffffff"
                        backButtonTextStyle={{ color: '#ffffff'}}
                        onBack={ (this.onBackMisActividades.bind(this)) }
                        navigationBarStyle={ styles.navigationBarStyle }
                    />

                    

                </Scene>

            </Router>

        );
    }

    onAgregar(){

        Actions.agregar_protocolo()

    }

    onBackProtocolos(){

        Actions.popTo('protocolos')

    }

    onBackHome(){

        Actions.reset('home_routes')

    }

    onBackDetalleProtocolo(){

        Actions.protocolos()

    }

    onBackMensajes(){

        Actions.mensajes()

    }

    onBackNotificaciones(){

        Actions.detalle_notificacion()

    }

    onBackActividades(){

        {/*
        Actions.actividades({text: 1})
        */}
        Actions.actividades()

    }

    onBackIncidentes(){

        Actions.en_curso()

    }

    onBackMisActividades(){

        Actions.detalle_incidente()

    }

    onBackActividadesIncidenteUser(){

        Actions.detalles_incidente_user()

    }

    onSuccessActividades(){

        Actions.refresh()

    }

    onActividades(){

        return true;

    }

    onProtocolos(){

        //console.log('onProtocolos')

        Actions.refresh({ nuevo: 'nuevo' })

        //return true;

    }

    onSuccessMensajes(){

        Actions.refresh()

    }

    onMensajes(){

        return true;

    }

    onBackSettings(){
        Actions.settings({text: 'Hello World'})
    }

    onSettings(){
        return true;
    }

    onSuccessNoLeidas(){

        Actions.refresh()

    }

    onNoLeidas(){

        return true;

    }

    onSuccessLeidas(){

        Actions.refresh()

    }

    onLeidas(){

        return true;

    }

    onSuccessDetalleIncidente(){

        Actions.refresh()

    }

    onDetalleIncidente(){

        return true;

    }

    onSuccessDetalleIncidenteAdmin(){

        Actions.refresh()

    }

    onDetalleIncidenteAdmin(){

        return true;

    }

    onSuccessEnCurso(){

        Actions.refresh({filtro: false})

    }

    onEnCurso(){

        return true;

    }

    onBackHome(){

        Actions.home_routes()

    }

    onSuccessSettings(){

        Actions.refresh()

    }

    onSettings(){

        return true;

    }




}

const styles = StyleSheet.create({

    tabBar: {
        borderTopColor: 'darkgrey',
        borderTopWidth: 1 / PixelRatio.get(),
        backgroundColor: 'ghostwhite',
        opacity: 0.98,
    },
    navigationBarStyle: {
        backgroundColor: 'rgb(16, 6, 159)',
    },
    navigationBarTitleStyle: {
        color:'white',
    },

});

export default Routes
