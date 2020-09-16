import React from 'react';
import { ActivityIndicator,FlatList,AsyncStorage, View, Text,  Dimensions, StyleSheet,TouchableOpacity, BackHandler } from 'react-native';
import EventCardsMa2 from '../EventCardsMa2'
import Responsive from 'react-native-lightweight-responsive';
import axios from 'axios';
import { withNavigation } from 'react-navigation'

class RequestedEventsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.data=''
        this.state = {
            actScr: 1,
            eventsData:[],
            reqData:[],
            inviData:[],
            dataOneLoaded:false,
            dataOneFetching:false,
            dataTwoLoaded:false,
            dataTwoFetching:false,
            dataThreeLoaded:false,
            dataThreeFetching:false,
            showMessage:false,
            showTwoMessage:false,
            showThreeMessage:false,
            userIdGlobal:null
        };
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


    async getItem(){

        
            try{
                let user = await AsyncStorage.getItem('userProfileDataPlayer')
                this.data= JSON.parse(user)
              }catch(error){
                console.log(error)
              }
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
                console.log(dummyData)
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



    
    
    render() {
        const {showMessage, showTwoMessage, showThreeMessage} = this.state
        return (
            <View style={{ flex:1, backgroundColor:'white'}}>
                    
                    <View style={{ paddingTop: 10 }}>
                    {this.state.dataTwoLoaded?<FlatList
                                // style={{marginBottom:90}}
                                data ={this.state.reqData}
                                refreshing={this.state.dataTwoFetching}
                                onRefresh={()=>this.getRequestedEvents()}
                                keyExtractor={item => item._id}
                                renderItem={({item})=>{
                                    if(item.isAccepted == false){
                                            return  <TouchableOpacity onPress={() => { this.props.navigation.navigate('RefereeRequestDetailsScreen',{item}) }}>
                                            <EventCardsMa2 data={item}/>
                                        </TouchableOpacity>
                                    }

                                }}
                            />:<View style={{ paddingTop:"50%",flex: 1,justifyContent: 'center'}}>
                            {showTwoMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>No Requests found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                        </View>}
                    </View> 
            </View>

        );
    }
}
const styles = StyleSheet.create({
    topBarSty: {
        height: 40,
        width: Dimensions.get('window').width / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },

    wrapTopSty: {
        backgroundColor: '#686868',
        flexDirection: 'row',
    },
    topBarText: {
        color: 'white',
        fontFamily: 'Lato-Bold',
        fontSize:Responsive.font(12)
    },
    selectedtopBarText:{
        color:'#9EEACE',
        fontFamily: 'Lato-Bold',
        textDecorationLine:'underline',
        fontSize:Responsive.font(12)
    },
    topBarStyAct: {
        height: 40,
        width: Dimensions.get('window').width / 3,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    divider: { width: '100%', height: 10, backgroundColor: 'white' }
});

export default withNavigation(RequestedEventsScreen)