import React from 'react';
import { ActivityIndicator, View, Text, TextInput, Dimensions, StyleSheet, ScrollView, FlatList, Modal, TouchableOpacity, BackHandler } from 'react-native';
import axios from 'axios'
import Responsive from 'react-native-lightweight-responsive';
import {Icon} from 'native-base'
import { withNavigation, StackActions, NavigationActions, NavigationState } from 'react-navigation'

export default class  RefereeRequest extends React.Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Medium',fontSize:Responsive.font(20)  }}>Request as Referee</Text>
    }
    constructor(props) {
        super(props);
        this.BracketData=''
        this.DivisionData=''
        this.BidAmount=''
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
        console.log(tournamentInfo)
        let date=this.convertDate(tournamentInfo.tStartDate)
        this.setState({startDate:date})

        let endate=this.convertDate(tournamentInfo.tEndDate)
        this.setState({endDate:endate})
        this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
    }

    backAction=()=>{
    this.props.navigation.goBack(null)
    //this.props.navigation.toggleDrawer()
    return true
    }

    componentWillUnmount(){
        this.backHandler.remove()
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

    getData= (tournamentId)=>{
       

        var newData = [];
       
        var gettingUrl = 'https://pickletour.appspot.com/api/get/Schedule/'
        
        axios.get(gettingUrl+tournamentId)
        .then((response)=>{
            newData = response.data
            if (newData.length > 0) {
                this.setState({
                    tourData: newData,
                    dataLoaded:true,
                })
            }
            else {
                this.setState({
                    dataLoaded:false,
                })
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

closeSelectedModal({item, location}){
        this.setState({selectionModal:false, selectedValue:item, buttonDisabled:false, arrayLocation:location})
    }

    conformingRequest(user, tournament){
        const {address, phoneNumber, incomData, submitted, isSuccessFull, selected} = this.state
        if(address.length>0 && phoneNumber.length>0){
            const Obj ={
                address:  address,
                dob: user.dateOfBirth,
                fName: user.firstName,
                email: user.email,
                gender: user.gender,
                phone: phoneNumber,
                bidAmount: this.BidAmount[this.state.arrayLocation],
                divisionName: this.DivisionData[this.state.arrayLocation],
                bracketType:this.BracketData[this.state.arrayLocation],
                tEndDate:tournament.tEndDate,
                organizerName:tournament.OrganizerName,
                tournamentId: tournament._id,
                tournamentName: tournament.tournamentName,
                tournamentStartDate: tournament.tStartDate,
                type:  tournament.type,                
                userId:  user.uid,
                isPaid: false,
                tournamentAddress:tournament.address
            }
            this.setState({submitted:true, isSuccessFull:true})
            this.sendingData(Obj)
        }
        else{
            this.setState({incomData:true})
        }
    }

    navigateToScreen(userData, tournament){
        
        let bracketType = ''
        if(this.BracketData[this.state.arrayLocation]==''){
            bracketType = tournament.leagueType
        }
        else{
            bracketType = this.BracketData[this.state.arrayLocation]
        }
        const tournamentData = {
            bidAmount: this.BidAmount[this.state.arrayLocation],
            divisionName: this.DivisionData[this.state.arrayLocation],
            bracketType:bracketType,
            tEndDate:tournament.tEndDate,
            organizerName:tournament.OrganizerName,
            tournamentId: tournament._id,
            tournamentName: tournament.tournamentName,
            tournamentStartDate: tournament.tStartDate,
            type:  tournament.type,
            isPaid: false,
            tournamentAddress:tournament.address

        }
        
        this.props.navigation.navigate('RegisterAsReferee',{user:userData, tournament:tournamentData})

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
        const { state, navigate } = this.props.navigation;
        
        const user = this.props.navigation.getParam('user')
        const { address, phoneNumber, incomData, submitted, isSuccessFull, selected, finallyComplete } = this.state
        const enabled = address.length>0 && phoneNumber.length>0
        const tournamentInfo = this.props.navigation.getParam('item')
        
        const bracketTypes =  tournamentInfo.division.map(a => {
            if(a.bracketType=='Round Robin')
                return '(R.R.)'
            else if(a.bracketType =='Flex Ladder')
                return '(F.L.)'
            else if(a.bracketType == 'Box League')
                return '(B.L.)'
            else if(a.bracketType == 'Single Elimination')
                return '(S.E.)'
            else if(a.bracketType =='Double Elimination')
                return '(D.E.)'
            else if(a.bracketType =='Knock Out')
                return'(S.E.)'
            else if(a.bracketType =='Groups')
                return 'Groups'
            else if(a.bracketType == '')
                if(tournamentInfo.leagueType=='Double Elimination')
                return '(D.E.)'
                else if(tournamentInfo.leagueType == 'Round Robin')
                return '(R.R.)'
                else if(tournamentInfo.leagueType == 'Knock Out')
                return '(K.O.)'
           }
        )
        
        const division = tournamentInfo.division
        let result = division.map(a => a.nameOfDivision);
        const divisionData=[...result]
        this.DivisionData= divisionData
        let result2= division.map(a=>a.bracketType);
        let bidAmount = division.map(a=>a.bidAmount)
        this.BidAmount = bidAmount
        const bracketData =[...result2]
        this.BracketData =bracketData
        return (
            <View style={{flex:1, backgroundColor:'white'}}>

                <Modal animationType='slide'
                       visible={this.state.modalVisible}>
                           <View style={{width:'100%', height:'100%'}}>
                                {isSuccessFull?
                                    <View style={{flex:1, alignContent:'center', alignItems:'center',justifyContent:'center', backgroundColor:'white' }}> 
                                
                                
                                    {finallyComplete? <Icon type="FontAwesome" name="check"  style={{ color: 'green'}}/>:<ActivityIndicator size={"large"}/>}
                                
                                        
                                        {finallyComplete?
                                        <Text style={{fontSize:Responsive.font(20), fontFamily:'Lato-Medium'}}>Request Submitted Successfully !</Text>
                                        :
                                        <Text style={{fontSize:Responsive.font(20), fontFamily:'Lato-Medium'}}>Submitting Request..</Text>
                                        }
                                        
                                    </View>
                                :
                                
                                <View style={{flex:1, alignContent:'center', alignItems:'center',justifyContent:'center', backgroundColor: '#86d6b9', }}>
                                <Text style={{marginTop:Responsive.height(50), marginBottom:Responsive.height(20),fontFamily:'Lato-Medium',color:'white', textShadowOffset:{width:1, height:1},textShadowColor:'black',textShadowRadius:2,fontSize:Responsive.font(35)}}>Register as Referee</Text>
                                <View style={{width:'95%',alignSelf:'center', justifyContent:'center'}}>
                                <TextInput style={styles.form} editable={false} placeholder="Name" value={user.firstName} placeholderTextColor={'gray'}/>
                                <TextInput style={styles.form} editable={false} placeholder="Email Address" value={user.email} placeholderTextColor={'gray'}/>
                                <TextInput style={styles.form} placeholder="Phone Number"  value={phoneNumber} keyboardType="phone-pad" onChangeText={phoneNumber => this.setState({ phoneNumber })} placeholderTextColor={'gray'}/>
                                <TextInput style={styles.form} placeholder="Address"  value={address}  keyboardType="default" onChangeText={address => this.setState({ address })} placeholderTextColor={'gray'}/>
                                
                                </View>
                                {/* {incomData ? <Text style={{color:'red', fontSize:Responsive.font(16), fontFamily:'Lato-Bold'}}> Please complete form !!</Text>:<Text></Text>} */}
                                <TouchableOpacity disabled={!enabled} onPress={()=>this.conformingRequest(user, tournamentInfo)} style={{
                                                                                                fontFamily: 'Lato-Medium',
                                                                                                alignItems: 'center',
                                                                                                backgroundColor: enabled?'#48D5A0':'#BEBAC5',
                                                                                                paddingTop:5,
                                                                                                paddingBottom:5,
                                                                                                borderRadius: 100,
                                                                                                marginTop: 20,
                                                                                                paddingLeft:50,
                                                                                                paddingRight:50,
                                                                                                shadowColor: "#000",
                                                                                                shadowOffset: {
                                                                                                    width: 0,
                                                                                                    height: 2,
                                                                                                },
                                                                                                shadowOpacity: 0.23,
                                                                                                shadowRadius: 2.62,
                                                                                        
                                                                                                elevation: 4,
                                                                                                }}>
                                    <Text style={{fontSize:Responsive.font(16),fontFamily: 'Lato-Medium',color: 'white',}}>Confirm</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity  disabled={submitted} onPress={()=>this.setState({modalVisible:false})} style={{
                                                                                                            fontFamily: 'Lato-Medium',
                                                                                                            alignItems: 'center',
                                                                                                            backgroundColor: '#48D5A0',
                                                                                                            paddingTop:5,
                                                                                                            paddingBottom:5,
                                                                                                            borderRadius: 100,
                                                                                                            marginTop: 20,
                                                                                                            paddingLeft:60,
                                                                                                            paddingRight:60,
                                                                                                            shadowColor: "#000",
                                                                                                            shadowOffset: {
                                                                                                                width: 0,
                                                                                                                height: 2,
                                                                                                            },
                                                                                                            shadowOpacity: 0.23,
                                                                                                            shadowRadius: 2.62,
                                                                                                    
                                                                                                            elevation: 4,}}>
                                    <Text style={{fontSize:Responsive.font(16),fontFamily: 'Lato-Medium',color: 'white',}}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                }
                                
                           </View>
                        

                </Modal>

                <Modal
                    transparent ={true}

                    animationType='none'
                    visible={this.state.selectionModal}
                   
                >
                   <View style={{   backgroundColor:'white',
                                    opacity:0.9,
                                
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'}}>

                       <View style={{ width:'94.5%', justifyContent: 'center'}}>
                       <ScrollView style={{ backgroundColor:'white',borderColor:'#585858', borderWidth:1, borderRadius:3}} contentContainerStyle={{alignItems:'center', justifyContent: 'center',alignContent:'center'}}>
                           <View style={{justifyContent:'center',borderBottomWidth:1,borderColor:'#585858', paddingVertical:10, backgroundColor:'white', width:'99%'}}>
                           <Text style={{ color:'#276091', alignSelf:'center',fontSize:Responsive.font(16),fontFamily:'Lato-Medium'}}>Select Division</Text>
                           </View>
                            {divisionData.map((item,index)=>{
                                 return(
                                 <TouchableOpacity key={index} onPress={()=>this.closeSelectedModal({ item:item+' '+ bracketTypes[index], location:index })} style={{justifyContent:'center',borderBottomWidth:1,borderColor:'#585858', paddingVertical:10, backgroundColor:'white', width:'99%'}}><Text style={{color:'#585858',alignSelf:'center', fontSize:Responsive.font(14),fontFamily:'Lato-Medium'}}>{item} {bracketTypes[index]}</Text></TouchableOpacity>
                                )
                            })}
                            <TouchableOpacity onPress={()=>this.setState({selectionModal:false})} style={{justifyContent:'center', paddingVertical:10, backgroundColor:'white', width:'99%'}}>
                           <Text style={{color:'#FF0000', alignSelf:'center',fontSize:Responsive.font(16),fontFamily:'Lato-Medium'}}>Close</Text>
                           </TouchableOpacity>
                          




                            

                        </ScrollView>
                       </View>

                   </View>
                </Modal>                   

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
                                            <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{this.state.startDate} - {this.state.endDate}</Text>
                                        </View>

                                        <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10}}>
                                            <Icon type="Entypo" name="location-pin"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                            <Text style={{fontSize:Responsive.font(11), width:'95%' ,color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{tournamentInfo.address}</Text>
                                        </View>
                                        {/* <View style={{borderWidth:0.5,borderColor:'#D9D9D9', marginTop:10, marginRight:10, marginLeft:10}}></View> */}
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

                                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop:30, paddingBottom:23 }}>
                                            <View style={{ flexDirection: 'row', alignItems:'center'  }} >
                                                <Text style={styles.head}>Division : </Text>
                                                <TouchableOpacity onPress={()=>this.setState({selectionModal:true})} style={{flexDirection:'row', backgroundColor:'white',paddingLeft:5,justifyContent:'center', paddingVertical:2, paddingRight:10, borderColor:'#585858', borderWidth:0.5 }}>
                                                    <Text style={{paddingLeft:5, color:'#474747', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>{this.state.selectedValue.length==''?'Select':this.state.selectedValue}</Text>
                                                    <Icon type="Entypo" name="chevron-small-down"  style={{ paddingLeft:10,alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{alignItems:'center', justifyContent:'center', }}>
                                                <TouchableOpacity 
                                                // onPress={()=>this.setState({modalVisible:true})} 
                                                onPress={()=>this.navigateToScreen(user, tournamentInfo)}
                                                
                                                style={[styles.mySBtn,{backgroundColor: this.state.buttonDisabled?'#96D1BB':'#51C560'}]} disabled={this.state.buttonDisabled}>
                                                    <Text style={styles.myStext}>Request</Text>
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
    },
    form:{
        fontSize: Responsive.font(14),
        padding: 8,
        paddingLeft:20,
        width: '95%',
        alignSelf:'center',
        borderWidth: 1,
        borderColor: '#48A080',
        borderRadius:50,
        backgroundColor:'white',
        height: 50,
        fontFamily: 'Lato-Medium',
        color: 'black',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginBottom:10,
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    }


});

