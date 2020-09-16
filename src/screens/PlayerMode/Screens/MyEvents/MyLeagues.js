import React, { Component } from 'react';
import { ActivityIndicator,FlatList,AsyncStorage, View, Text,  Dimensions, StyleSheet,TouchableOpacity } from 'react-native';
import MyEventCards from '../../Cards/MyEventCards';
import Responsive from 'react-native-lightweight-responsive';
import axios from 'axios';
import { withNavigation } from 'react-navigation'

class MyLeaguesScreen extends Component {
  constructor(props) {
    super(props);
    this.data=''
    this.state = {
      callCount:0,
      myTeams:[],
      dataTwoLoaded:false,
      dataTwoFetching:false,
      showTwoMessage:false,
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
    // const {navigation}=this.props
    //     this.focusListener = navigation.addListener('didFocus',()=>{
    //         if(this.state.myTeams.length==0){
    //             this.getMyEvents()
    //         }
    //     })
  }
//   componentWillUnmount(){
//     this.focusListener.remove()
// }


  getMyEvents(){
    this.setState({dataTwoFetching:true})
    axios.get(`https://pickletour.appspot.com/api/team/get/team/${this.data.uid}`)
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
                                  <TouchableOpacity onPress={() => { this.props.navigation.navigate('PlayerEventDetailsTwo',{item}) }}>
                                    <MyEventCards data={item} type={'League'}/>
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

export default withNavigation(MyLeaguesScreen);
