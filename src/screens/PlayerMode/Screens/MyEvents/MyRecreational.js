import React, { Component } from 'react';
import { ActivityIndicator,FlatList,AsyncStorage, View, Text,  Dimensions, StyleSheet,TouchableOpacity } from 'react-native';
import MyEventCards from '../../Cards/MyEventCards';
import Responsive from 'react-native-lightweight-responsive';
import axios from 'axios';
import { withNavigation } from 'react-navigation'

class MyRecreationalScreen extends Component {
  constructor(props) {
    super(props);
    this.data=''
    this.state = {
      callCount:0,
      reqData:[],
      dataTwoLoaded:false,
      dataTwoFetching:false,
      showTwoMessage:false,
    };
  }

  async getItem(){

        
    try{
        let user = await AsyncStorage.getItem('userProfileDataPlayer')
        this.data= JSON.parse(user)
        
      }catch(error){
        //console.log(error)
      }
  }
  componentDidMount(){
    this.getItem()
    const {navigation}=this.props
        this.focusListener = navigation.addListener('didFocus',()=>{
            if(this.state.reqData.length==0){
                this.getRequestedEvents()
            }
        })
  }
  componentWillUnmount(){
    this.focusListener.remove()
}

  getRequestedEvents(){
    var reqEvents = []
    this.setState({dataTwoFetching:true})
    var userId = this.data.uid
    var gettingUrl = 'https://pickletour.com/api/get/referee/requests/'
    axios.get(gettingUrl+userId)
    .then((response)=>{
        reqEvents = response.data
        if(reqEvents.length>0){
            this.checkingReqEvents(reqEvents)
         
        }
        else {
        
            this.setState({
              dataTwoLoaded:false,
              showTwoMessage:true,
              dataTwoFetching:false
          })
          
        }
    })
  }

  checkingReqEvents(reqEvents){
    var dummyData=[]
    let result = reqEvents.filter(item => item.isAccepted == false)
    if(result.length==0){
        this.setState({
            dataTwoLoaded:false,
            showTwoMessage:true,
            dataTwoFetching:false
        })
    }
    else{
        reqEvents.map(item=>{
            var msDiff = new Date(item.tournamentStartDate).getTime() - new Date().getTime()
            if(msDiff >0){
                dummyData.push(item)
              }
        })
        if(dummyData.length>0){
            this.setState({
                dataTwoLoaded:true,
                reqData:dummyData,
                dataTwoFetching:false
            })
        }
        else{
            this.setState({
                dataTwoLoaded:false,
                showTwoMessage:true,
                dataTwoFetching:false
            })
        }
       
    }
}




  render() {
    const { showTwoMessage} = this.state
    return (
      <View style={{ flex:1, backgroundColor:'white'}}>
                    
                    <View style={{ paddingTop: 10 }}>
                    {this.state.dataTwoLoaded?<FlatList
                                
                                data ={this.state.reqData}
                                refreshing={this.state.dataTwoFetching}
                                onRefresh={()=>this.getRequestedEvents()}
                                keyExtractor={item => item._id}
                                renderItem={({item})=>{
                                    if(item.isAccepted == false){
                                            return  <TouchableOpacity onPress={() => { this.props.navigation.navigate('RefereeRequestDetailsScreen',{item}) }}>
                                            <MyEventCards data={item}/>
                                        </TouchableOpacity>
                                    }

                                }}
                            />:<View style={{ paddingTop:"50%",flex: 1,justifyContent: 'center'}}>
                            {showTwoMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20), color:'black'}}>No Requests found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                        </View>}
                    </View> 
            </View>
    );
  }
}

export default withNavigation(MyRecreationalScreen);



