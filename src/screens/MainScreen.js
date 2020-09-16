import React from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import EventCards from './EventCards'
import MultiTypeEventsCards from './MultiTypeEventsCards'
import axios from 'axios'
export default class MainScreen extends React.Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Dashboard</Text>
    }
    constructor(props) {
        super(props);
        this.userData=''
        this.userId=''
        this.state = {
            actScr: 1,
            seLoc: '',
            compData: [],
            upData:[],
            onData:[],
            dataOneLoaded:false,
            dateOneFetching:false,
            dataTwoLoaded:false,
            dataTwoFetching:false,
            dataThreeLoaded:false,
            dataThreeFetching:false,
            loading: true,
            dataFound: false,
            showButton:false,
            showMessage:false,
            showTwoMessage:false,
            showThreeMessage:false
        };
    }
    componentDidMount(){
        this.getUserData()
    }

    
    getCompletedData(){
        this.setState({dateOneFetching:true})
        var compEvents=[];
        var userId = this.userData.uid
        var gettingUrl = 'https://pickletour.com/api/get/completed/Events/'
        axios.get(gettingUrl+userId)
        .then((response)=>{
            compEvents = response.data
            if(compEvents.length>0){
                this.setState({
                    compData:compEvents,
                    dataOneLoaded:true,
                    dateOneFetching:false
                })
            }
            else{
                this.setState({
                    dataOneLoaded:false,
                    showMessage:true,
                    dateOneFetching:false
                })
            }
        }).catch((error)=>{
           // console.log(error)
        })
    }

    getUpcomingData(){
        this.setState({dataThreeFetching:true})
        var upEvents=[];
        var userId = this.userData.uid
        var gettingUrl = 'https://pickletour.com/api/get/upcoming/Events/'
        axios.get(gettingUrl+userId)
        .then((response)=>{
            upEvents = response.data
            if(upEvents.length>0){
                this.setState({
                    upData:upEvents,
                    dataThreeLoaded:true,
                    dataThreeFetching:false
                })
            }
            else{
                this.setState({
                    dataThreeLoaded:false,
                    showThreeMessage:true,
                    dataThreeFetching:false
                })
            }
        }).catch((error)=>{
           // console.log(error)
        })
    }

    getOngoingData(){
        this.setState({dataTwoFetching:true})
        var onEvents=[];
        var userId = this.userData.uid
        var gettingUrl = 'https://pickletour.com/api/get/ongoing/Events/'
        axios.get(gettingUrl+userId)
        .then((response)=>{
            onEvents = response.data
            if(onEvents.length>0){
                this.setState({
                    onData:onEvents,
                    dataTwoLoaded:true,
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
        }).catch((error)=>{
           // console.log(error)
        })
    }
  
    async getUserData(){
        try{
            let user = await AsyncStorage.getItem('userProfileDataPlayer')
            let parsed = JSON.parse(user)
            this.userData= parsed
            this.getUpcomingData()
            this.getOngoingData()
            this.getCompletedData()

        }catch(error){
            //console.log(error)
        }
    }
    

    refreshOnButtonClickCompletedEvents(){
        if(this.state.compData.length ==0){
            this.setState({actScr:1},()=>this.getCompletedData())
        }
        else{
            this.setState({actScr:1})
        }
    }

    refreshOnButtonClickOngoingEvents(){
        if(this.state.onData.length ==0){
            this.setState({actScr:2},()=>this.getOngoingData())
        }
        else{
            this.setState({actScr:2})
        }
    }

    refreshOnButtonClickUpcomingEvents(){
        if(this.state.upData.length ==0){
            this.setState({actScr:3},()=>this.getUpcomingData())
        }
        else{
            this.setState({actScr:3})
        }
    }
    render() {
        const {showMessage, showTwoMessage, showThreeMessage} = this.state
        return (
            <View>
                <View style={styles.wrapTopSty}>

                    
                    <TouchableOpacity onPress={() => this.refreshOnButtonClickCompletedEvents()} style={this.state.actScr == 1 ? styles.topBarStyAct : styles.topBarSty}>
                        <Text style={this.state.actScr==1?styles.selectedtopBarText:styles.topBarText}>Completed Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.refreshOnButtonClickOngoingEvents()} style={this.state.actScr == 2 ? styles.topBarStyAct : styles.topBarSty}>
                        <Text style={this.state.actScr==2?styles.selectedtopBarText:styles.topBarText}>Ongoing Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.refreshOnButtonClickUpcomingEvents()} style={this.state.actScr == 3 ? styles.topBarStyAct : styles.topBarSty}>
                        <Text style={this.state.actScr==3?styles.selectedtopBarText:styles.topBarText}>Upcoming Events</Text>
                    </TouchableOpacity>
                </View>
                    {this.state.actScr == 1 ? 
                        <View style={{ paddingTop:10 }}>
                            {this.state.dataOneLoaded?<FlatList
                                style={{marginBottom:100}}
                                keyExtractor={item => item._id}
                                refreshing={this.state.dateOneFetching}
                                onRefresh={()=>this.getCompletedData()}
                                data ={this.state.compData}
                                renderItem={({item})=>(
                                    <EventCards navigation={this.props.navigation} data={item} />
                                )}
                            />:<View style={{ paddingTop:"50%",flex: 1,justifyContent: 'center'}}>
                                    {showMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Completed Events not found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                                </View>
                            }
                            
                        </View> : null}
                    {this.state.actScr == 2 ? <View style={{ paddingTop: 10 }}>
                    {this.state.dataTwoLoaded?<FlatList
                                style={{marginBottom:100}}
                                keyExtractor={item => item._id}
                                data ={this.state.onData}
                                refreshing={this.state.dataTwoFetching}
                                onRefresh={()=>this.getOngoingData()}
                                renderItem={({item})=>(
                                    <MultiTypeEventsCards navigation={this.props.navigation} data={item} />
                                )}
                            />:<View style={{ paddingTop:"50%",flex: 1,justifyContent: 'center'}}>
                                {showTwoMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Ongoing Events not found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                            </View>
                    }
                    </View> : null}
                    {this.state.actScr == 3 ? <View style={{ paddingTop: 10 }}>
                    {this.state.dataThreeLoaded?<FlatList
                                style={{marginBottom:100}}
                                keyExtractor={item => item._id}
                                data ={this.state.upData}
                                
                                refreshing={this.state.dataThreeFetching}
                                onRefresh={()=>this.getUpcomingData()}
                                renderItem={({item})=>(
                                    <MultiTypeEventsCards navigation={this.props.navigation} data={item} show={false}/>
                                )}
                            />:<View style={{paddingTop:"50%", flex: 1,justifyContent: 'center'}}>
                                    {showThreeMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Upcoming Events not found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                                </View>
                    }
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