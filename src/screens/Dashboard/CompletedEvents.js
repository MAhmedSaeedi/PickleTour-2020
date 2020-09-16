import React from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, AsyncStorage, FlatList, TouchableOpacity, Alert, Modal, BackHandler } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import EventCards from '../EventCards'
import axios from 'axios'
import { Icon } from 'native-base'
import { withNavigation } from 'react-navigation'
import { NavigationActions, StackActions } from 'react-navigation';
import notifications from '../../helpers/handleNotifications';
import Toast from 'react-native-tiny-toast'


class CompletedEventsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.userData=''
        this.userId=''
        this.pressCount=0
        this.state = {
            actScr: 1,
            seLoc: '',
            compData: [],
            upData:[],
            onData:[],
            callCount:0,
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
            showThreeMessage:false,
            shouldShowModal:false,
            backPressed:false
        };
    }
//     sendPushNotifications = () =>{
//         let response = fetch('https://exp.host/--/api/v2/push/send',{
//             method:'POST',
//             headers:{
//                 Accept:'application/json',
//                 'Content-Type':'application/json'
//             },
//             body:JSON.stringify({
//                 to:'ExponentPushToken[PaqkdbClpiSykGH5CuXDv5]',
//                 sound:'default',
//                 title:'Demo',
//                 body:'Notification'

//             }
// )            
//         })
//     }

    // registerForPushNotificationsAsync = async ()=>{
    //     const { status:existingStatus } = await Permissions.getAsync(
    //     Permissions.NOTIFICATIONS
    //     );
    //     let finalStatus =  existingStatus
    //     if(existingStatus!='granted'){
    //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    //     finalStatus = status
    //     }
    //     if(finalStatus !=='granted'){
    //     return
    //     }
    //     let token = await Notifications.getExpoPushTokenAsync();
    //     this.showingAlert(token)

    // }

   
    async componentDidMount(){
       
        // await this.registerForPushNotificationsAsync()
        //this.getUserId()
        this.getUserData()
        const {navigation}=this.props
        this.focusListener = navigation.addListener('didFocus',()=>{
            if(this.state.compData.length==0){
                this.getCompletedData()
            }
        })
        this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)

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





    // createNotificationLocally(userId){
    //     axios({
    //         method:'post',
    //         url:'https://onesignal.com/api/v1/notifications',
    //         headers: {
    //         'Authorization': 'Basic YzNlN2I3YmEtMDkyMS00YjQ1LWE2NmItZTc2YjRkNWRhZmQy',
    //         'Content-Type':'application/json'
    //         },
    //         data:{
    //         "app_id":"e07379d0-8c63-41cb-b102-0c3086332aec",
    //         "contents":{"en":"Body"},
    //         "headings":{"en":"Title"},
    //         "url":"https://onesignal.com",
    //         "include_player_ids":[`${userId}`]
    //     }

    //     }).then(resp=>{
    //     }).catch(err=>{
    //         console.log(err)
    //     })
    // }

    sendNotification(userId){
        notifications.sendLocalNotifications(userId, 'CompTi','CompMes')
    }

    async getUserId(){
        try{
            let user = await AsyncStorage.getItem('UserID')
            let parsed = JSON.parse(user)
            this.sendNotification(parsed)
            //this.createNotificationLocally(parsed)
        }catch(error){
            console.log(error)
        }
    }
    componentWillUnmount(){
        this.focusListener.remove()
        this.backHandler.remove()
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
                if(this.state.callCount==0){
                    this.setState({callCount:1},()=>this.getCompletedData())
                }
                else{
                    this.setState({
                        dataOneLoaded:false,
                        showMessage:true,
                        dateOneFetching:false
                    })
                }
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
            this.getMode()
        }catch(error){
            console.log(error)
        }
    }

    async getMode (){
        try{
          let mode = await AsyncStorage.getItem("Mode")
          if(mode=='Referee'){
              
          }
          else{
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'FeaturedEvents' })],
           }))
          }
        }catch(error){}
    }
    

    render() {
        const {showMessage, showTwoMessage, showThreeMessage} = this.state
        return (
            <View style={{backgroundColor:'white', flex:1}}>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={this.state.shouldShowModal}
                >
                    <View  style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'white', opacity:0.9 }} >
                        <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'80%', borderWidth:1, borderColor:'#64A8B5'}}>
                            <Icon type="Ionicons" name="ios-information-circle-outline"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#51C560'}}/>
                            <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15)}}>Welcome to Referee Application.</Text>
                            <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15)}}>Swipe to open side menu. </Text>
                            <TouchableOpacity onPress={()=>this.setState({shouldShowModal:false})} style={{alignSelf:'center', backgroundColor:'#E9835D', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>
                        </View> 
                    </View>


                </Modal>
                        <View style={{ paddingTop:10}}>
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
                                    {showMessage?<Text style={{fontFamily:'Lato-Bold',alignSelf:'center', fontSize:Responsive.font(20)}}>Completed Events not found !</Text>: <ActivityIndicator size="large" color="#48A080" />}
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

export default withNavigation(CompletedEventsScreen)