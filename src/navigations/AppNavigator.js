import React,{Component} from 'react';
import { Image, TouchableOpacity, Platform, Dimensions, View, Text,AsyncStorage } from 'react-native';
import { createAppContainer, createSwitchNavigator, StackActions } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer'
import { Icon } from 'native-base'
import Login from '../screens/Login'
import SignUp from '../screens/SignUp'
import CustomSidebarMenu from '../navigations/CustomSidebarMenu'
import HomePage from '../screens/HomePage'
import EventDetails from '../screens/EventDetails'
import EventSummary from '../screens/EventSummary'
import ScoreCard from '../screens/ScoreCard'
import LoadingScreen from '../screens/Loading';
import RefereeRequest from '../screens/RefereeRequest';
import InvitationDetails from '../screens/InvitationDetails';
import RefereeRequestDetails from '../screens/RefereeRequestDetails';
import MyEventsScreen from '../screens/ManageEvents/MyEvents';
import RequestedEventsScreen from '../screens/ManageEvents/RequestedEvents';
import Responsive from 'react-native-lightweight-responsive';
import MyInvitationsScreen from '../screens/ManageEvents/MyInvitations';
import CompletedEventsScreen from '../screens/Dashboard/CompletedEvents';
import UpcomingEventsScreen from '../screens/Dashboard/UpcomingEvents';
import OnGoingEventsScreen from '../screens/Dashboard/OnGoingEvents';
import Leagues from '../screens/FeaturedEvents/Leagues';
import Recreationals from '../screens/FeaturedEvents/Recreationals';
import Tournaments from '../screens/FeaturedEvents/Tournaments';
import PlayerEventDetailsScreen from '../screens/PlayerMode/Screens/PlayerEventDetails';
import RegisterNowScreen from '../screens/PlayerMode/Screens/RegisterNow';
import FindLeaguesScreen from '../screens/PlayerMode/Screens/FindEvents/FindLeagues';
import FindRecreationalScreen from '../screens/PlayerMode/Screens/FindEvents/FindRecreational';
import FindTournamentsScreen from '../screens/PlayerMode/Screens/FindEvents/FindTournaments';
import MyLeaguesScreen from '../screens/PlayerMode/Screens/MyEvents/MyLeagues';
import MyRecreationalScreen from '../screens/PlayerMode/Screens/MyEvents/MyRecreational';
import MyTournamentsScreen from '../screens/PlayerMode/Screens/MyEvents/MyTournaments';
import ManageTeamsScreen from '../screens/PlayerMode/Screens/ManageTeams';
import RegisterTeamScreen from '../screens/PlayerMode/Screens/RegisterTeam';
import ConfirmTeamRegisterationScreen from '../screens/PlayerMode/Screens/ConfirmTeamRegisteration';
import RegistrationPaymentScreen from '../screens/PlayerMode/Screens/RegistrationPayment';
import FileViewerScreen from '../screens/PlayerMode/Screens/FileViewer';
import PlayersListScreen from '../screens/PlayerMode/Screens/PlayersList';
import InvitePlayersScreen from '../screens/PlayerMode/Screens/InvitePlayers';
import RoundScheduleScreen from '../screens/PlayerMode/Screens/RoundSchedule';
import InvitePlayersScreenTwo from '../screens/PlayerMode/Screens/InvitePlayersTwo';
import PlayerEventDetailsScreenTwo from '../screens/PlayerMode/Screens/PlayerEventDetailsTwo';
import RegisterAsRefereeScreen from '../screens/RegisterAsReferee';
import FindTournamentsScreenRef from '../screens/RefereeMode/FindTournamentRef';
import FindRecreationalScreenRef from '../screens/RefereeMode/FindRecreationalRef';
import NotificationsScreen from '../screens/NotificationsScreen';
import RefNotificationScreen from '../screens/RefereeMode/RefNotificationScreen';
import ProfileScreen from '../screens/PlayerMode/Screens/Profile';





global.currentScreenIndex = 0;

console.ignoredYellowBox = ['Warning: Each', "Warning: Failed prop type"];
console.disableYellowBox = true;
class NavigationDrawerStructure extends Component {
    toggleDrawer = () => {
      this.props.navigationProps.toggleDrawer();
    }
  
