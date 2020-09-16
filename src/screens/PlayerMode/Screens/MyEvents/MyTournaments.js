import React, { Component } from 'react';
import { ActivityIndicator,FlatList,AsyncStorage, View, Text,  Dimensions, StyleSheet,TouchableOpacity, BackHandler } from 'react-native';
import MyEventCards from '../../Cards/MyEventCards';
import Responsive from 'react-native-lightweight-responsive';
import axios from 'axios';
import { withNavigation, StackActions, NavigationActions, NavigationState } from 'react-navigation'
import Toast from 'react-native-tiny-toast'


class MyTournamentsScreen extends Component {
  constructor(props) {
    super(props);
    this.data=''
    this.pressCount=0
    this.state = {
      callCount:0,
      myTeams:[],
      dataTwoLoaded:false,
      dataTwoFetching:false,
      showTwoMessage:false,
      backPressed:false
    };
  }

  async getItem(){

        
    try{
        let user = await AsyncStorage.getItem('userProfileDataPlayer')
        this.data= JSON.parse(user)
        this.getMyEvents()
        
      }catch(error){
        //console.log(error)
      }
  }

  componentDidMount(){
    this.getItem()
    this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
  }


  backAction=()=>{
    if(this.pressCount==2){
      BackHandler.exitApp()
     }else{
       if(this.pressCount==1){
        this.pressCount = this.pressCount+1
        Toast.show('Press back again to exit app')
        setTimeout(()=>{
          this.pressCount=0
        },2000)
       }
       else{
        this.props.navigation.openDrawer()
        this.pressCount = this.pressCount+1
       }
       
     }
    return true
  }

  componentWillUnmount(){
    this.backHandler.remove()
    
}


  getMyEvents(){
    this.setState({dataTwoFetching:true})
    axios.get(`https://pickletour.appspot.com/api/duo/player/get/${this.data.uid}`)
    .then((resp)=>{
      if(resp.data.length>0){
        this.setState({
          myTeams:resp.data,
          showTwoMessage:false,
          dataTwoLoaded:true,
          dataTwoFetching:false
        })
      }
      else{
        if(this.state.callCount==0){
          this.setState({callCount:1},()=>this.getMyEvents())
        }
        else{
          this.setState({
            dataTwoLoaded:false,
            dataTwoFetching:false,
            showTwoMessage:true
          })
        }
      }
    })

  }

  render() {
    const { showTwoMessage} = this.state
    return (
      <View style={{ flex:1, backgroundColor:'white'}}>
                    
                    <View style={{ paddingTop: 10 }}>
                    {this.state.dataTwoLoaded?<FlatList
                                extraData={this.state}
                                data ={this.state.myTeams}
                                refreshing={this.state.dataTwoFetching}
                                onRefresh={()=>this.getMyEvents()}
                                keyExtractor={item => item._id}
                                renderItem={({item})=>(
                                  <TouchableOpacity onPress={() => { this.props.navigation.navigate('PlayerEventDetailsTwo',{item})}}>
                                    <MyEventCards data={item}  type={'Tournament'}/>
                                  </TouchableOpacity>
                                )}
                            />:<View style={{ paddingTop:"50%",flex: 1,justifyContent: 'center'}}>
                            {showTwoMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20), color:'#585858'}}>No Requests found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                        </View>}
                    </View> 
            </View>
    );
  }
}

export default withNavigation(MyTournamentsScreen);
