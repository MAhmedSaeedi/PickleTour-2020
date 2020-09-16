import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import {Icon} from 'native-base'

export default class MatchCardsRes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actScr: '1'
        };
    }

    componentDidMount(){
        let date=this.convertDate(this.props.data.matchDate)
        this.setState({convertedDate:date})
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
        const show = this.props.showMulti
        return (
            <View style={styles.cardStyles}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', justifyContent:'center', alignContent:'center' }} >
        <Text style={{paddingHorizontal:5,paddingVertical:2,alignSelf:'center',justifyContent:'center',alignContent:'center',color:'#5D5D5D',fontFamily:'Lato-Bold',fontWeight: 'bold', fontSize:Responsive.font(13)}}>Match No {this.props.location+1}</Text>
                    </View>
                </View>

                <View style={{flexDirection:'row',marginTop:10, justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row', width:'50%'}}>
                        <View style={{flexDirection:'row', }}>
                            <Icon type="MaterialCommunityIcons" name="calendar-today"  style={{ fontSize:Responsive.font(14) ,color: '#585858', alignSelf:'center'}}/>
                            <Text style={{alignSelf:'center',fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Bold', fontWeight:'600', paddingLeft:5}}>{this.state.convertedDate}</Text>
                        </View>

                        <View style={{flexDirection:'row', marginLeft:15}}>
                            <Icon type="Ionicons" name="md-time"  style={{ fontSize:Responsive.font(14) ,color: '#585858', alignSelf:'center'}}/>
                            <Text style={{alignSelf:'center',fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Bold', fontWeight:'600', paddingLeft:5}}>{data.matchTime}</Text>
                        </View>
                    </View>

                    <View style={{justifyContent:'flex-end', width:'50%', flexDirection:'row'}}>
                        <View style={{flexDirection:'row', paddingHorizontal:7, borderRadius:15, backgroundColor:'#C7FFEB'}}>
                            <Text style={{marginRight:5,alignSelf:'center',color:'#585858',fontSize:Responsive.font(12), fontFamily:'Lato-Bold'}}>Court no. {data.court}</Text>
                            
                        </View>
                    </View>

                <View style={{justifyContent:'flex-end', flexDirection:'row'}}>
                   
                     


                        
                    </View>

                </View>


                <View style={{ height: 1,  marginBottom: 5, marginTop: 5 }} />
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '48%', marginRight: '4%' }}>
                        <View style={styles.teamName} >
                            <Text style={styles.head}>Team A - </Text>
                            <Text style={styles.head}>Alpha</Text>
                        </View>
                        <View style={styles.teamNames} >
                            <Text style={styles.head1}>{data.one.fName}</Text>
                         
                        </View>
                       {show &&  <View style={styles.teamNames} >
                            <Text style={styles.head1}>{data.two.fName}</Text>
                          
                        </View>}
                    </View>
                    <View style={{ width: '48%' }}>
                        <View style={styles.teamName} >
                            <Text style={styles.head}>Team B - </Text>
                            <Text style={styles.head}>Beta </Text>
                        </View>
                        <View style={styles.teamNames} >
                            <Text style={styles.head1}>{show? 'Third Player': data.two.fName}</Text>
                            <Icon type="Entypo" name="trophy"  style={{ fontSize:Responsive.font(17) ,color: '#C5CF3A', alignSelf:'center'}}/>
                        </View>

                       {show &&  <View style={styles.teamNames} >
                            <Text style={styles.head1}>Fourth Player</Text>
                        </View>}
                    </View>
                </View>
                <View style={{ height: 1, marginBottom: 10, marginTop: 5 }} />
                <View style={{flexDirection:'row'}}>
                    <View style={{width:'48%', flexDirection:'row', justifyContent:'flex-end'}}>
                        <Text style={{backgroundColor:'white', padding:5, borderWidth:1, borderColor:'#999999',  fontFamily:'Lato-Bold',color:'#585858'}}>13</Text>
                    </View>
                    <View style={{width:'4%'}}>

                    </View>
                    <View style={{width:'48%',flexDirection:'row', justifyContent:'flex-start'}}>
                    
                        <Text style={{backgroundColor:'#DBE187', padding:5, borderWidth:1, borderColor:'#999999', fontFamily:'Lato-Bold',color:'#585858'}}>14</Text>
                        <Text style={{alignSelf:'center', marginLeft:5, fontFamily:'Lato-Bold', color:'#585858'}}>Winner</Text>
                    </View>
                </View>
                    
                   
            </View>
            

        );
    }
}
const styles = StyleSheet.create({
    cardStyles: {
        width: '97%',
        backgroundColor: '#BBF1F1',
        padding: 10,
        shadowColor: "#000",
        borderRadius:15,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        alignSelf:'center',
        marginBottom: 15
    },
    head: {
        color: 'white',
        fontFamily: 'Lato-Bold',
        fontWeight: 'bold',
        fontSize: Responsive.font(12)
    },
    head1: {
        color: '#585858',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(12),
        alignSelf:'center'
    },
    inHead: {
        color: '#DCDCDC',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(12)
    },
    mySBtn: {
        backgroundColor: '#2E8465',
        color: 'white',
        borderWidth: 1,
        borderColor: 'white',
        padding: 4,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20,
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
    mcde: {
        color: 'white',
        backgroundColor: '#5D5D5D',
        padding: 3,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 10,
        fontWeight: 'bold',
        height: 28,
        fontSize: Responsive.font(11)
    },
    teamName: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#65B7B7',
        padding: 5
    },
    teamNames: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#C2FFFF',
        padding: 5,
        color: 'black',
        justifyContent:'space-between'
    },
    myStext: {
        color: 'white',
        fontSize: Responsive.font(12)
    },
    winner: {
        flexDirection: 'row',
    },
    scoreWinner: {
        color: '#7E7E7E',
        fontSize: Responsive.font(22),
        fontFamily: 'Lato-Bold',
        // padding: 5,
        backgroundColor: '#EEE277',
        // minHeight:50,
        // minWidth:50,
        height:Responsive.height(36),
        width:Responsive.width(36),
        justifyContent:'center'
    },
    tagWinner: {
        color: '#EEE277',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(16),
        margin: 10
    },
    scoreLoser:{
        color: '#7E7E7E',
        fontSize: Responsive.font(22),
        backgroundColor:'#ECECEC',
        // padding: 5,
        fontFamily: 'Lato-Bold',
        // minHeight:50,
        // minWidth:50,
        height:Responsive.height(36),
        width:Responsive.width(36),
        justifyContent:'center',


    },
    loser:{
        alignItems:'center',
        alignSelf:'center',
        alignContent:'center',
        justifyContent:'center'
    }


});