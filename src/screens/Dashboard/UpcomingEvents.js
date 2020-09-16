import React from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import MultiTypeEventsCards from '../MultiTypeEventsCards'
import axios from 'axios'
import { withNavigation } from 'react-navigation'

class UpcomingEventsScreen extends React.Component {
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
        const {navigation}=this.props
        this.focusListener = navigation.addListener('didFocus',()=>{
            if(this.state.upData.length==0){
                this.getUpcomingData()
            }
        })
    }
    componentWillUnmount(){
        this.focusListener.remove()
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
            console.log(error)
        })
    }

    
    async getUserData(){
        try{
            let user = await AsyncStorage.getItem('userProfileDataPlayer')
            let parsed = JSON.parse(user)
            this.userData= parsed

        }catch(error){
            console.log(error)
        }
    }
    


    render() {
        const {showMessage, showTwoMessage, showThreeMessage} = this.state
        return (
            <View style={{backgroundColor:'white', flex:1}}>
                    <View style={{ paddingTop: 10 }}>
                    {this.state.dataThreeLoaded?<FlatList
                                // style={{marginBottom:100}}
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

export default withNavigation(UpcomingEventsScreen)