    render() {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{width: 70, alignItems: "flex-end", flexDirection: "row"}}>
            <Image
              source={require('../../assets/navigation.png')}
              style={{ width: 30, height: 30, marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      )
    }
  }

  const headerWithTitlePlayer = navigation => {
    return {
      headerStyle: { backgroundColor: '#64A8B5' },
      headerTintColor: 'white',
      headerTitleAlign:'center',
      headerMode:'float',
      headerRight: (
        <Text></Text>
      ),
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", flex:0.8 },
      headerLeft: (
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:30, height:30, alignContent:'center'}}>
          <Icon type="Ionicons" name="ios-arrow-back"  style={{ marginLeft:10,alignSelf:'center',fontSize:Responsive.font(24) ,color: 'white'}}/>
        </TouchableOpacity>),
      headerTitleContainerStyle:
      {
        justifyContent: "center"
      }
    }
  }

  const headerWithTitlePlayerPayment = navigation => {
    return {
      headerStyle: { backgroundColor: '#64A8B5' },
      headerTintColor: 'white',
      headerTitleAlign:'center',
      headerMode:'float',
      headerRight: (
        <Text></Text>
      ),
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", flex:0.8 },
      headerLeft: (
        <TouchableOpacity onPress={()=>navigation.dispatch(StackActions.popToTop(),global.currentScreenIndex = 0)} style={{width:30, height:30}}>
          <Icon type="Ionicons" name="ios-arrow-back"  style={{ marginLeft:10,alignSelf:'center',fontSize:Responsive.font(24) ,color: 'white'}}/>
        </TouchableOpacity>),
      headerTitleContainerStyle:
      {
        justifyContent: "center"
      }
    }
  }

  const headerWithTitlePlayerList = navigation => {
    return {
      headerStyle: { backgroundColor: '#64A8B5' },
      headerTintColor: 'white',
      headerTitleAlign:'center',
      headerMode:'float',
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", flex:0.8 },
      headerLeft: (
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:30, height:30}}>
          <Icon type="Ionicons" name="ios-arrow-back"  style={{ marginLeft:10,alignSelf:'center',fontSize:Responsive.font(24) ,color: 'white'}}/>
        </TouchableOpacity>),
      headerTitleContainerStyle:
      {
        justifyContent: "center"
      }
    }
  }


  const headerWithTitleRefereeBack = navigation => {
    return {
      headerStyle: { backgroundColor: '#008080' },
      headerTintColor: 'white',
      headerTitleAlign:'center',
      headerMode:'float',
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", flex:0.8 },
      headerLeft: (
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:30, height:30}}>
          <Icon type="Ionicons" name="ios-arrow-back"  style={{ marginLeft:10,alignSelf:'center',fontSize:Responsive.font(24) ,color: 'white'}}/>
        </TouchableOpacity>),
      headerTitleContainerStyle:
      {
        justifyContent: "center"
      }
    }
  }
  const headerWithTitlePlayerProfile = navigation => {
    return {
      //headerStyle: { position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0},
      //title: 'Home',
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    
      headerTintColor: 'transparent',
      headerTitleAlign:'center',
      headerMode:'float',
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", flex:0.8 },
      headerLeft: 
      //(
        // <TouchableOpacity 
        // //onPress={()=>{navigation.goBack(); global.currentScreenIndex = 0;}} 
        // //onPress={()=>{navigation.goBack(null);global.currentScreenIndex = 0}}
        // onPress={()=>navigation.dispatch(StackActions.popToTop(),global.currentScreenIndex = 0)}
        // style={{width:30, height:30}}>
        //   <Icon type="Ionicons" name="ios-arrow-back"  style={{ marginLeft:10,alignSelf:'center',fontSize:Responsive.font(24) ,color: 'white'}}/>
        // </TouchableOpacity>)
        (<NavigationDrawerStructure navigationProps={navigation} />)
        ,
        
      headerTitleContainerStyle:
      {
        justifyContent: "center"
      },
      headerTransparent:'true'
    }
  }
  const headerWithTitlePlayerSideDrawer = navigation => {
    return {
      headerStyle: { backgroundColor: '#64A8B5' },
      headerTintColor: 'white',
      headerTitleAlign:'center',
      headerMode:'float',
      headerRight: (
        <Text></Text>
      ),
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", flex:0.8 },
      headerLeft: (<NavigationDrawerStructure navigationProps={navigation} />),
      headerTitleContainerStyle:
      {
        justifyContent: "center"
      }
    }
  }

  const headerWithTitle = navigation => {
    return {
      headerStyle: { backgroundColor: '#008080' },
      headerTintColor: 'white',
      headerTitleAlign:'center',
      headerMode:'float',
      headerRight: (
        <Text></Text>
      ),
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", flex:0.8 },
      headerLeft: (
        <NavigationDrawerStructure navigationProps={navigation} />),
      headerTitleContainerStyle:
      {
        justifyContent: "center"
      }
    }
  }

  const headerWithTitleManageEvents = navigation => {
    return {
      headerStyle: { backgroundColor: '#008080' },
      headerTintColor: 'white',
      headerTitleAlign:'center',
      headerMode:'float',
      headerRight: (
        <Text style={{}}></Text>
      ),
      // headerTitleStyle: { alignSelf: 'center' , textAlign:"center", flex:0.8 },
      headerLeft: (
        <NavigationDrawerStructure navigationProps={navigation} />),
      headerTitle: (
        <Text style={{ color: 'white',fontFamily:'Lato-Medium', fontSize: Responsive.font(20) }}>Manage Events</Text>),
      headerTitleContainerStyle:
      {
        justifyContent: "center"
      }
    }
  }

  const headerWithTitleDashboard = navigation => {
    return {
      headerStyle: { backgroundColor: '#008080' },
      headerTintColor: 'white',
      headerMode:'float',
      headerTitleAlign:'center',
      headerRight: (
        <View style={{marginRight:0, flex:0}}></View>
      ),
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", },
      headerLeft: (
        <NavigationDrawerStructure navigationProps={navigation} />),
      headerTitle: (
        <Text style={{color: 'white',fontFamily:'Lato-Medium', fontSize: Responsive.font(20) }}>Dashboard</Text>),
      headerTitleContainerStyle:
      {
        justifyContent: "center",
      }
    }
  }

  const headerWithTitleFeaturedEvents = navigation => {
    return {
      headerStyle: { backgroundColor: '#64A8B5' },
      headerTintColor: 'white',
      headerMode:'float',
      headerTitleAlign:'center',
      headerRight: (
        <View style={{marginRight:0, flex:0}}></View>
      ),
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center" },
      headerLeft: (
        <NavigationDrawerStructure navigationProps={navigation} />),
      headerTitle: (
        <Text style={{color: 'white',fontFamily:'Lato-Medium', fontSize: Responsive.font(20) }}>Featured Events</Text>),
      headerTitleContainerStyle:
      {
        justifyContent: "center",
      }
    }
  }

  const headerWithTitlePlayerFindEvents = navigation => {
    return {
      headerStyle: { backgroundColor: '#64A8B5' },
      headerTintColor: 'white',
      headerMode:'float',
      headerTitleAlign:'center',
      headerRight: (
        <View style={{marginRight:0, flex:0}}></View>
      ),
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", },
      headerLeft: (
        <NavigationDrawerStructure navigationProps={navigation} />),
      headerTitle: (
        <Text style={{color: 'white',fontFamily:'Lato-Medium', fontSize: Responsive.font(20) }}>Find Events</Text>),
      headerTitleContainerStyle:
      {
        justifyContent: "center",
      }
    }
  }

  const headerWithTitlePlayerMyEvents = navigation => {
    return {
      headerStyle: { backgroundColor: '#64A8B5' },
      headerTintColor: 'white',
      headerMode:'float',
      headerTitleAlign:'center',
      headerRight: (
        <View style={{marginRight:0, flex:0}}></View>
      ),
      headerTitleStyle: { alignSelf: 'center' , textAlign:"center", },
      headerLeft: (
        <NavigationDrawerStructure navigationProps={navigation} />),
      headerTitle: (
        <Text style={{color: 'white',fontFamily:'Lato-Medium', fontSize: Responsive.font(20) }}>My Events</Text>),
      headerTitleContainerStyle:
      {
        justifyContent: "center",
      }
    }
  }

  const headerWithTitleFindEvents = navigation => {
    return {
      headerStyle: { backgroundColor: '#008080' },
      headerTintColor: 'white',
      headerTitleAlign:'center',
      headerMode:'float',
      headerRight: (
        <Text style={{}}></Text>
      ),
      // headerTitleStyle: { alignSelf: 'center' , textAlign:"center", flex:0.8 },
      headerLeft: (
        <NavigationDrawerStructure navigationProps={navigation} />),
      headerTitle: (
        <Text style={{ color: 'white',fontFamily:'Lato-Medium', fontSize: Responsive.font(20) }}>Find Events</Text>),
      headerTitleContainerStyle:
      {
        justifyContent: "center"
      }
    }
  }

  const FeaturedEventsStack = createMaterialTopTabNavigator(
    {
      TournamentsEvents:{
        screen:Tournaments,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#7DDAED',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(12)}}>Tournaments</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(12)}}>Tournaments</Text>
          }
        }
      },
      LeaguesEvents:{
        screen:Leagues,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#7DDAED',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(12)}}>Leagues</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(12)}}>Leagues</Text>
          }
        }
      },
      RecreationalsEvents:{
        screen:Recreationals,
        navigationOptions:{
            tabBarLabel:({focused})=>{
              let label
              return label = focused ? <Text style={{color:'#7DDAED',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(12)}}>Recreational</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(12)}}>Recreational</Text>
            }
        }
      },
    },{
    
      tabBarOptions: {
        activeTintColor: '#9EEACE',
        inactiveTintColor: '#263238',
        // indicatorStyle:{backgroundColor:'#9EEACE'},
        showIcon: false,
        showLabel: true,
        indicatorStyle: {
          borderBottomColor: "#686868",
          borderBottomWidth: 4
        },
        style: {
          backgroundColor: "#686868"
        },
      },
    }
  );
  const FindEventStack = createMaterialTopTabNavigator(
    {
      FindTournament:{
        screen:FindTournamentsScreenRef,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#BBF1F1',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>Tournaments</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>Tournaments</Text>
          }
        }
      },
      // FindLeagues:{
      //   screen:FindLeaguesScreen,
      //   navigationOptions:{
      //     tabBarLabel:({focused})=>{
      //       let label
      //       return label = focused ? <Text style={{color:'#BBF1F1',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>Leagues</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>Leagues</Text>
      //     }
      //   }
      // },
      FindRecreational:{
        screen:FindRecreationalScreenRef,
        navigationOptions:{
            tabBarLabel:({focused})=>{
              let label
              return label = focused ? <Text style={{color:'#BBF1F1',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>Recreatinals</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>Recreationals</Text>
            }
        }
      },
    },{
    
      tabBarOptions: {
        activeTintColor: '#9EEACE',
        inactiveTintColor: '#263238',
        // indicatorStyle:{backgroundColor:'#9EEACE'},
        showIcon: false,
        showLabel: true,
        indicatorStyle: {
          borderBottomColor: "#686868",
          borderBottomWidth: 4
        },
        style: {
          backgroundColor: "#686868"
        },
      },
    }
  );
  const PlayerFindEventDetails = createMaterialTopTabNavigator(
    {
      TournamentsEvents:{
        screen:FindTournamentsScreen,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#7DDAED',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(12)}}>Tournaments</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(12)}}>Tournaments</Text>
          }
        }
      },
      LeaguesEvents:{
        screen:FindLeaguesScreen,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#7DDAED',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(12)}}>Leagues</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(12)}}>Leagues</Text>
          }
        }
      },
      RecreationalsEvents:{
        screen:FindRecreationalScreen,
        navigationOptions:{
            tabBarLabel:({focused})=>{
              let label
              return label = focused ? <Text style={{color:'#7DDAED',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(12)}}>Recreational</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(12)}}>Recreationals</Text>
            },
            
        }
      },
    },{
    
      tabBarOptions: {
        activeTintColor: '#9EEACE',
        inactiveTintColor: '#263238',
        // indicatorStyle:{backgroundColor:'#9EEACE'},
        showIcon: false,
        showLabel: true,
        indicatorStyle: {
          borderBottomColor: "#686868",
          borderBottomWidth: 4
        },
        style: {
          backgroundColor: "#686868"
        },
      },
    }
  );

  const PlayerMyEventStack = createMaterialTopTabNavigator(
    {
      TournamentsEvents:{
        screen:MyTournamentsScreen,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#7DDAED',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(12)}}>Tournaments</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(12)}}>Tournaments</Text>
          }
        }
      },
      LeaguesEvents:{
        screen:MyLeaguesScreen,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#7DDAED',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(12)}}>Leagues</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(12)}}>Leagues</Text>
          }
        }
      },
      // RecreationalsEvents:{
      //   screen:MyRecreationalScreen,
      //   navigationOptions:{
      //       tabBarLabel:({focused})=>{
      //         let label
      //         return label = focused ? <Text style={{color:'#7DDAED',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(12)}}>Recreational</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(12)}}>Recreational</Text>
      //       }
      //   }
      // },
    },{
    
      tabBarOptions: {
        activeTintColor: '#9EEACE',
        inactiveTintColor: '#263238',
        // indicatorStyle:{backgroundColor:'#9EEACE'},
        showIcon: false,
        showLabel: true,
        indicatorStyle: {
          borderBottomColor: "#686868",
          borderBottomWidth: 4
        },
        style: {
          backgroundColor: "#686868"
        },
      },
    }
  );
  const DashboardStack = createMaterialTopTabNavigator(
    {
      CompletedEvents:{
        screen:CompletedEventsScreen,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#BBF1F1',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>Completed Events</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>Completed Events</Text>
          }
        }
      },
      OnGoingEvents:{
        screen:OnGoingEventsScreen,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#BBF1F1',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>Ongoing Events</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>Ongoing Events</Text>
          }
        }
      },
      UpcomingEvents:{
        screen:UpcomingEventsScreen,
        navigationOptions:{
            tabBarLabel:({focused})=>{
              let label
              return label = focused ? <Text style={{color:'#BBF1F1',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>Upcoming Events</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>Upcoming Events</Text>
            }
        }
      },
    },{
    
      tabBarOptions: {
        activeTintColor: '#9EEACE',
        inactiveTintColor: '#263238',
        // indicatorStyle:{backgroundColor:'#9EEACE'},
        showIcon: false,
        showLabel: true,
        indicatorStyle: {
          borderBottomColor: "#686868",
          borderBottomWidth: 4
        },
        style: {
          backgroundColor: "#686868"
        },
      },
    }
  );
  
  const ManageEventsStack = createMaterialTopTabNavigator(
    {
      MyEvents:{
        screen:MyEventsScreen,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#BBF1F1',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>My Events</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>My Events</Text>
          }
        }
      },
      RequestedEvents:{
        screen:RequestedEventsScreen,
        navigationOptions:{
          tabBarLabel:({focused})=>{
            let label
            return label = focused ? <Text style={{color:'#BBF1F1',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>Requested Events</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>Requested Events</Text>
          }
        }
      },
      // MyInvitations:{
      //   screen:MyInvitationsScreen,
      //   navigationOptions:{
      //     tabBarLabel:({focused})=>{
      //       let label
      //       return label = focused ? <Text style={{color:'#BBF1F1',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>My Invitations</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>My Invitations</Text>
      //     }
      //   }
      // },
    },
    {
      // defaultNavigationOptions: ({ navigation }) => ({
      //   tabBarLabel:({focused})=>{
      //     const { routeName } = navigation.state;
      //     let label;
      //     switch(routeName) {
      //       case 'MyEvents':
      //         return label = focused ? <Text style={{color:'#9EEACE',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>My Events</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>My Events</Text>
      //       case 'RequestedEvents':
      //         return label = focused ? <Text style={{color:'#9EEACE',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>Requested Events</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>Requested Events</Text>
      //       case 'MyInvitations':
      //         return label = focused ? <Text style={{color:'#9EEACE',fontFamily: 'Lato-Medium',textDecorationLine:'underline',fontSize:Responsive.font(11)}}>My Invitations</Text> : <Text style={{color:'white', fontFamily: 'Lato-Medium',fontSize:Responsive.font(11)}}>My Invitations</Text>
      //     }
      //     return label
      //   },
  
      // }),
      tabBarOptions: {
        activeTintColor: '#9EEACE',
        inactiveTintColor: '#263238',
        showIcon: false,
        showLabel: true,
        indicatorStyle: {
          borderBottomColor: "#686868",
          borderBottomWidth: 4
        },
        style: {
          backgroundColor: "#686868"
        },
      },
    }
  );
  
  const DashboardMainStack = createStackNavigator({
    Dashboard:{
      screen:DashboardStack,
      navigationOptions:({ navigation }) =>{
          return headerWithTitleDashboard(navigation)
      }
    },
    EventSummaryScreen:{
      screen:EventSummary,
      navigationOptions:({ navigation }) =>{
          return headerWithTitle(navigation)
      }
    },
    EventDetailsScreen:{
      screen:EventDetails,
      navigationOptions:({ navigation }) =>{
          return headerWithTitle(navigation)
      }
    },
    ScoreCardScreen:{
      screen:ScoreCard,
      navigationOptions: {
          header: null
      }
    },
    FeaturedEvents:{
      screen:FeaturedEventsStack,
      navigationOptions:({ navigation }) =>{
          return headerWithTitleFeaturedEvents(navigation)
      }
    },
  })

  const FindEventsMainStack = createStackNavigator({
    FindEvents:{
      screen:FindEventStack,
      navigationOptions:({ navigation }) =>{
          return headerWithTitleFindEvents(navigation)
      }
    },
    RefereeRequestScreen:{
      screen:RefereeRequest,
      navigationOptions:({ navigation }) =>{
          return headerWithTitleRefereeBack(navigation)
      }
    },
    RegisterAsReferee:{
      screen:RegisterAsRefereeScreen,
      navigationOptions:({navigation}) =>{
        return headerWithTitleRefereeBack(navigation)
      }
    }
  })

  const ManageEventsMainStack = createStackNavigator({
    ManageEvents:{
      screen:ManageEventsStack,
      navigationOptions:({navigation})=>{
        return headerWithTitleManageEvents(navigation)
      }
    },
    EventDetailsScreen:{
      screen:EventDetails,
      navigationOptions:({ navigation }) =>{
          return headerWithTitle(navigation)
      }
    },
    RefereeRequestDetailsScreen:{
      screen:RefereeRequestDetails,
      navigationOptions:({ navigation }) =>{
          return headerWithTitleRefereeBack(navigation)
      }
    },
    ScoreCardScreen:{
      screen:ScoreCard,
      navigationOptions: {
          header: null
      }
    },
  })

  const RefNotificationMainStack = createStackNavigator({
    RefNotificationScreen:{
      screen:RefNotificationScreen,
      navigationOptions:({navigation})=>{
          return headerWithTitle(navigation)
      }
    }
  })

  const PlayerNotificationMainStack = createStackNavigator({
    NotificationsScreen:{
      screen:NotificationsScreen,
      navigationOptions:({navigation})=>{
        return headerWithTitlePlayerSideDrawer(navigation)
      }
    },
  })

  const ProfileMainStack = createStackNavigator({
    Profile:{
      screen:ProfileScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerProfile(navigation)
      }
    },
  })

  const FindEventsPlayerMainStack = createStackNavigator({
    PlayerFindEvents:{
      screen:PlayerFindEventDetails,
      navigationOptions:({navigation}) =>{
        return headerWithTitlePlayerFindEvents(navigation)
      }
    },
    PlayerEventDetails:{
      screen:PlayerEventDetailsScreen,
      navigationOptions:({ navigation }) =>{
          return headerWithTitlePlayer(navigation)
      }
    },
    RegisterNow:{
      screen:RegisterNowScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayer(navigation)
      }
    },
    PaymentScreen:{
      screen:RegistrationPaymentScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    RegisterTeam:{
      screen:RegisterTeamScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayer(navigation)
      }
    },
    ConfirmTRegister:{
      screen:ConfirmTeamRegisterationScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    InvitePlayers:{
      screen:InvitePlayersScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
  })

  const MyEventsPlayerMainStack = createStackNavigator({
    PlayerMyEvents:{
      screen:PlayerMyEventStack,
      navigationOptions:({navigation})=>{
        return headerWithTitlePlayerMyEvents(navigation)
      }
    },
    PlayerEventDetailsTwo:{
      screen:PlayerEventDetailsScreenTwo,
      navigationOptions:({ navigation }) =>{
          return headerWithTitlePlayer(navigation)
      }
    },
    PaymentScreen:{
      screen:RegistrationPaymentScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    ConfirmTRegister:{
      screen:ConfirmTeamRegisterationScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    InvitePlayers:{
      screen:InvitePlayersScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    RoundSchedule:{
      screen:RoundScheduleScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayer(navigation)
      }
    },
  })

  const ManageTeamsMainStack = createStackNavigator({
    ManageTeams:{
      screen:ManageTeamsScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerSideDrawer(navigation)
      }
    },
    PlayerList:{
      screen:PlayersListScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerList(navigation)
      }
    },
    InviteTwo:{
      screen:InvitePlayersScreenTwo,
      navigationOptions:({navigation})=>{
        return headerWithTitlePlayer(navigation)
      }
    },
  })


  const FeaturedEventsMainStack = createStackNavigator({
    FeaturedEvents:{
      screen:FeaturedEventsStack,
      navigationOptions:({ navigation }) =>{
          return headerWithTitleFeaturedEvents(navigation)
      }
    },
    PlayerEventDetails:{
      screen:PlayerEventDetailsScreen,
      navigationOptions:({ navigation }) =>{
          return headerWithTitlePlayer(navigation)
      }
    },
    RegisterNow:{
      screen:RegisterNowScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayer(navigation)
      }
    },
    PaymentScreen:{
      screen:RegistrationPaymentScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    RegisterTeam:{
      screen:RegisterTeamScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayer(navigation)
      }
    },
    ConfirmTRegister:{
      screen:ConfirmTeamRegisterationScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    InvitePlayers:{
      screen:InvitePlayersScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    
  })

  const MainStack = createStackNavigator({
    Dashboard:{
        screen:DashboardStack,
        navigationOptions:({ navigation }) =>{
            return headerWithTitleDashboard(navigation)
        }
      },
    FindEvents:{
        screen:FindEventStack,
        navigationOptions:({ navigation }) =>{
            return headerWithTitleFindEvents(navigation)
        }
    },
    ManageEvents:{
      screen:ManageEventsStack,
      navigationOptions:({navigation})=>{
        return headerWithTitleManageEvents(navigation)
      }
    },
    EventDetailsScreen:{
        screen:EventDetails,
        navigationOptions:({ navigation }) =>{
            return headerWithTitle(navigation)
        }
    },
    RefereeRequestDetailsScreen:{
        screen:RefereeRequestDetails,
        navigationOptions:({ navigation }) =>{
            return headerWithTitleRefereeBack(navigation)
        }
    },
    RefNotificationScreen:{
      screen:RefNotificationScreen,
      navigationOptions:({navigation})=>{
          return headerWithTitle(navigation)
      }
    },
    EventSummaryScreen:{
        screen:EventSummary,
        navigationOptions:({ navigation }) =>{
            return headerWithTitle(navigation)
        }
    },
    RefereeRequestScreen:{
        screen:RefereeRequest,
        navigationOptions:({ navigation }) =>{
            return headerWithTitleRefereeBack(navigation)
        }
    },
    InvitationDetailsScreen:{
        screen:InvitationDetails,
        navigationOptions:({ navigation }) =>{
            return headerWithTitle(navigation)
        }
    },
    ScoreCardScreen:{
        screen:ScoreCard,
        navigationOptions: {
            header: null
        }
    },
    NotificationsScreen:{
      screen:NotificationsScreen,
      navigationOptions:({navigation})=>{
        return headerWithTitlePlayerSideDrawer(navigation)
      }
    },
    FeaturedEvents:{
      screen:FeaturedEventsStack,
      navigationOptions:({ navigation }) =>{
          return headerWithTitleFeaturedEvents(navigation)
      }
    },
    PlayerEventDetails:{
      screen:PlayerEventDetailsScreen,
      navigationOptions:({ navigation }) =>{
          return headerWithTitlePlayer(navigation)
      }
    },
    PlayerEventDetailsTwo:{
      screen:PlayerEventDetailsScreenTwo,
      navigationOptions:({ navigation }) =>{
          return headerWithTitlePlayer(navigation)
      }
    },
    RegisterNow:{
      screen:RegisterNowScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayer(navigation)
      }
    },
    PlayerFindEvents:{
      screen:PlayerFindEventDetails,
      navigationOptions:({navigation}) =>{
        return headerWithTitlePlayerFindEvents(navigation)
      }
    },
    PlayerMyEvents:{
      screen:PlayerMyEventStack,
      navigationOptions:({navigation})=>{
        return headerWithTitlePlayerMyEvents(navigation)
      }
    },
    ManageTeams:{
      screen:ManageTeamsScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerSideDrawer(navigation)
      }
    },
    ConfirmTRegister:{
      screen:ConfirmTeamRegisterationScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    PaymentScreen:{
      screen:RegistrationPaymentScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    RegisterTeam:{
      screen:RegisterTeamScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayer(navigation)
      }
    },
    ViewFile:{
      screen:FileViewerScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayer(navigation)
      }
    },
    PlayerList:{
      screen:PlayersListScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerList(navigation)
      }
    },
    Profile:{
      screen:ProfileScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerProfile(navigation)
      }
    },
    InvitePlayers:{
      screen:InvitePlayersScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayerPayment(navigation)
      }
    },
    RoundSchedule:{
      screen:RoundScheduleScreen,
      navigationOptions:({ navigation }) =>{
        return headerWithTitlePlayer(navigation)
      }
    },
    InviteTwo:{
      screen:InvitePlayersScreenTwo,
      navigationOptions:({navigation})=>{
        return headerWithTitlePlayer(navigation)
      }
    },
    RegisterAsReferee:{
      screen:RegisterAsRefereeScreen,
      navigationOptions:({navigation}) =>{
        return headerWithTitleRefereeBack(navigation)
      }
    }


  })

  const AuthStack = createStackNavigator({
    LoginScreen:{
        screen:Login,
        navigationOptions:{
            header:null
        }
    },
    SignUpScreen:{
        screen:SignUp,
        navigationOptions:{
            header:null
        }
    },
  })

  const SplashStack = createStackNavigator({
    Splash: {
      screen: LoadingScreen,
      navigationOptions: {
        header: null
      }
    }
  })

  const DrawerNavigator= createDrawerNavigator({
      Home:{
          screen:MainStack
      }
      // DashboardDrawer:{
      //   screen: DashboardMainStack
      // },
      // FindDrawer:{
      //   screen: FindEventsMainStack
      // },
      // ManageDrawer:{
      //   screen: ManageEventsMainStack
      // },
      // RefNotificationDrawer:{
      //   screen: RefNotificationMainStack
      // },
      // ProfileDrawer:{
      //   screen: ProfileMainStack
      // },
      // PlayerNotificationDrawer:{
      //   screen: PlayerNotificationMainStack
      // },
      // FindEventsPlayerDrawer:{
      //   screen: FindEventsPlayerMainStack
      // },
      // MyEventsPlayerDrawer:{
      //   screen: MyEventsPlayerMainStack
      // },
      // ManageTeamsDrawer:{
      //   screen: ManageTeamsMainStack
      // },
      // FeaturedEventsDrawer:{
      //   screen: FeaturedEventsMainStack
      // }
  },
  {
    contentComponent: CustomSidebarMenu,
    drawerWidth: Dimensions.get('window').width / 1.4,
    drawerPosition: "left",
    initialRouteName:'Home',
    //edgeWidth: Platform.OS === 'ios' ? undefined :  Dimensions.get("window").width-50,
  })

  let Navigator = createAppContainer(
      createSwitchNavigator(
          {
              Splash: SplashStack,
              Auth:AuthStack,
              Drawer:DrawerNavigator
          },{
              initialRouteName:'Splash'
          }
      )
  )

  const AppContainer = createAppContainer(Navigator)
  export default AppContainer

  