import React, { Component } from 'react';
import {  StyleSheet,ActivityIndicator, Image, Platform, Alert, BackHandler, Modal, View, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import  LinearGradient from 'react-native-linear-gradient';
import firebase from 'firebase';
import {Icon} from 'native-base'
import OneSignal from 'react-native-onesignal'
import NetInfo from "@react-native-community/netinfo";
import User from '../helpers/Users';



 
let token=''
class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.data=''
    this.state = {
      cannotContinue:false
    };
  }


  async getUserData(){
    try{
        await this.getMode()
        let user = await AsyncStorage.getItem('userProfileDataPlayer')
        console.log(user)
        if(user!=null){
          this.props.navigation.navigate("Drawer");
        }
        else{
          this.props.navigation.navigate("Auth");
        }
  
      }catch(error){
       // console.log(error)
      }
}

  async getMode (){
    try{
      let mode = await AsyncStorage.getItem("Mode")
      console.log(mode)
      if(mode==null){
        await AsyncStorage.setItem("Mode", 'Player')
      }
    }catch(error){}
  }


  NavigateScreen(){
    firebase.auth().onAuthStateChanged(user =>{
      if(user){
        setTimeout(()=>{
          this.props.navigation.navigate("Drawer");
        },3000)
      }  
      else{
        this.props.navigation.navigate("Auth");
      }
    })
  }

  componentDidMount(){
    NetInfo.fetch().then(state => {
      if(state.isConnected==true){
        this.getUserData()
      }
      else{
        this.setState({cannotContinue:true})
      }
    });
  }

  recheckConnectivity(){
    NetInfo.fetch().then(state => {
      if(state.isConnected==true){
        this.getUserData()
        this.setState({cannotContinue:false})
      }
    })
  }

  render() {
    return (
      <LinearGradient  colors={['#B9F0FB','#65A8B5']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#86d6b9' }}>
        <Modal 
          transparent={true}
          animationType='none'
          visible={this.state.cannotContinue}
        >
            <View
                style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'rgba(52, 52, 52, 0.7)' }} 
            >
               
                <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'80%', borderWidth:1, borderColor:'#64A8B5'}}>
                    <Icon type="Entypo" name="circle-with-cross"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#E9835D'}}/>
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13), marginTop:10}}>It seems like you are not connected</Text>
                    <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(13)}}>to internet.</Text>
                    {Platform.OS=='android' && 
                      <TouchableOpacity onPress={()=>this.recheckConnectivity()} 
                        style={{alignSelf:'center', backgroundColor:'#32CDEA', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Retry</Text>
                      </TouchableOpacity>
                    }

                    {Platform.OS=='android' &&
                      <TouchableOpacity onPress={()=>BackHandler.exitApp()} 
                        style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Exit</Text>
                      </TouchableOpacity>
                    }

                    {Platform.OS=='ios' && <View style={{paddingVertical:5, marginBottom:10, marginTop:10}}></View>}
                    
                    
                </View>
            </View>


        </Modal>
        <Image resizeMode='contain' style={{ height:'50%', marginBottom:100, width: '85%'}} source={require('../../assets/NLogo.png')}/>
        <ActivityIndicator size='large' style={{flex:1, alignSelf:'center'}} color='#86D6B9'/>
      </LinearGradient>
    );
  }
}


export default LoadingScreen;


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})