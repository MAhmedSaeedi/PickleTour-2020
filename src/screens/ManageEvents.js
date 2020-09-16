import React from 'react';
import { ActivityIndicator,FlatList,AsyncStorage, View, Text,  Dimensions, StyleSheet,TouchableOpacity } from 'react-native';
import EventCardsMa1 from './EventCardsMa1'
import EventCardsMa2 from './EventCardsMa2'
import Responsive from 'react-native-lightweight-responsive';
import EventCardsMa3 from './EventCardsMa3'
import axios from 'axios';


export default class MainScreen extends React.Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Manage Events</Text>
    }
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
    }
    async getItem(){

        
            try{
                let user = await AsyncStorage.getItem('userProfileDataPlayer')
                this.data= JSON.parse(user)
                this.getMyEvents()
                this.getRequestedEvents()
              }catch(error){
                console.log(error)
              }
    }
    
    getMyEvents(){
        var myEvents=[]
        this.setState({dataOneFetching:true})
        var userId = this.data.uid
        var gettingUrl = 'https://pickletour.com/api/get/enroll/Events/'
        axios.get(gettingUrl+userId)
        .then((response)=>{
            myEvents = response.data
            if(myEvents.length>0){
                this.setState({
                    eventsData:myEvents,
                    dataOneLoaded:true,
                    showMessage:false,
                    dataOneFetching:false
                })
            }
            else{
                this.setState({
                    dataOneLoaded:false,
                    showMessage:true,
                    dataOneFetching:false
                })
            }
        }).catch((error)=>{
            console.log(error)
        })

    }


    checkingReqEvents(reqEvents){
        let result = reqEvents.filter(item => item.isAccepted == false)
        if(result.length==0){
            this.setState({
                dataTwoLoaded:false,
                showTwoMessage:true,
                dataTwoFetching:false
            })
        }
        else{
            this.setState({
                dataTwoLoaded:true,
                reqData:reqEvents,
                dataTwoFetching:false
            })
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

    


    refreshOnButtonClickMyEvents(){
        if(this.state.eventsData.length==0)
        {
            this.setState({actScr:1},()=>this.getMyEvents())
        }
        else{
            this.setState({actScr:1})
        }
    }
    refreshOnButtonClickReqEvents(){
        if(this.state.reqData.length ==0){
            this.setState({actScr:2},()=>this.getRequestedEvents())
        }
        else{
            this.setState({actScr:2})
        }
    }

    
    render() {
        const {showMessage, showTwoMessage, showThreeMessage} = this.state
        return (
            <View>
                <View style={styles.wrapTopSty}>
                    <TouchableOpacity onPress={() => this.refreshOnButtonClickMyEvents()} style={this.state.actScr == 1 ? styles.topBarStyAct : styles.topBarSty}>
                        <Text style={this.state.actScr==1?styles.selectedtopBarText:styles.topBarText}>My Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.refreshOnButtonClickReqEvents()} style={this.state.actScr == 2 ? styles.topBarStyAct : styles.topBarSty}>
                        <Text style={this.state.actScr==2?styles.selectedtopBarText:styles.topBarText}>Requested Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ actScr: 3 })} style={this.state.actScr == 3 ? styles.topBarStyAct : styles.topBarSty}>
                        <Text style={this.state.actScr==3?styles.selectedtopBarText:styles.topBarText}>My Invitations</Text>
                    </TouchableOpacity>
                </View>
                    {this.state.actScr == 1 ? <View style={{paddingTop:10  }}>
                        

                        {this.state.dataOneLoaded?<FlatList
                                style={{marginBottom:90}}
                                data ={this.state.eventsData}
                                keyExtractor={item => item._id}
                                refreshing={this.state.dataOneFetching}
                                onRefresh={()=>this.getMyEvents()}
                                renderItem={({item})=>(
                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('EventDetailsScreen',{item}) }}>
                                    <EventCardsMa1 data={item}/>
                                </TouchableOpacity>
                                )}
                            />:<View style={{ paddingTop:"50%",flex: 1,justifyContent: 'center'}}>

                            {showMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>No Events found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                            
                            
                        
                                </View>}

                    </View> : null}
                    {this.state.actScr == 2 ? <View style={{ paddingTop: 10 }}>
                    {this.state.dataTwoLoaded?<FlatList
                                style={{marginBottom:90}}
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
                            {showTwoMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20), color:'black'}}>No Requests found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                        </View>}
                    </View> : null}
                    {this.state.actScr == 3 ? <View style={{ paddingTop: 10 }}>
                    {this.state.dataOneLoaded?<FlatList
                                style={{marginBottom:90}}
                                keyExtractor={item => item._id}
                                data ={this.state.inviData}
                                refreshing={this.state.dataThreeFetching}
                                renderItem={({item})=>(
                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('InvitationDetailsScreen',{item}) }}>
                                        <EventCardsMa3 data={item}/>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={()=>(
                                    <View style={{paddingTop:'50%'}}>
                                        <Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Feature Coming soon !</Text>
                                    </View>
                                )}
                            />:<View style={{ paddingTop:"50%",flex: 1,justifyContent: 'center'}}>
                            {showThreeMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>No data found !</Text>: 
                            (this.state.inviData.length<=0) &&
                            (<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Feature Coming soon !</Text>)                          
                            }
                        </View>}
                    </View> : null}
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