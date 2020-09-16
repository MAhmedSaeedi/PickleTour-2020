import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import MatchCardsRes from './MatchCardsRes';
import {Icon} from 'native-base'
import axios from 'axios'
import Responsive from 'react-native-lightweight-responsive';

export default class EventSummary extends React.Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Medium',fontSize:Responsive.font(20)  }}>Event Summary</Text>
    }
    constructor(props) {
        super(props);
        this.data=''
        this.state = {
            actScr: '1',
            tourData:[],
            dataLoaded:false,
            startDate:null,
            loading:true,
            showMessage:false,
            showMulti:null
        };
    }
    
    componentDidMount(){
        const tournamentInfo = this.props.navigation.state.params.data
        let date=this.convertDate(tournamentInfo.tournamentStartDate)
        this.setState({startDate:date})
        this.getData(tournamentInfo)
        this.getItem()
        this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
    }
    
    backAction=()=>{
        this.props.navigation.goBack(null)
        return true    
    }
    
    componentWillUnmount(){
    this.backHandler.remove()  
    }

    async getItem(){
        try{
            let user  =await AsyncStorage.getItem('userProfileDataPlayer')
            this.data= JSON.parse(user)
        }catch (error){
            //console.log(error)
        }
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
    getData= (tournamentInfo)=>{
        let bracketType = tournamentInfo.bracketType
        let tournamentId = tournamentInfo.tournamentId
        let divisionName = tournamentInfo.divisionName
        var newData = [];
        var dummyData=[]
        let url=''        
     
        if(bracketType=='Round Robin' || bracketType=='Single Elimination' || bracketType=='Knock Out')
            url='https://pickletour.com/api/get/schedule'

        else if(bracketType=='Box League')
            url = 'https://pickletour.com/api/get/bschedule'

        else if(bracketType=='Flex Ladder')
            url = 'https://pickletour.com/api/get/fschedule'

        else if(bracketType=='Double Elimination')
            url ='https://pickletour.com/api/get/dschedule'
        
        
        axios.get(url+'/'+tournamentId+'/'+divisionName)
        .then((response)=>{
            newData = response.data[0].schedule
            if (newData.length > 0) {
                newData.forEach(element => {
                    if(bracketType == 'Double Elimination' || bracketType =='Box League'){
                        element.map(item=>{
                            item.map(nItem=>{
                             if(nItem.refereeId == this.data.uid){
                                 dummyData.push(nItem)
                             }  
                            })                      
                         })
                    }
                    else{
                        element.map(item=>{
                            if(item.refereeId == this.data.uid){
                                dummyData.push(item)
                            }                        
                        })
                    }
                });
                this.setState({
                    tourData: dummyData,
                    dataLoaded:true,
                    loading:false
                })
            }
            else {
                this.setState({
                    dataLoaded:false,
                    loading:false,
                    showMessage:true
                    
                })
            }
        }).catch((error)=>{
            //console.log(error)
        })
    }

    
    render() {
        const tournamentInfo = this.props.navigation.state.params.data
        return(
            <View style={{ alignSelf:'center', paddingLeft:10, paddingRight:10, backgroundColor:'white'}}>
                <FlatList                            
                data ={this.state.tourData}
                extraData={this.props}
                keyExtractor={item => item._id}
                ListHeaderComponent={()=>{
                    return(
                        <View style={{backgroundColor:'white'}}>
                            <TouchableOpacity onPress={()=>this.setState({showDescription:!this.state.showDescription})} activeOpacity={1} style={{flexDirection:'row',paddingLeft:5, paddingRight:5,marginLeft:3, marginRight:3,paddingTop:8,paddingBottom:8,marginTop:10,
                                                        alignItems:'center',backgroundColor:'#5AACAC', borderRadius:5, justifyContent:'space-between', 
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        
                                                        shadowOpacity: 0.23,
                                                        shadowRadius: 2.62,
                                                        elevation: 3,
                                                        }}>
                            <View style={{flexDirection:'row'}}>
                                {this.state.showDescription?<Icon style={{ fontSize: 18, color:'white', paddingLeft:2, alignSelf:'center' }} name="caret-down" type="FontAwesome"/>:<Icon style={{ fontSize: 18, color:'white', paddingLeft:5, alignSelf:'center' }} name="caret-right" type="FontAwesome"/>}
                                <Text style={{ paddingLeft:5, width:'98%', fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>{tournamentInfo.tournamentName}</Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.showDescription?<View style={{backgroundColor:'#F1F1F1',marginLeft:5, marginRight:5, borderBottomRightRadius:5,borderBottomLeftRadius:5,shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        
                                                        shadowOpacity: 0.23,
                                                        shadowRadius: 2.62,
                                                        elevation: 3,}}>
                                         <View style={{flexDirection:'row', paddingTop:20, paddingLeft:20}}>
                                             <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                             <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{this.state.startDate} - {this.state.endDate}</Text>
                                         </View>

                                         <View style={{flexDirection:'row', paddingTop:20, paddingLeft:20}}>
                                             <Icon type="Entypo" name="location-pin"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                             <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{tournamentInfo.tournamentAddress}</Text>
                                         </View>

                                        
                                         <View style={{borderWidth:0.5,borderColor:'#DDDDDD', marginTop:10, marginRight:10, marginLeft:10}}></View>

                                         <View style={{ flexDirection: 'row', paddingTop: 10 , paddingLeft:20, paddingRight:20}}>
                                             <View style={{ flexDirection: 'row', width: '50%' }} >
                                                 <Text style={styles.head}>Event Type : </Text>
                                                 <Text style={styles.detail}>{tournamentInfo.type}</Text>
                                             </View>
                                         </View>

                                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingLeft:20, paddingRight:20 }}>
                                             <View style={{ flexDirection: 'row', width: '100%' }} >
                                                <Text style={styles.head}>Organizer : </Text>
                                                 <Text style={styles.detail}>{tournamentInfo.organizerName}</Text>
                                             </View>
                                         </View>

                                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingTop:10, paddingBottom:10, paddingRight:10 }}>
                                             <View style={{ flexDirection: 'row', width: '100%' }} >
                                                 <Text style={styles.head}>Division : </Text>
                                                 <Text style={styles.detail}>{tournamentInfo.divisionName}</Text>
                                             </View>
                                           </View>
        
                        </View>:null}

                        <View style={{borderWidth:0.5,borderColor:'#E2E2E2', marginTop:10, marginRight:10, marginLeft:10, marginBottom:10}}></View>
                        </View>
                    )
                }}
                stickyHeaderIndices={[0]}
                ListEmptyComponent={()=>
                    {
                        if(this.state.loading){
                            return <View style={{width:100000, alignSelf:'center', paddingTop:'50%'}}>
                                <ActivityIndicator size='large'/>
                            </View>
                        }
                        else if(this.state.showMessage){
                            return <View style={{width:1000000, alignSelf:'center', paddingTop:'50%'}}>
                                <Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Schedule not found !</Text>
                            </View>
                        }
                    }
                }

                showsVerticalScrollIndicator={false}
                renderItem={({item, index})=>
                {
                    if(item.refereeId==this.data.uid){
                        return <MatchCardsRes navigation={this.props.navigation} data={item} location={index} showMulti={this.state.showMulti}/>
                    }
                }
                
                }
            />
            </View>

        );
    }
}
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        width: '100%',
        borderRadius:3,
        backgroundColor:'#DBFFF1',
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
        fontWeight: 'bold',
        fontSize: Responsive.font(12)
    },
    inHead: {
        fontSize:Responsive.font(16), color:'#585858', fontFamily:'Lato-Bold',fontWeight:'bold'
    },
    detail:{
        fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Bold'
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