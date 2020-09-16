import React from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import MultiTypeEventsCards from '../MultiTypeEventsCards'
import axios from 'axios'
import { withNavigation } from 'react-navigation'

class OnGoingEventsScreen extends React.Component {
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
            if(this.state.onData.length==0){
                this.getOngoingData()
            }
        })
    }
    componentWillUnmount(){
        this.focusListener.remove()
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
                    {this.state.dataTwoLoaded?<FlatList
                                // style={{marginBottom:100}}
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

export default withNavigation(OnGoingEventsScreen)