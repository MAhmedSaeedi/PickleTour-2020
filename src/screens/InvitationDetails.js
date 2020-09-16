import React from 'react';
import {  View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import {Icon} from 'native-base'

export default class InvitationDetails extends React.Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Medium',fontSize:Responsive.font(20)  }}>Invitation Details</Text>
    }
    constructor(props) {
        super(props);
        this.DivisionData=''
        this.state = {
            actScr: '1',
            tourData:[],
            dataLoaded:false,
            startDate:null,
            endDate:null,
            params:null,
            selectedValue:'',
            selectionModal:false,
            buttonDisabled:true,
            modalVisible:false,
            isSuccessFull:false,
            address:'',
            phoneNumber:'',
            incomData:false,
            submitted:false,
            arrayLocation:0,
            finallyComplete:false,

        };
    }
  
    componentDidMount(){    
        const tournamentInfo = this.props.navigation.getParam('item')
        let date=this.convertDate(tournamentInfo.tStartDate)
        this.setState({startDate:date})

        let endate=this.convertDate(tournamentInfo.tEndDate)
        this.setState({endDate:endate})
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

   



    async sendingData(obj){
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        }
        try{
            let url ='https://pickletour.appspot.com/api/referee/register'
            const res = await fetch(url, config)
            const data = await res.json()
            if(data.message =='referee Registered'){
                this.setState({finallyComplete:true})

                setTimeout(()=>{
                    this.props.navigation.goBack()
                },3000)
            }
        }catch(error){

        }
    }
    render() {
        const tournamentInfo = this.props.navigation.getParam('item')
        
        return (
            <View style={{flex:1, backgroundColor:'white'}}>
                    <View style={{ padding: 10 }}>
                        <FlatList
                            
                            data ={this.state.tourData}
                            extraData={this.props}
                            keyExtractor={item => item._id}
                            ListHeaderComponent={()=>(
                                <View>
                                        <View style={styles.cardStyles}>
                                        <View style={{ flexDirection: 'row' , paddingLeft:10, paddingTop:10}}>
                                            <View style={{ }} >
                                                <Text style={styles.inHead}>{tournamentInfo.tournamentName}</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={{borderWidth:0.5,borderColor:'#D9D9D9', marginTop:10, marginRight:10, marginLeft:10}}></View>
                                        <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10}}>
                                            <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                            <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', paddingLeft:5}}>{this.state.startDate} - {this.state.endDate}</Text>
                                        </View>

                                        <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10}}>
                                            <Icon type="Entypo" name="location-pin"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                            <Text style={{fontSize:Responsive.font(11), width:'95%' ,color:'#585858', fontFamily:'Lato-Medium', paddingLeft:5}}>{tournamentInfo.address}</Text>
                                        </View>
                                        <View style={{borderWidth:0.5,borderColor:'#D9D9D9', marginTop:10, marginRight:10, marginLeft:10}}></View>
                                        <View style={{ flexDirection: 'row', paddingTop: 10 , paddingLeft:10}}>
                                            <View style={{ flexDirection: 'row', width: '50%' }} >
                                                <Text style={styles.head}>Event Type : </Text>
                                                <Text style={styles.detail}>{tournamentInfo.type}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingLeft:10 }}>
                                            <View style={{ flexDirection: 'row', width: '100%' }} >
                                                <Text style={styles.head}>Organizer : </Text>
                                                <Text style={styles.detail}>{tournamentInfo.OrganizerName}</Text>
                                            </View>
                                        </View>

                                        
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingLeft:10 }}>
                                            <View style={{ flexDirection: 'row', width: '100%' }} >
                                                <Text style={styles.head}>Division : </Text>
                                                <Text style={styles.detail}>{tournamentInfo.divisionName}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop:30, paddingBottom:23 }}>
                                            <View style={{alignItems:'center', justifyContent:'center', }}>
                                                <TouchableOpacity onPress={()=>this.setState({modalVisible:true})}  style={[styles.mySBtn,{backgroundColor:'#48A080'}]}>
                                                    <Text style={styles.myStext}>Accept</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{alignItems:'center', justifyContent:'center', }}>
                                                <TouchableOpacity onPress={()=>this.setState({modalVisible:true})}  style={[styles.mySBtn,{backgroundColor:'#924741'}]}>
                                                    <Text style={styles.myStext}>Decline</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    

                                        <View>

                                        </View>
                                    
                                    </View>
                                </View>
                    
                            )}
                            
                            renderItem={({item})=>(
                                
                                <MatchCards navigation={this.props.navigation} data={item} />
                                
                                
                            
                            )}
                        />
                    </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        width: '100%',
        backgroundColor:'#F1F1F1',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 3,
        marginBottom: 10
    },
    head: {
        color: '#585858',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(12)
    },
    inHead: {
        fontSize:Responsive.font(16), color:'#585858', fontFamily:'Lato-Bold'
    },
    detail:{
        fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', alignSelf:'center'
    },
    mySBtn: {
        
        justifyContent:'center',
        alignSelf:'flex-end',
        paddingVertical:2,
        marginLeft:10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
        alignContent: 'flex-end',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 2,
    },
    myStext:{
        fontSize: Responsive.font(11),
        fontFamily:'Lato-Medium',
        color:'white',
        justifyContent:'center',
        alignSelf:'center'
    }


});