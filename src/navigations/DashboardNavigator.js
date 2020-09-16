import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Responsive from 'react-native-lightweight-responsive';
import CompletedEventsScreen from '../screens/Dashboard/CompletedEvents';
import OnGoingEventsScreen from '../screens/Dashboard/OnGoingEvents';
import UpcomingEventsScreen from '../screens/Dashboard/UpcomingEvents'



const DashboardNavigation = createMaterialTopTabNavigator()
export default function DashboardNavigator() {
  return (
   <DashboardNavigation.Navigator
    tabBarOptions={{
        style:{ backgroundColor: "#686868"  },
        indicatorStyle:{ backgroundColor:'#9EEACE' }
    }}
   >
        <DashboardNavigation.Screen name ='CompletedEvents' component={CompletedEventsScreen} options={{
            tabBarLabel:({focused})=>{
            let label;
            return label = focused?<Text style={{color:'#9EEACE', fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>Completed Events</Text>:<Text style={{color:"white", fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>Completed Events</Text>
        } }}/>

        <DashboardNavigation.Screen name ='OngoingEvents' component={OnGoingEventsScreen} options={{
            tabBarLabel:({focused})=>{
            let label;
            return label = focused?<Text style={{color:'#9EEACE', fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>Ongoing Events</Text>:<Text style={{color:"white", fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>Ongoing Events</Text>
        } }}/>

        <DashboardNavigation.Screen name ='UpcomingEvents' component={UpcomingEventsScreen} options={{
            tabBarLabel:({focused})=>{
            let label;
            return label = focused?<Text style={{color:'#9EEACE', fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>Upcoming Events</Text>:<Text style={{color:"white", fontFamily: 'Lato-Medium', fontSize:Responsive.font(12)}}>Upcoming Events</Text>
        } }}/>


   </DashboardNavigation.Navigator>     
  );
}
