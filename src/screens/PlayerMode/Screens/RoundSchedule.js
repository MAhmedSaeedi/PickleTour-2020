import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import ScheduleDetailsCard from '../Cards/ScheduleDetailsCard';
import Responsive from 'react-native-lightweight-responsive';


class RoundScheduleScreen extends Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Schedule</Text>
    }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const schedule = this.props.navigation.getParam('data')
    return (
      <View style={{flex:1, backgroundColor:'white', paddingTop:10, paddingLeft:10, paddingRight:10}}>
        <FlatList
          data={schedule}
          keyExtractor={item=>item.serial}
          renderItem={({item})=>(
            <ScheduleDetailsCard data={item}/>
          )}
          ListEmptyComponent={()=>{
            return <Text style={{fontSize:Responsive.font(20), fontFamily:'Lato-bold', color:'#464646',alignSelf:'center', paddingBottom:10, paddingTop:'50%'}}>Schedule not available.</Text>
        }}

        />
      </View>
    );
  }
}

export default RoundScheduleScreen;
