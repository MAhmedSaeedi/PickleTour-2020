import React, { Component } from 'react';
import { Alert,View, Text, Image, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity,Clipboard, Dimensions, AsyncStorage, ScrollView, Switch, Share, BackHandler } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import { Icon } from 'native-base'
import Toast from 'react-native-tiny-toast'



class InvitePlayersScreen extends Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Invite Player</Text>
    }
  constructor(props) {
    super(props);
    this.state = {
      url:''
    };
  }
  componentDidMount(){
    const url = this.props.navigation.getParam('url')
    this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
    this.setState({url})
  }

  componentWillUnmount(){
    this.backHandler.remove()
  }

  backAction=()=>{
    const data = this.props.navigation.getParam('sender')
    const popAction = StackActions.pop({
      n: 1,
    });
    if(data==true){
      this.props.navigation.dispatch(popAction);
    }
    else{
      this.props.navigation.dispatch(StackActions.popToTop())
    }
  }

  async Share(){
      try{
            const result = await Share.share({
                message:this.state.url,
                title:'Invite link'
            })
            if(result.action === Share.sharedAction){
                //alert("Link shared successfully")
            }
            else if(result.action === Share.dismissedAction){
               // alert("Post Cancelled")
            }
      }catch(error){
            alert(error.message)
      }
  }
  copyToClipboard(){
    Clipboard.setString(this.state.url)    
    Toast.show('Copied to clipboard.')

  }
 

  render() {
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
        <Text style={{alignSelf:'center', paddingTop:10, color:'#585858', fontFamily:'Lato-Bold', fontSize:Responsive.font(13)}}> You have successfully registered in this event!</Text>

        <View style={{flexDirection:'row', justifyContent:'space-around', paddingTop:20, paddingHorizontal:40}}>
            <TouchableOpacity onPress={()=>this.copyToClipboard()} style={{backgroundColor:'#A1E9F7', paddingHorizontal:20, paddingVertical:5, borderRadius:5}}>
                <Text style={{color:'#585858', fontFamily:'Lato-Medium', fontSize:Responsive.font(12)}}>Copy Invite Link</Text>
            </TouchableOpacity>

            <Text style={{color:'#585858', fontFamily:'Lato-Bold',alignSelf:'center', fontSize:Responsive.font(12)}}>or</Text>
            <TouchableOpacity onPress={()=>this.Share()} style={{backgroundColor:'#328696', paddingHorizontal:20, paddingVertical:5, borderRadius:5, flexDirection:'row'}} >
                <Text style={{color:'#FFFFFF', fontFamily:'Lato-Medium', fontSize:Responsive.font(12)}}>Share</Text>
                <Icon type="FontAwesome" name="share-alt"  style={{ paddingLeft:10,alignSelf:'center',fontSize:Responsive.font(14) ,color: '#FFFFFF'}}/>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default InvitePlayersScreen;

