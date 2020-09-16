import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, AsyncStorage, TouchableHighlight} from 'react-native';
import firebase from 'firebase';
import { NavigationActions, StackActions, DrawerActions } from 'react-navigation';
import Responsive from 'react-native-lightweight-responsive';
import  LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'native-base';
import User from '../helpers/Users';
import axios from 'axios'


export default class CustomSidebarMenu extends Component {
  constructor() {
    super();
    this.itemDeleted=false
    this.data=''
    this.state = {
      RefereeMode:true,
      modalVisible: false,
      parsedData:'',
      image:''
    }
    this.playerItems =[
      {
        navOptionIconType: "MaterialIcons", 
        navOptionIconName:"dashboard",
        navOptionName: 'Featured Events',
        screenToNavigate: 'FeaturedEvents',
      },
      {
        navOptionIconType: "MaterialIcons", 
        navOptionIconName:"find-in-page",
        navOptionName: 'Find Events',
        screenToNavigate: 'PlayerFindEvents',
      },
      {
        navOptionIconType: "MaterialIcons", 
        navOptionIconName:"event-available",
        navOptionName: 'My Events',
        screenToNavigate: 'PlayerMyEvents',
      },
      {
        navOptionIconType: "Ionicons", 
        navOptionIconName:"ios-people",
        navOptionName: 'Manage Teams',
        screenToNavigate: 'ManageTeams',
      },
      {
        navOptionIconType: "MaterialIcons", 
        navOptionIconName:"notifications",
        navOptionName: 'Notifications',
        screenToNavigate: 'NotificationsScreen',
      },
      {
        navOptionIconType: "Entypo", 
        navOptionIconName:"user",
        navOptionName: 'Profile',
        screenToNavigate: 'Profile',
      },
    ]
    this.items = [
      {
        navOptionIconType: "MaterialIcons", 
        navOptionIconName:"dashboard",
        navOptionName: 'Dashboard',
        screenToNavigate: 'Dashboard',
       },
      {
        navOptionIconType: "MaterialIcons", 
        navOptionIconName:"find-in-page",
        navOptionName: 'Find Events',
        screenToNavigate: 'FindEvents',
      },
      {
        navOptionIconType: "MaterialIcons", 
        navOptionIconName:"settings",
        navOptionName: 'Manage Events',
        screenToNavigate: 'ManageEvents',
      },
      {
        navOptionIconType: "MaterialIcons", 
        navOptionIconName:"notifications",
        navOptionName: 'Notifications',
        screenToNavigate: 'RefNotificationScreen',
      },
      {
        navOptionIconType: "Entypo", 
        navOptionIconName:"user",
        navOptionName: 'Profile',
        screenToNavigate: 'Profile',
      },
      // {
      //   navOptionThumb: require('../assets/Blog_gray.png'),
      //   navOptionName: 'My Profile',
      //   screenToNavigate: 'BlogPosting',
      // },
    ];
  }
  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }
  closeAndLogout() {
    this.setState({ modalVisible: false })
    this.props.navigation.navigate('Login')
    this.props.navigation.closeDrawer()
  }
  UNSAFE_componentWillMount(){
    this.getUserData()
    this.getMode()
  }

  async getUserData(){
    try{
      let user = await AsyncStorage.getItem('userProfileDataPlayer')
      this.data= JSON.parse(user)
      axios.get(`https://pickletour.appspot.com/api/user/get/${this.data.uid}`)
      .then(resp=>{
        let newUserData = resp.data
        if(newUserData.image !=undefined && newUserData.image != ''){
          this.setState({image:newUserData.image})
        }
      })
      .catch((err)=>{
       // console.log(err)
      })
    }catch(error){
      alert(error)
    }
  }
  async getMode (){
    try{
      let mode = await AsyncStorage.getItem('Mode')
      if(mode=='Referee'){
        this.setState({RefereeMode:true})
      }
      else{
        this.setState({RefereeMode:false})
      }
    }catch(error){}
  }
  async setMode(){
    const {RefereeMode} = this.state
    
    try{
      if(RefereeMode==true)
      {
        await AsyncStorage.setItem("Mode", 'Player')
        global.currentScreenIndex = 0;
        this.setState({RefereeMode:!this.state.RefereeMode})
        
        this.props.navigation.dispatch(StackActions.reset({
             index: 0,
             actions: [NavigationActions.navigate({ routeName: 'FeaturedEvents' })],
        }))
        this.props.navigation.openDrawer()
      }
      else
      {
        await AsyncStorage.setItem("Mode", 'Referee')
        global.currentScreenIndex = 0;
        this.setState({RefereeMode:!this.state.RefereeMode})
        
        this.props.navigation.dispatch(StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
     }))
     this.props.navigation.openDrawer()
      }
    }catch(error){

    }
  }
  componentDidMount(){
    global.currentScreenIndex = 0;
  }

  
  async UserLogout(){
    try{
      this.props.navigation.closeDrawer()
      AsyncStorage.removeItem('userProfileDataPlayer')
      this.props.navigation.navigate('Auth')
    }catch(err){

    }
     
    
  }

  render() {
    const { RefereeMode } = this.state
    let data =null
    if(RefereeMode==true){
      data=this.items
    }
    else{
      data = this.playerItems
    }
    return (
      
      <View style={styles.sideMenuContainer}>
        <LinearGradient 
        colors={RefereeMode?['#AADDDD','#3D9A9A']:['#BDF3FE','#64A8B5']}
        style={{ backgroundColor: '#48A080', width: '100%', margin: 0, paddingTop: 40, paddingBottom:20, paddingLeft:20, paddingRight:20 }}>
        
          <Image
            //source={require('../../assets/User_Icon.png')}
            source={this.state.image!=''?{uri:this.state.image}:require('../../assets/User_Icon.png')}
            style={{ width: 70, height: 70,borderRadius:100,marginTop:20 }}
          />
          <Text style={{fontSize:Responsive.font(23),color:'white',fontFamily: 'Lato-Medium'}}>{this.data.firstName}</Text>
          <Text style={{fontSize:Responsive.font(15),color:'white',fontFamily: 'Lato-Medium'}}>{this.data.email}</Text>

          <TouchableOpacity style={{height:Responsive.height(30), flexDirection:'row', marginTop:20,backgroundColor:'#ECECEC',width:Responsive.width(200), borderRadius:Responsive.width(20), shadowColor: "#000",
                          shadowOffset: {
                              width: 0,
                              height: 2,
                          },
                          shadowOpacity: 0.23,
                          shadowRadius: 2.62,

                          elevation: 4,}} activeOpacity={1} onPress={()=>this.setMode()}>
            <View style={{backgroundColor:this.state.RefereeMode?'#ECECEC':'#32CDEA', width: Responsive.width(95), borderRadius:Responsive.width(20),justifyContent:'center',color: 'black',
                         
                          }}>
              <Text style={{alignSelf:'center', color:this.state.RefereeMode?'#B0B0B0':'white', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>Player Mode</Text>
            </View>
            <View style={{width:Responsive.width(10), backgroundColor:'#ECECEC',shadowColor: "#000"}}>

            </View>
            <View style={{backgroundColor:this.state.RefereeMode?'#48D5A0':'#ECECEC', width:Responsive.width(95), borderRadius:Responsive.width(20), justifyContent:'center',color: 'black'}}>
              <Text style={{alignSelf:'center', fontFamily:'Lato-Medium', fontSize:Responsive.font(11), color:this.state.RefereeMode?'white':'#B0B0B0'}}>Referee Mode</Text>
            </View>
          </TouchableOpacity>
                          
        
        </LinearGradient>
       
        
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#e2e2e2',
          }}
        />
        
        <View style={{ width: '100%' }}>
          
          {data.map((item, key) => (
            <TouchableOpacity onPress={() => {
              global.currentScreenIndex = key;
              this.props.navigation.navigate(item.screenToNavigate,this.data); 
              this.props.navigation.closeDrawer()             
            }}
              key={key}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal:20,
                  paddingTop: 10,
                  paddingBottom: 10,
                  backgroundColor: global.currentScreenIndex === key ?  '#aadae4' : '#ffffff',
                  // backgroundColor: this.props.navigation.state.routes[this.props.navigation.state.index].routeName === item.screenToNavigate? '#aadae4' : '#ffffff',
                }}

              >
                <View style={{width:'15%' }}>
                  <Icon type={item.navOptionIconType} name={item.navOptionIconName}  style={{ alignSelf:'center',fontSize:Responsive.font(25) ,color: '#585858'}}/>
                </View>
                <View style={{width:'85%'}}>
                  <Text
                    style={{
                      fontSize:Responsive.font(15) ,
                      marginLeft:15,
                      color: global.currentScreenIndex === key ?  'white' : 'black',
                      //color: this.props.navigation.state.routes[this.props.navigation.state.index].routeName === item.screenToNavigate? 'white' : 'black',
                      fontFamily: 'Lato-Medium',
                    }}
                  >
                    {item.navOptionName}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
          }
          <TouchableOpacity onPress={() => this.UserLogout()}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                paddingHorizontal:20,
                backgroundColor: '#ffffff',
              }}

            >
              <View style={{width:'15%' }}>
              <Icon type="Octicons" name="sign-out"  style={{ alignSelf:'center',fontSize:Responsive.font(24) ,color: '#585858', marginLeft:5}}/>
              </View>
              <Text 
                style={{
                    fontSize:Responsive.font(15) ,
                    color: 'black',
                    marginLeft:15,
                    fontFamily: 'Lato-Medium',
                }}
              >
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    // alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  innerContainer: {
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff7400',
  },
  contentTitle:{
    fontSize:23
  },
  yesOrNO: {
    marginLeft: 20,
     marginRight: 20,
      marginTop: 30,
      borderRadius:20,
      width:50
  }
});