import React from 'react';
import { ActivityIndicator,FlatList,AsyncStorage, View, Text,  Dimensions, StyleSheet,TouchableOpacity, BackHandler } from 'react-native';
import EventCardsMa1 from '../EventCardsMa1'
import Responsive from 'react-native-lightweight-responsive';
import axios from 'axios';
import { withNavigation, StackActions, NavigationActions, NavigationState } from 'react-navigation'
import Toast from 'react-native-tiny-toast'


class MyEventsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.data=''
        this.pressCount=0
        this.state = {
            callCount:0,
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
            userIdGlobal:null,
            backPressed:false

        };
    }


    componentDidMount(){
        this.getItem()
        this.setState({callCount:0})
        const {navigation}=this.props
        this.focusListener = navigation.addListener('didFocus',()=>{
            if(this.state.eventsData.length==0){
                this.getMyEvents()
            }
        })
        this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
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

    async getItem(){

        
            try{
                let user = await AsyncStorage.getItem('userProfileDataPlayer')
                this.data= JSON.parse(user)
                // this.getMyEvents()
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
            if(response.data.length>0){
                this.setState({
                    eventsData:myEvents,
                    dataOneLoaded:true,
                    showMessage:false,
                    dataOneFetching:false
                })
            }
            else{
                if(this.state.callCount==0){
                    this.setState({callCount:1},()=>this.getMyEvents())
                }
                else{
                    this.setState({
                        dataOneLoaded:false,
                        showMessage:true,
                        dataOneFetching:false
                    })
                }
            }
        }).catch((error)=>{
            console.log(error)
        })

    }


       
    render() {
        const {showMessage, showTwoMessage, showThreeMessage} = this.state
        return (
            
                    <View style={{backgroundColor:'white', flex:1, paddingTop:10 }}>
                        

                        {this.state.dataOneLoaded?<FlatList
                                // style={{marginBottom:90}}
                                data ={this.state.eventsData}
                                extraData={this.state}
                                keyExtractor={item => item._id}
                                refreshing={this.state.dataOneFetching}
                                onRefresh={()=>this.getMyEvents()}
                                renderItem={({item})=>(
                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('EventDetailsScreen',{item}) }}>
                                    <EventCardsMa1 data={item}/>
                                </TouchableOpacity>
                                )}
                            />:<View style={{flex: 1,justifyContent: 'center'}}>

                            {showMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>No Events found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
                            
                            
                        
                                </View>}

                    </View>
                    
            

        );
    }
}

export default withNavigation(MyEventsScreen)