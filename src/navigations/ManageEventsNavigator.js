import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Responsive from 'react-native-lightweight-responsive';
import MyEventsScreen from '../screens/ManageEvents/MyEvents';
import MyInvitationsScreen from '../screens/ManageEvents/MyInvitations';
import RequestedEventsScreen from '../screens/ManageEvents/RequestedEvents';


const ManageEventsNavigation = createMaterialTopTabNavigator()
export default function ManageEventsNavigator() {
  return (
    <ManageEventsNavigation.Navigator
    tabBarOptions={{
        style:{ backgroundColor: "#686868"  },
        indicatorStyle:{ backgroundColor:'#9EEACE' }
    }}
   >
        <ManageEventsNavigation.Screen name ='MyEvents' component={MyEventsScreen} options={{
            tabBarLabel:({focused})=>{
            let label;
            return label = focused?<Text style={{color:'#9EEACE', fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>My Events</Text>:<Text style={{color:"white", fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>Completed Events</Text>
        } }}/>

        <ManageEventsNavigation.Screen name ='MyRequests' component={RequestedEventsScreen} options={{
            tabBarLabel:({focused})=>{
            let label;
            return label = focused?<Text style={{color:'#9EEACE', fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>Requested Events</Text>:<Text style={{color:"white", fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>Requested Events</Text>
        } }}/>

        <ManageEventsNavigation.Screen name ='MyInvitations' component={MyInvitationsScreen} options={{
            tabBarLabel:({focused})=>{
            let label;
            return label = focused?<Text style={{color:'#9EEACE', fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>My Invitaions</Text>:<Text style={{color:"white", fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>My Invitaions</Text>
        } }}/>


   </ManageEventsNavigation.Navigator>     
  );
}
