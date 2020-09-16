import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import { Icon } from 'native-base'

class PlayerToBeRequestedEventsCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    let date=this.convertDate(this.props.data.tStartDate)
    let enddate=this.convertDate(this.props.data.tEndDate)
    this.setState({startDate:date, endDate:enddate})
  }
  convertDate(date){
    var d= new Date(date)
    var month = '' + (d.getMonth() + 1)
    var day = '' + d.getDate()
    var year = d.getFullYear()
    if (month.length < 2) 
    month = '0' + month;
    if (day.length < 2) 
    day = '0' + day;
    return [day, month, year].join('/');
}
  render() {
    const data = this.props.data
        return (
            <View>
                <View style={styles.cardStyles}>
                <View style={{ flexDirection: 'row' , paddingLeft:10, paddingTop:10}}>
                    <View style={{ }} >
                        <Text style={styles.inHead}>{data.tournamentName}</Text>
                    </View>
                </View>
                <View style={{borderWidth:0.5,borderColor:'#9CE1EF', marginTop:10, marginRight:10, marginLeft:10}}></View>
                <View style={{flexDirection:'row', paddingTop:5, paddingLeft:10}}>
                    <Icon type="Entypo" name="location-pin"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                    <Text style={{fontSize:Responsive.font(11), width:'95%' ,color:'#585858', fontFamily:'Lato-Medium', paddingLeft:5}}>{data.address}</Text>
                </View>                                        
                
                <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10, paddingRight:10, justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row'}}>
                        <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                        <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', paddingLeft:5}}>{this.state.startDate} - {this.state.endDate}</Text>
                    </View>
                
                
                {data.type=='Sanctioned League'?
                    <View style={{flexDirection:'row'}}>
                    <Icon type="FontAwesome" name="star"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#EF8700'}}/>
                    <Text style={{color:'#EF8700',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>  USAPA Sanctioned</Text>
                </View>
                :
                null}

                {data.type=='USAPA Event'?
                    <View style={{flexDirection:'row'}}>
                    <Icon type="FontAwesome" name="star"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#EF8700'}}/>
                    <Text style={{color:'#EF8700',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>  USAPA Event</Text>
                </View>
                :
                null}


                {data.type=='Sanctioned Tournament'?
                    <View style={{flexDirection:'row'}}>
                    <Icon type="FontAwesome" name="star"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#EF8700'}}/>
                    <Text style={{color:'#EF8700',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>  USAPA Sanctioned</Text>
                </View>
                :
                null}
                    
                </View>
                
                <View>

                </View>
            
            </View>
        </View>

    );
  }
}

export default PlayerToBeRequestedEventsCards;
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        marginHorizontal:10,
        width: '92%',
        backgroundColor: '#BDF3FE',
        // height:100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        justifyContent:'center',
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        borderRadius:3,
        elevation: 3,
        marginBottom:10,
        paddingBottom:10
    },
    head: {
        color: 'white',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(12)

    },
    buttonText:{
        color: 'white',
        fontFamily: 'Lato-Medium',
        fontSize: Responsive.font(10),
        alignSelf:'center',
        textAlignVertical:'center',
        textAlign:'center',
        alignItems:'center',
        alignContent:'center'


    },
    inHead: {
        color: '#585858',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(14)

    },
    mySBtn: {
        backgroundColor: 'white',
        padding: 4,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        alignContent: 'flex-end',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },


});