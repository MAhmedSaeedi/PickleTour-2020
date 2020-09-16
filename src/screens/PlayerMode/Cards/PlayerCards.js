import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

class PlayerCards extends Component {
  constructor(props) {
    super(props);
    this.data=''
    this.image=''
    this.state = {
      image:''
    };
  }
  componentDidMount(){
    const item =  this.props.data  
    if(item.image!=undefined && item.image!='')
    {
      this.setState({image:item.image})
    }
  }

  render() {
    const item =  this.props.data
    const type = this.props.type
    return (
      <View style={styles.cardStyles}>
        {/* <View style={{flexDirection:'row', paddingBottom:10,shadowColor: "#000",borderWidth:1,alignSelf:'center',width:'100%'}} > */}
        <Image style={{marginLeft:10, width:40, height:40, borderRadius:100}} source={this.state.image!='' ? {uri:this.state.image}:require('../../../../assets/User_Icon.png')}/>
        <View style={{paddingLeft:20, alignSelf:'center'}}>
          <Text style={{fontSize:Responsive.font(12), fontFamily:'Lato-Medium', color:'#464646'}}>{type == 'League' ? item.tName : item.fName}</Text>
          <Text style={{fontSize:Responsive.font(11), fontFamily:'Lato-Medium', color:'#464646'}}>{item.email}</Text>
        </View>
                  
      </View>
    );
  }
}

export default PlayerCards;

const styles = StyleSheet.create({
  cardStyles: {
      flexDirection:'row',
      alignSelf:'center',
      borderRadius:3,
      
      width: '100%',
      backgroundColor: 'white',
      // height:110,
      paddingTop:5,
      paddingBottom:5,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 3,
      marginBottom:1
  },
}) 