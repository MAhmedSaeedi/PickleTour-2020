import React, { Component } from 'react';
import AppContainer from './src/navigations/AppNavigator';
import firebase from 'firebase';
import { AsyncStorage } from 'react-native'
import {firebaseConfig} from './src/configurations/config';
import { MenuProvider } from 'react-native-popup-menu'
import OneSignal from 'react-native-onesignal';
import { Provider } from 'react-redux'
import { store } from './src/store/slices/index'
import Orientation from 'react-native-orientation-locker';


firebase.initializeApp(firebaseConfig)
export default class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      splashScreenTimer:null,
      mode:''
    }

  }
  componentDidMount(){
    Orientation.lockToPortrait()
    OneSignal.init('e07379d0-8c63-41cb-b102-0c3086332aec');
    OneSignal.inFocusDisplaying(2)
    OneSignal.addEventListener('received',(data)=>{
      // console.log(data)
    })
    OneSignal.addEventListener('ids', this.onIds);

  }

  async onIds(device) {
    try{
      //await AsyncStorage.setItem('PushTokenID', JSON.stringify(device.pushToken))
      await AsyncStorage.setItem('UserID', JSON.stringify(device.userId))
      //this.createNotificationLocally(device.userId)
      // console.log(device.pushToken)
    }
    catch(error){
      // console.log(error)
    }
    //console.log('Device info: ', device.pushToken);
  }

  

  componentWillUnmount(){
    OneSignal.removeEventListener('received')
    OneSignal.removeEventListener('ids')
  }

 

  render() {
    return (
      <Provider store ={store}>
        <MenuProvider>
          <AppContainer/>
        </MenuProvider>
      </Provider>
    )
  }
}