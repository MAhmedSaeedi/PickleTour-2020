import React from 'react';
import { ActivityIndicator,FlatList,AsyncStorage, View, Text,  Dimensions, StyleSheet,TouchableOpacity } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import EventCardsMa3 from '../EventCardsMa3'
import axios from 'axios';
import { withNavigation } from 'react-navigation'


class MyInvitationsScreen extends React.Component {
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
            if(this.state.eventsData.length==0){
                
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


    


    
    render() {
        const {showMessage, showTwoMessage, showThreeMessage} = this.state
        return (
            <View style={{ flex:1, backgroundColor:'white'}}>
                   
                    <View style={{ paddingTop: 10 }}>
                    {this.state.dataThreeLoaded?<FlatList
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
export default withNavigation(MyInvitationsScreen)