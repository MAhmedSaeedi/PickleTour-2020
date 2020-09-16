import React, { Component } from 'react';
import { View, Text, AsyncStorage, FlatList, ActivityIndicator, BackHandler } from 'react-native';
import ManageTeamCards from '../Cards/ManageTeamCards';
import axios from 'axios'
import { withNavigation, StackActions, NavigationActions, NavigationState } from 'react-navigation'
import Toast from 'react-native-tiny-toast'
import Responsive from 'react-native-lightweight-responsive';

class ManageTeamsScreen extends Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Manage Teams</Text>
    }
  constructor(props) {
    super(props);
    this.data=''
    this.pressCount=0
    this.state = {
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
        this.getTeams()
        
      }catch(error){
        console.log(error)
      }
  }

  componentDidMount(){
    this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
    this.getItem()
  }
  componentWillUnmount(){
    this.backHandler.remove()  
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

  getTeams(){
    this.setState({dataTwoFetching:true})
    axios.get(`https://pickletour.appspot.com/api/team/get/teams/userId/${this.data.uid}`)
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
        this.setState({
          dataTwoLoaded:false,
          dataTwoFetching:false,
          showTwoMessage:true
        })
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
                                onRefresh={()=>this.getTeams()}
                                keyExtractor={item => item._id}
                                renderItem={({item})=>(
                                              <ManageTeamCards navigation={this.props.navigation} data={item} fileName={item.tournamentName+item.tName} />
                                           )}
                            />:<View style={{ paddingTop:"50%",flex: 1,justifyContent: 'center'}}>
                            {showTwoMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20), color:'#585858'}}>No Requests found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                        </View>}
                    </View> 
            </View>
    );
  }
}

export default ManageTeamsScreen;
