import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import { Icon } from 'native-base'
import TimeZone from 'react-native-timezone';
import moment from 'moment-timezone';


export default class ToBeRequestedEvents extends React.Component {
    constructor(props) {
        super(props);
        this.startDate=''
        this.endDate=''
        this.state = {
            actScr: '1',
            modalVisible:false,
            address:'',
            phoneNumber:'',
            incomData:false,
            submitted:false,
            isSuccessFull:false,
            selected:'',
            finallyComplete:false,
            convertedDate:null,
            newName:'',
            useNewName:false,
            startDate:null,
            endDate:null,
            expandSpace:false
        

        };
    }
   
    getTimeZone = async(date, zone) => {
        const timeZone = await TimeZone.getTimeZone().then(zone => zone);
        var eventZone    = moment.tz(date, zone);
        var localZone = eventZone.clone().tz(timeZone);
        let eventDate = this.convertDate(localZone)
        if(this.startDate == ''){
            this.startDate = eventDate
            this.setState({startDate:eventDate})
        }
        else{
            this.endDate = eventDate
            this.setState({endDate:eventDate})
        }
    }
    componentDidMount(){
        const data = this.props.data
        // console.log('sdasdas')
        // console.log(data.timeZone)
        //let date=this.convertDate(this.props.data.tStartDate)
        //this.convertForTimeZone(this.props.data.tStartDate,  data.timeZone)
        // this.getTimeZone(startDate, data.timeZone)
        ///this.convertForTimeZone(this.props.data.tEndDate,  data.timeZone)
        this.convertForTimeZone([this.props.data.tStartDate, this.props.data.tEndDate], data.timeZone)
        let address = this.props.data.address
        if(address.length>53){
            this.setState({expandSpace:true})
        }
        let name=this.props.data.tournamentName
        let index= ''
        let splitter = 4

        let nameLength=this.convertString(name)
        if(nameLength>40){
            index = name.split(' ').slice(0,splitter).join(' ');
            this.setState({newName:index, useNewName:true})
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

    convertForTimeZone(dateArray, zone){
        dateArray.forEach(date=>{
            var d= new Date(date)
            var month = '' + (d.getMonth() + 1)
            var day = '' + d.getDate()
            var year = d.getFullYear()
            if (month.length < 2) 
            month = '0' + month;
            if (day.length < 2) 
            day = '0' + day;
            let str =  [year, month, day].join('-');
            str = str + ' 00:00'
            this.getTimeZone(str, zone)
        })
    }

    convertString(name){
        name = name.replace(/(^\s*)|(\s*$)/gi,"");
        name = name.replace(/[ ]{2,}/gi," ");
        name = name.replace(/\n /,"\n");
        return name.length;
    }
    
    request(){
        const {selected} = this.state
        if(selected == '' || selected == 'Select'){
            
        }
        else{
            this.setState({modalVisible:true})
        }


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
                    this.setState({modalVisible:false})
                },3000)
            }
        
        }catch(error){

        }
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
                divisionName: selected,
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
    render() {
        const data = this.props.data
        // console.log('sdasdas')
        // console.log(data.timeZone)
        return (
            <View>
                                        <View style={styles.cardStyles}>
                                        <View style={{ flexDirection: 'row' , paddingLeft:10, paddingTop:10}}>
                                            <View style={{ }} >
                                                <Text style={styles.inHead}>{data.tournamentName}</Text>
                                            </View>
                                        </View>

                                        <View style={{flexDirection:'row', paddingTop:5, paddingLeft:10}}>
                                            <Icon type="Entypo" name="location-pin"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
                                            <Text style={{fontSize:Responsive.font(11), width:'95%' ,color:'#585858', fontFamily:'Lato-Medium', paddingLeft:5}}>{data.address}</Text>
                                        </View>                                        
                                        <View style={{borderWidth:0.5,borderColor:'#99E1E1', marginTop:10, marginRight:10, marginLeft:10}}></View>
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

                                        {data.type=='Sanctioned Recreational' || data.type=='USAPA Event'?
                                            <View style={{flexDirection:'row'}}>
                                            <Icon type="FontAwesome" name="star"  style={{ marginLeft:8,fontSize:Responsive.font(14) ,color: '#EF8700'}}/>
                                            <Text style={{color:'#EF8700',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>  USAPA Events</Text>
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
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        marginHorizontal:10,
        width: '92%',
        backgroundColor: '#BBF1F1',
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