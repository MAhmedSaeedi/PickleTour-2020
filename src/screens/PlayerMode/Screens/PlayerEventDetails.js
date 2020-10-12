import React, { Component } from 'react';
import { Alert, ActivityIndicator, View, Text, StyleSheet, FlatList, AsyncStorage, Dimensions,Image, TouchableOpacity, ScrollView, PermissionsAndroid, Modal, Linking, BackHandler, Platform } from 'react-native';
import { Container, Header, Content, Icon, Accordion,  } from "native-base";
import Responsive from 'react-native-lightweight-responsive';
import axios from 'axios';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import PlayerCards from '../Cards/PlayerCards';
import ScheduleCard from '../Cards/ScheduleCard';
import MapView,{ Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import Toast from 'react-native-tiny-toast'
import Geocoder from 'react-native-geocoding';
Geocoder.init("AIzaSyCYwrgArmp1NxJsU8LsgVKu5De5uCx57dI");
import firebase from 'firebase'



class PlayerEventDetailsScreen extends Component {

    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Event Details</Text>
    }
  constructor(props) {
    super(props);
    this.tourInfo=''
    this.grantStatus=null
    this.DivisionData=''
    this.lat=37.78825
    this.lon=-122.4324
    this.firstHalf=[]
    this.secondHalf=[]
    this.totalBrackets=[]
    this.totalDiv=[]
    this.waitingSlots=[]
    this.availableSlots=[]
    this.entryFee=[]
    this.data=''
    this.minAge=''
    this.scheduleData=[]
    this.state = {
        showMap:false,
        showMessage:false,
        showDownload:false,
        scheduleData:[],
        showSchedule:false,
        showDescription:false,
        showPlayers:false,
        newName:'',
        useNewName:false,
        value:0,
        buttonColor:'pink',
        selected:false,
        startDate:null,
        endDate:null,
        dataOne:null,
        totalDiv:null,
        totalBrackets:null,
        playersData:[],
        verificationModal:false,
        initializeVerification:false,
        alreadyRegistered:false,
        alreadyPaid:false,
        slotsFull:false,
        todayDate:null,
        canRegister:true,
        allowRegister:false,
        ageOfUser:null,
        showMinAge:false,
        template:'',
        scheduleNotAvailable:false,
        BracketURL:'',
        genderMismatch:false,
        image:''
    };
  }

  insertData(){
      
      let data =''
      // style="text-align:center"
      this.scheduleData.forEach(a=>{
          data = data.concat(  `<tr>
            <td style="text-align:left">${a.serial}</td>
            <td style="text-align:left">${a.players}</td>
            <td style="text-align:left">${a.opponent}</td>
            <td style="text-align:left">${a.time}</td>
            <td style="text-align:left">${a.date}</td>
            <td style="text-align:left">${a.court}</td>
        </tr>`)
      })
      this.tableData=data

  }

  async createPdf(){
      
      let name = this.tourInfo.tournamentName.replace("/"," ")
      if(this.grantStatus=='granted' && this.state.scheduleNotAvailable==false){
        // let options ={
        //     html:`<!DOCTYPE html>
        //     <html>
            
        //     <head>
        //         <meta charset="utf-8">
        //         <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
        //         <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
        //         <link rel="stylesheet" href="assets/css/styles.css">
        //     </head>
            
        //     <body>
        //         <h3>${this.tourInfo.tournamentName}</h3>
        //         <h3>${this.totalDiv[this.state.value]}</h3>
        //         <div class="table-responsive">
        //             <table class="table" style="margin-left:auto;margin-right:auto;"  width="100%">
        //                 <thead style="font-weight: bold; border-bottom-width: 2px;
        //                 border-bottom-style: solid;
        //                 border-bottom-color: rgb(222, 226, 230);">
        //                     <tr>
        //                         <th style="text-align:left">Match No.</th>
        //                         <th style="text-align:left">Player/s</th>
        //                         <th style="text-align:left">Opponent/s</th>
        //                         <th style="text-align:left">Start Time</th>
        //                         <th style="text-align:left">Start Date</th>
        //                         <th style="text-align:left">Court No.</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                    ${this.tableData}
        //                 </tbody>
        //             </table>
        //         </div>
        //     </body>
            
        //     </html>`,
        //     fileName:`${name}_${this.totalDiv[this.state.value]}`,
        //     directory: 'Documents',
        //   }
        // let file = await RNHTMLtoPDF.convert(options)
        // this.showingAlert(file.filePath)
      }
      else{
          if(this.state.scheduleNotAvailable==true){
            alert('Schedule not available.')
          }
          else{
            alert('Permission not granted')
          }
      }
  }

  showingAlert(filePath){
    Alert.alert(
      'File saved successfully',
      filePath,
      [
        {},
        {text:'OK'},
        //  {text: 'View', onPress: () => this.props.navigation.navigate('ViewFile',{path:filePath})},
      ],
      {cancelable: false},
    );
  }

  async checkPermission(){
      try{
        const res = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )
        if(res!=true){
            this.askPermission()
        }
        else{
            this.grantStatus = PermissionsAndroid.RESULTS.GRANTED
        }
      }catch(err){
        console.log(err)
      }
  }

  async askPermission(){
      try{
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
           {
              title:'Allow PickleTour access',
              message:'PickleTour needs access to storage to download pdf',
              buttonPositive:'Ok',
              buttonNegative:'Cancel',
              buttonNeutral:'Later'
          }
        )
        if(granted ===PermissionsAndroid.RESULTS.GRANTED){
            this.grantStatus=PermissionsAndroid.RESULTS.GRANTED
        }
        else{
            this.grantStatus='Not'
        }
      }catch(err){

      }
  }



  async getPicture(id){
    // const ref = firebase.storage().ref("/tournament_pic/"+id+".jpg")
    // ref.getDownloadURL().then(url=>{
    //   this.setState({image:url})
    // })
    // .catch(err=>{
    //   console.log(err)
    // })
  }

 

  componentDidMount(){  

    if(Platform.OS=='android'){
        this.checkPermission()  
    }
    this.getUserData()
    const tournamentInfo = this.props.navigation.getParam('item')
    this.getPicture(tournamentInfo._id)
    this.tourInfo=tournamentInfo
    Geocoder.from(tournamentInfo.address)
    .then(json => {
        var location = json.results[0].geometry.location;
        this.lat = location.lat
        this.lon = location.lng
    })
    .catch(error => console.warn(error));
    this.scheduleData=[]
    let date=this.convertDate(tournamentInfo.tStartDate)
    this.setState({startDate:date, allowRegister:false})

    this.setData(tournamentInfo)
    let endate=this.convertDate(tournamentInfo.tEndDate)
    this.setState({endDate:endate})

    let rStartDate = this.convertDate(tournamentInfo.regStartDate)
    this.setState({regStartDate:rStartDate})
    
    let rEndDate = this.convertDate(tournamentInfo.regEndDate)
    this.setState({regEndDate:rEndDate})

    let name=tournamentInfo.tournamentName
        let index= ''
        let splitter = 3

        let nameLength=this.convertString(name)
        if(nameLength>40){
            index = name.split(' ').slice(0,splitter).join(' ');
            this.setState({newName:index, useNewName:true})
    }

    this.getSchedule(tournamentInfo._id, tournamentInfo.type, tournamentInfo.leagueType)

    this.getPlayersName(tournamentInfo._id, tournamentInfo.type)
    this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)

       
  }

  backAction=()=>{
    this.props.navigation.goBack(null)
    return true    
  }

  componentWillUnmount(){
    this.backHandler.remove()  
  }

  async getUserData(){
    try{
      let user = await AsyncStorage.getItem('userProfileDataPlayer')
      this.data= JSON.parse(user)
      this.earlyCorrectAge()    
    }catch(error){
      alert(error)
    }
  }

  earlyCorrectAge() { 
    let date =''
    if(this.data.dateOfBirth.includes(' ')){
        
        var date1 = this.data.dateOfBirth.split(' ')
        var y1 = date1[0]
        var m1 = date1[1]
        var d1 = date1[2]
        
        if (m1.length < 2) 
        m1 = '0' + m1;

        if(d1.length<2)
        d1 = '0' + d1
        date =[y1,m1,d1].join('-')
        this.earlyCalculateAge(date)
    }
    else if (this.data.dateOfBirth.includes('-')){
            var date2 = this.data.dateOfBirth.split('-')
            if(date2[0].length==4){
                var y2 = date2[0]
                var m2 = date2[1]
                var d2 = date2[2]
            }
            else{
                var y2 = date2[2]
                var m2 = date2[1]
                var d2 = date2[0]
            }
            if(m2.length<2)
            m2 = '0'+m2
            if(d2.length<2)
            d2 = '0'+d2
            
            date = [y2, m2, d2].join('-')
            this.earlyCalculateAge(date)    
    }
  }

  earlyCalculateAge(date){
    var ageDifMs = Date.now() - new Date(date).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    var res =  Math.abs(ageDate.getUTCFullYear() - 1970)
    this.setState({ageOfUser:res})
  }


  checkAge(ageOfUser){
      const { value } = this.state
      if(ageOfUser>= this.minAge[value]){
        this.setState({allowRegister:true, ageOfUser},()=>this.registerPlayer())
      }
      else{
        this.setState({allowRegister:false, showMinAge:true, initializeVerification:false})
      }
  }
  registerPlayer(){
    const { allowRegister, value } = this.state
    const tournamentInfo = this.props.navigation.getParam('item')
    let url ='https://pickletour.appspot.com/api/duo/player/get/checkReg/'
    if(allowRegister){
        axios.get(`https://pickletour.appspot.com/api/duo/player/get/${this.data.uid}`)
        .then((response)=>{
            if(response.data.length>0){
                var data = response.data
                let found = false
                let paid = false
                let info=''
                data.forEach(e=>{
                    if(e.divisionName == this.totalDiv[value] && tournamentInfo._id == e.tournamentId && e.bracketType ==this.totalBrackets[value]){
                        found =true
                        info = e
                        if(e.isPaid == true){
                            paid = true
                        }
                    }
                })
                if(found==true){
                    if(paid ==true){
                        this.setState({initializeVerification:false, alreadyPaid:false,  showMinAge:false, alreadyRegistered:true,})
                    }
                    else{
                        this.setState({initializeVerification:false, alreadyRegistered:false, alreadyPaid:true, showMinAge:false, registrationData:info })
                    }
                }
                else{
                    this.setState({verificationModal:false, initializeVerification:false},()=>this.createTournamentObject())
                }
            }
            else{
                this.setState({verificationModal:false, initializeVerification:false},()=>this.createTournamentObject())
            }
        })         
    }
    else{
        this.setState({initializeVerification:false,alreadyRegistered:false})

    }
   
  }

  calculateAge(date){
    var ageDifMs = Date.now() - new Date(date).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    var res =  Math.abs(ageDate.getUTCFullYear() - 1970)
    this.checkAge(res)
  }

  correctAge() { 
    let date =''
    if(this.data.dateOfBirth.includes(' ')){
        
        var date1 = this.data.dateOfBirth.split(' ')
        var y1 = date1[0]
        var m1 = date1[1]
        var d1 = date1[2]
        
        if (m1.length < 2) 
        m1 = '0' + m1;

        if(d1.length<2)
        d1 = '0' + d1
        date =[y1,m1,d1].join('-')
        this.calculateAge(date)
    }
    else if (this.data.dateOfBirth.includes('-')){
            var date2 = this.data.dateOfBirth.split('-')
            if(date2[0].length==4){
                var y2 = date2[0]
                var m2 = date2[1]
                var d2 = date2[2]
            }
            else{
                var y2 = date2[2]
                var m2 = date2[1]
                var d2 = date2[0]
            }
            if(m2.length<2)
            m2 = '0'+m2
            if(d2.length<2)
            d2 = '0'+d2
            
            date = [y2, m2, d2].join('-')
            this.calculateAge(date)    
    }
  }

  checkGender(){
    const userGender = this.data.gender
    const {value} = this.state
    if(userGender=='Male'){
        if(this.totalDiv[value]=='Men\'s Singles' || this.totalDiv[value]=='Men\'s Doubles' || this.totalDiv[value]=='Mixed\'s Doubles'){
            this.correctAge()
        }
        else{
            this.setState({initializeVerification:false,slotsFull:false, genderMismatch:true})
        }
    }
    else{
        if(this.totalDiv[value]=='Men\'s Singles' || this.totalDiv[value]=='Men\'s Doubles'){
            this.setState({initializeVerification:false,slotsFull:false, genderMismatch:true})
        }
        else{
            this.correctAge()
        }
    }
  }

  setData(tournamentInfo){
    const division = tournamentInfo.division
    let firstHalf=[]
    let secondHalf=[]
    let i =0
    const divisionsName = division.map(a=>{
    if(i<3){
        firstHalf.push({"key":i, "name":a.nameOfDivision})
        i=i+1
    }
    else{
        secondHalf.push({"key":i, "name":a.nameOfDivision})
        i=i+1
    }
    
    })
    let nameOfAllDivisions = []
    let k = 0
    const nOfAllDiv = tournamentInfo.division.map(a=>{
    nameOfAllDivisions[k] = a.nameOfDivision
    k= k+1
    })

    let nameOfAllBrackets =[]
    let n = 0
    const nOfAllBrac = tournamentInfo.division.map(a=>{
        nameOfAllBrackets[n] = a.bracketType
        n=n+1
    })

    let numOfAvailableSlots = []
    const { value } = this.state;

    let numOfWaitingSlots = []
    
    let m = 0
    const availableSlots = tournamentInfo.division.map(a=>{
        numOfAvailableSlots[m] = a.slotsAvailable
        m=m+1
    })

    let l=0

    const waitingSlots = tournamentInfo.division.map(a=>{
      numOfWaitingSlots [l]= a.waitingSlots
      l=l+1
    })
    
    let entryFee = []
    let j = 0
    const availableEntryFee = tournamentInfo.division.map(a=>{
        entryFee[j] = a.entryFee
        j=j+1
    })
    let allAge=[]
    let o=0
    const allAges = tournamentInfo.division.map(a=>{
        allAge [o] = a.minAge
        o=o+1
    })

    this.minAge = allAge
    this.totalBrackets = nameOfAllBrackets
    this.totalDiv = nameOfAllDivisions
    this.waitingSlots = numOfWaitingSlots
    this.availableSlots = numOfAvailableSlots
    this.entryFee = entryFee
    this.firstHalf = firstHalf
    this.secondHalf = secondHalf
    


  }

  getPlayersName(id, type){
      let url = ''
      const {value} = this.state
      let completeURL=''
      let divisionName = this.totalDiv[value]

      if(type =='League'){
          url = 'https://pickletour.com/api/teams/paid/get/'
          completeURL = url+id+'/'+divisionName
      }
      else{
          url = 'https://pickletour.com/api/player/get/'
          completeURL = url+id
      }
      let newData=[]
      axios.get(completeURL)
      .then((response)=>{
          if (response.data.length > 0 ) {
              newData = response.data
              this.setState({
                  playersData: newData,
              })
          }
          else {
              this.setState({
                  showMessage:true
              })
          }
      }).catch((error)=>{
          console.log(error)
      })
  }

  getSchedule(tournamentId, type, league){
    const {value} = this.state
    let bracketType=''

    
    if(type =='Tournament' || type=='Sanctioned Tournament'){
        bracketType = this.totalBrackets[value]
    }
    else{
        bracketType = league
    }
    let id = tournamentId
    let divisionName = this.totalDiv[value]
    var newData = []
    var url = ''
    
    if(bracketType=='Round Robin' || bracketType=='Single Elimination' || bracketType == 'Knock Out')
        url='https://pickletour.com/api/get/schedule'

    else if(bracketType=='Box League')
        url = 'https://pickletour.com/api/get/bschedule'

    else if(bracketType=='Flex Ladder')
        url = 'https://pickletour.com/api/get/fschedule'

    else if(bracketType=='Double Elimination')
        url ='https://pickletour.com/api/get/dschedule'
    
    axios.get(url+'/'+id+'/'+divisionName)
    .then((response)=>{
        if (response.data.length > 0 ) {
            newData = response.data[0].schedule
            if(newData.length>0){
                this.createBracketViewLink(divisionName, type, bracketType, response.data[0]._id)
                this.setState({
                    scheduleData: newData,scheduleNotAvailable:false
                },()=>this.flatSchedule(newData, bracketType, type))
            }
            else{
                
                this.setState({scheduleNotAvailable:true})
            }
          
        }
        else {
            this.setState({
                showMessage:true, scheduleNotAvailable:true
            })
        }
    }).catch((error)=>{
        console.log(error)
    })
  }

  createBracketViewLink(divName, type, bracketType, id){
    let url = `https://www.pickletour.com/BracketsEnds/${divName}/${type}/${bracketType}/${id}`
    
    this.setState({BracketURL:url})
  }

  flatSchedule(data,bracketType,type){
      
      let n=1
      if(bracketType == 'Double Elimination' &&type!='Recreational' || bracketType =='Box League' && type !='Recreational'){
        data.forEach(g=>{
           g.map(e=>{
            e.map(f=>{
                
                if(f.match!=undefined){
                    let date = this.convertDate(f.matchDate)
                    this.scheduleData.push({"serial":n, "players":f.match.one.fName?f.match.one.fName:f.match.one.team.tName, "opponent":f.match.two.fName?f.match.two.fName:f.match.two.team.tName, "time":f.matchTime, "date":date, "court":f.court})
                    n=n+1
                }
                else{
                    let date = this.convertDate(f.matchDate)
                    this.scheduleData.push({"serial":n, "players":f.one.fName?f.one.fName:f.one.tName, "opponent":f.two.fName?f.two.fName:f.two.tName, "time":f.matchTime, "date":date, "court":f.court})
                    n=n+1
                }
            })
           })
        })
        this.insertData()
      }
    else if(type=='Recreational' && bracketType=='Knock Out'){
        data.forEach(g=>{
            g.map(f=>{
                let date = this.convertDate(f.matchDate)
                this.scheduleData.push({"serial":n, "players":f.one.player1==undefined?f.one.fName:`${f.one.player1.fName} and ${f.one.player2.fName}`, "opponent": f.two.player1==undefined?f.two.fName:`${f.two.player1.fName} and ${f.two.player2.fName}`, "time":f.matchTime, "date":date, "court":f.court})
                n=n+1
                
            })
        })
        this.insertData()
    }
    else if(type=='Recreational' && bracketType=='Double Elimination'){
        console.log('double')
        data.forEach(e=>{
          e.map(g=>{
            g.map(f=>{
                let date = this.convertDate(f.matchDate)
                this.scheduleData.push({"serial":n, "players":f.one.player1==undefined?f.one.fName:`${f.one.player1.fName} and ${f.one.player2.fName}`, "opponent": f.two.player1==undefined?f.two.fName:`${f.two.player1.fName} and ${f.two.player2.fName}`, "time":f.matchTime, "date":date, "court":f.court})
                n=n+1
                
            })
          })
        })
        this.insertData()
    }
    else{
        data.forEach(e=>{
            e.map(f=>{
                let date = this.convertDate(f.matchDate)
                this.scheduleData.push({"serial":n, "players":f.one.fName?f.one.fName:f.one.tName, "opponent":f.two.fName?f.two.fName:f.two.tName, "time":f.matchTime, "date":date, "court":f.court})
                n=n+1
            })
        })
        this.insertData()
    }
      
      
  }
  convertString(name){
    name = name.replace(/(^\s*)|(\s*$)/gi,"");
    name = name.replace(/[ ]{2,}/gi," ");
    name = name.replace(/\n /,"\n");
    return name.length;
  }
  divideArray(){

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

  navigateToScreen(tournamentData, tourData){
      const eventType = this.props.navigation.getParam('type')
      if(eventType=='League'){
          this.props.navigation.navigate('RegisterTeam',{tournamentData, User:this.data, tourData})
      }
      else{
          
          this.props.navigation.navigate('RegisterNow',{tournamentData, User:this.data, tourData})
      }
  }

  createTournamentObject(){
    const tournamentInfo = this.props.navigation.getParam('item')
    
    const {value} = this.state
    const Obj ={
        divisionName: this.totalDiv[value],
        tournamentId:tournamentInfo._id,
        tournamentName: tournamentInfo.tournamentName,
        tEndDate:tournamentInfo.tEndDate.toString(),
        tStartDate:tournamentInfo.tStartDate.toString(),
        organizerName:tournamentInfo.OrganizerName,
        bracketType: this.totalBrackets[value],
        fee:this.entryFee[value],
        index:value,
        allDivisions:tournamentInfo.division,
        minAge:this.minAge[value],
        userAge:this.state.ageOfUser
    }
    this.navigateToScreen(Obj, tournamentInfo)
    
  }

  checkingPlayerRegistration(){
    
    
    const eventType = this.props.navigation.getParam('type')
    
    const { value, allowRegister } = this.state
    this.setState({verificationModal:true, initializeVerification:true})

    if(this.availableSlots[value]>0){
        if(eventType=='League'){
            this.setState({verificationModal:false},()=>this.createTournamentObject())
        }
        else{
            this.checkGender()
        }
    }
    else{
        this.setState({initializeVerification:false, alreadyRegistered:false, slotsFull:true})
    }
  }

  openBrowser(){
    if(this.state.scheduleNotAvailable){
      alert('Schedule not available.')
    }
    else{
      Linking.openURL(this.state.BracketURL)
    }
  }

  render() {    
    const tournamentInfo = this.props.navigation.getParam('item')
    const type = tournamentInfo.type
    const {value, initializeVerification, genderMismatch, alreadyRegistered, alreadyPaid, slotsFull, canRegister, allowRegister, showMinAge} =this.state
    return (
        <ScrollView>
        <Modal 
        transparent={true}
        animationType='none'
        visible={this.state.verificationModal}
        >
            <View
                style={{ flex:1,justifyContent:'center', alignItems:'center',backgroundColor: 'rgba(52, 52, 52, 0.7)'}} 
            >
               
                <View style={{justifyContent:'center',borderRadius:10,backgroundColor:'white', width:'80%', borderWidth:1, borderColor:'#64A8B5'}}>
                    {initializeVerification&&<ActivityIndicator color='#51C560' size='large' style={{marginTop:50}}/>}
                    {initializeVerification&&<Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', marginBottom:50,fontSize:Responsive.font(15)}}>Verifying, please wait..</Text>}
                    

                    {alreadyRegistered && <Icon type="Ionicons" name="ios-checkmark-circle-outline"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#51C560'}}/>}
                    {alreadyRegistered && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15)}}>You have already registered</Text>}
                    {alreadyRegistered &&<TouchableOpacity onPress={()=>this.setState({verificationModal:false, alreadyRegistered:false, alreadyPaid:false, slotsFull:false, showMinAge:false})} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>}


                    {alreadyPaid && <Icon type="Ionicons" name="ios-checkmark-circle-outline"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#51C560'}}/>}
                    {alreadyPaid && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15)}}>You have successfully registered</Text>}
                    {alreadyPaid && <TouchableOpacity onPress={()=>this.setState({verificationModal:false, alreadyRegistered:false, alreadyPaid:false, slotsFull:false, showMinAge:false},()=>this.props.navigation.navigate('PaymentScreen',{data:this.state.registrationData, sender:true, tourData:tournamentInfo}))} style={{alignSelf:'center', backgroundColor:'#32CDEA', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Proceed to payment</Text></TouchableOpacity>}
                    {alreadyPaid && <TouchableOpacity onPress={()=>this.setState({verificationModal:false, alreadyRegistered:false, alreadyPaid:false, slotsFull:false, showMinAge:false})} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>}


                    {slotsFull && <Icon type="Entypo" name="circle-with-cross"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#E9835D'}}/>}
                    {slotsFull && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15)}}>Sorry! Slots are full</Text>}
                    {slotsFull && <TouchableOpacity onPress={()=>this.setState({verificationModal:false, alreadyRegistered:false, alreadyPaid:false, slotsFull:false, showMinAge:false})} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>}

                    
                    {genderMismatch && <Icon type="Entypo" name="circle-with-cross"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#E9835D'}}/>}
                    {genderMismatch && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15)}}>Sorry! You cannot register in this event</Text>}
                    {genderMismatch &&<TouchableOpacity onPress={()=>this.setState({verificationModal:false, alreadyRegistered:false, alreadyPaid:false, slotsFull:false, showMinAge:false, genderMismatch:false})} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>}


                    {showMinAge && <Icon type="Entypo" name="circle-with-cross"  style={{marginTop:30, alignSelf:'center',fontSize:Responsive.font(50) ,color: '#E9835D'}}/>}
                    {showMinAge && <Text style={{alignSelf:'center',fontFamily:'Lato-Bold', color:'#585858', fontSize:Responsive.font(15)}}> Minimum Age Restriction : {this.minAge[value]}</Text>}
                    {showMinAge && <TouchableOpacity onPress={()=>this.setState({verificationModal:false, alreadyRegistered:false, alreadyPaid:false, slotsFull:false, showMinAge:false})} style={{alignSelf:'center', backgroundColor:'#757575', width:'90%', paddingVertical:5, marginTop:10, borderRadius:5, marginBottom:10}}><Text style={{alignSelf:'center',fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(15)}}>Close</Text></TouchableOpacity>}

                </View>
            </View>


        </Modal>
        <View style={styles.cardStyles}>
        <Image  style={{ position:'absolute',opacity: 0.9,width:Dimensions.get('window').width, height:Dimensions.get('window').height/3}} 
        source={tournamentInfo.image!=undefined?{uri:tournamentInfo.image}:require('../../../../assets/Pickleball-Court-1030x773.png')}/>
        <Image  style={{ padding:0,marginTop:Dimensions.get('window').height/4,position:'absolute',opacity: 1, width:Dimensions.get('window').width, height:Dimensions.get('window').height/12}} source={require('../../../../assets/output-onlinepngtools.png')}/>
        <Text style={{textShadowOffset:{width:Responsive.width(1), height:Responsive.height(1)},textShadowColor:'#000000',textShadowRadius:1,marginTop:Dimensions.get('window').height/3-40, color:'white', fontFamily:'Lato-Medium', fontSize:Responsive.font(18)}}>  {this.state.useNewName?this.state.newName:tournamentInfo.tournamentName}</Text>
        
        {/* <View style={{borderWidth:0.5,borderColor:'#E8E8E8', marginTop:10, marginRight:10, marginLeft:10}}></View> */}
        
        <View style={{flexDirection:'row', paddingTop:Responsive.height(20), paddingLeft:10}}>
            <Icon type="MaterialIcons" name="date-range"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
            <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{this.state.startDate} - {this.state.endDate}</Text>
        </View>

        <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10}}>
            <Icon type="Entypo" name="location-pin"  style={{ alignSelf:'center',fontSize:Responsive.font(14) ,color: '#585858'}}/>
            <Text style={{fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', fontWeight:'600', paddingLeft:5}}>{tournamentInfo.address}</Text>
        </View>

        
        <View style={{borderWidth:0.5,borderColor:'#E8E8E8', marginTop:10, marginRight:10, marginLeft:10}}></View>

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
                <Text style={styles.head}>Organizer Email : </Text>
                <Text style={styles.detail}>{tournamentInfo.email}</Text>
            </View>
        </View>


        <View style={{borderWidth:0.5,borderColor:'#E8E8E8', marginTop:10, marginRight:10, marginLeft:10}}></View>


        <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft:10 }}>
            <View style={{ flexDirection: 'row', width: '100%' }} >
                <Text style={styles.head}>Available Slots : </Text>
                <Text style={styles.detail}>{this.availableSlots[value]}</Text>
            </View>
        </View>

        <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft:10 }}>
            <View style={{ flexDirection: 'row', width: '100%',  }} >
                <Text style={styles.head}>Waiting Slots : </Text>
                <Text style={styles.detail}>{this.waitingSlots[value]}</Text>
            </View>
        </View>

        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop:15 }}>
            <View style={{ flexDirection: 'row', width: '100%' }} >
                <Text style={styles.division}>Divisions :   </Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flexDirection:'row', width:'50%', height:Responsive.height(30)}}>
                {this.firstHalf.map(item=>{
                    return(
                        <View key={item.key} style={{paddingRight:13}}>
                            
                            <TouchableOpacity
                                style={{borderWidth:1, borderColor:'#64A8B5', borderRadius:5, alignItems:'center', justifyContent:'center', }}
                                onPress={()=>{
                                    this.setState({value:item.key},()=>this.getSchedule(tournamentInfo._id, tournamentInfo.type, tournamentInfo.leagueType))
                                }}
                                
                            >
                                <Text style={{alignSelf:'center', paddingLeft:10,paddingRight:10,color:'#585858', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>{item.name}</Text>
                            {
                            value===item.key && 
                            <Text style={{alignSelf:'center',backgroundColor:'#64A8B5',position:'absolute',paddingLeft:10,paddingRight:10,color:'white', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>{item.name}</Text>
                            
                            }
                            </TouchableOpacity>
                        </View>
                    )
                })}

                {this.secondHalf.map(item=>{
                    return(
                        <View key={item.key} style={{paddingRight:10}}>
                            
                            <TouchableOpacity
                                style={{borderWidth:1, borderColor:'#64A8B5', borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                onPress={()=>{
                                    this.setState({value:item.key},()=>this.getSchedule(tournamentInfo._id, tournamentInfo.type, tournamentInfo.leagueType))
                                }}
                                
                            >
                                <Text style={{alignSelf:'center', paddingLeft:10,paddingRight:10,color:'#585858', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>{item.name}</Text>
                            {
                            value===item.key && 
                            <Text style={{alignSelf:'center',backgroundColor:'#64A8B5',position:'absolute',paddingLeft:10,paddingRight:10,color:'white', fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>{item.name}</Text>
                            
                            }
                            </TouchableOpacity>
                        </View>
                    )
                })}

                
                </ScrollView>

                
            </View>
            
        </View>
        <View style={{marginLeft:10,marginRight:10, backgroundColor:'#BDF3FE', marginBottom:10, borderWidth:2, borderColor:'#64A8B5', borderRadius:5, justifyContent:'center'}}>
                <Text style={{paddingLeft:10, paddingTop:10,fontFamily:'Lato-Bold', fontSize:Responsive.font(15), color:'#585858'}}>Registrations are {canRegister?'open':'closed'} for "{this.totalDiv[value]}"</Text>
                <View style={{flexDirection:'row', paddingLeft:10,alignItems:'center' }}>
                    <Text style={styles.head}>Registration dates : </Text>
                    <Text style={styles.detail}>{this.state.regStartDate} - {this.state.regEndDate} </Text>
                </View>

                <View style={{flexDirection:'row', paddingLeft:10, paddingBottom:10, justifyContent:'space-between', paddingTop:5}}>
                    <Text style={styles.head}>Entry Fee : {this.entryFee[value]} $ </Text>
                    {canRegister&&<TouchableOpacity disabled={!canRegister} onPress={()=>this.checkingPlayerRegistration()} style={styles.mySBtn}><Text style={{color:canRegister?'#7E7E7E':'white',fontFamily:'Lato-Medium', fontSize:Responsive.font(11)}}>Register Now</Text></TouchableOpacity>}
                </View>
        </View>
    
        {/* <TouchableOpacity onPress={()=>this.createPdf()}>
                    <Text>Here</Text>
                </TouchableOpacity> */}
    </View>
    

    <View style={{ height: 1, backgroundColor: '', marginTop: 0 }} />
    {/* <Accordion
        dataArray={dataArray}
        animation={true}
        expanded={true}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
    /> */}
    <TouchableOpacity onPress={()=>this.setState({showDescription:!this.state.showDescription})} activeOpacity={1} style={{flexDirection:'row', padding:10,marginRight:10, marginLeft:10,
                        alignItems:'center',backgroundColor:'#64A8B5', borderRadius:5, justifyContent:'space-between', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        
                        shadowOpacity: 0.23,
                        shadowRadius: 2.62,
                        elevation: 3,}}>
        
        <View style={{flexDirection:'row'}}>
            {this.state.showDescription?<Icon style={{ fontSize:  Responsive.font(16), color:'white',alignSelf:'center' }} name="caret-down" type="FontAwesome"/>:<Icon style={{alignSelf:'center', fontSize:  Responsive.font(16), color:'white' }} name="caret-right" type="FontAwesome"/>}
            <Text style={{ paddingLeft:10, fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>Description</Text>
        </View>
        <View style={{flexDirection:'row'}}>
            <Icon style={{ fontSize:   Responsive.font(16), color:'white', alignSelf:'center' }} name="ios-pricetag" type="Ionicons"/>
            <Text style={{ paddingLeft:10, fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>{this.totalDiv[value]}</Text>
        </View>
    </TouchableOpacity>
    {this.state.showDescription ? <View style={{backgroundColor:'white',marginRight:10, marginLeft:10,paddingTop:10, paddingLeft:10}}>
        <Text style={styles.head}>Event Rules</Text>
        <Text style={styles.detail}>{tournamentInfo.tournamentRules}</Text>
        <View style={{paddingTop:10}}></View>

        <Text style={styles.head}>Refund Policy</Text>
        <Text style={styles.detail}>{tournamentInfo.refundPolicy}</Text>
        <View style={{paddingTop:10}}></View>

        <Text style={styles.head}>Hotel Discounts</Text>
        <Text style={styles.detail}>{tournamentInfo.hotelDiscounts}</Text>
        <View style={{paddingTop:10}}></View>

        
        <Text style={styles.head}>Notes</Text>
        <Text style={styles.detail}>{tournamentInfo.customNotes}</Text>
        <View style={{paddingTop:10}}></View>
    </View>:null}

    <TouchableOpacity onPress={()=>this.setState({showPlayers:!this.state.showPlayers})} activeOpacity={1} style={{flexDirection:'row', padding:10,marginRight:10, marginLeft:10, marginTop:10,
                        alignItems:'center',backgroundColor:'#64A8B5', borderRadius:5, justifyContent:'space-between', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        
                        shadowOpacity: 0.23,
                        shadowRadius: 2.62,
                        elevation: 3,}}>
        
        <View style={{flexDirection:'row'}}>
            {this.state.showPlayers?<Icon style={{ fontSize:  Responsive.font(16), color:'white' ,alignSelf:'center'}} name="caret-down" type="FontAwesome"/>:<Icon style={{ alignSelf:'center',fontSize:  Responsive.font(16), color:'white' }} name="caret-right" type="FontAwesome"/>}
            {type=='League' ? <Text style={{ paddingLeft:10, fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>Registered Teams</Text>:
            <Text style={{ paddingLeft:10, fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>Registered Players</Text>}
        </View>
        <View style={{flexDirection:'row'}}>
            <Icon style={{alignSelf:'center', fontSize:  Responsive.font(16), color:'white' }} name="ios-pricetag" type="Ionicons"/>
            <Text style={{ paddingLeft:10, fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>{this.totalDiv[value]}</Text>
        </View>
    </TouchableOpacity>

    {this.state.showPlayers ? <View style={{backgroundColor:'white',marginRight:10, marginLeft:10,paddingTop:10}}>
       <FlatList
            ListEmptyComponent={()=>{
                return <Text style={{fontSize:Responsive.font(12), fontFamily:'Lato-Medium', color:'#464646',alignSelf:'center', paddingBottom:10}}>No Players have registered yet!</Text>
            }}
            contentContainerStyle={{justifyContent:'center'}}
            data = {this.state.playersData}
            renderItem={({item, index})=>{
                
                if(this.state.scheduleData=='a'){}
                else{
                    return <PlayerCards data={item} type={type}/>

                   
                    
                }
            }}
            extraData={this.props}
            listKey={item => item._id}
            keyExtractor={(item, index) => index.toString()}

            
       />
    </View>:null}

    <TouchableOpacity onPress={()=>this.setState({showMap:!this.state.showMap})} activeOpacity={1} style={{flexDirection:'row', padding:10,marginRight:10, marginLeft:10, marginTop:10,
                        alignItems:'center',backgroundColor:'#64A8B5', borderRadius:5, justifyContent:'space-between', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        
                        shadowOpacity: 0.23,
                        shadowRadius: 2.62,
                        elevation: 3,}}>
        
        <View style={{flexDirection:'row'}}>
            {this.state.showMap?<Icon style={{ fontSize:  Responsive.font(16), color:'white',alignSelf:'center' }} name="caret-down" type="FontAwesome"/>:<Icon style={{ alignSelf:'center',fontSize:  Responsive.font(16), color:'white' }} name="caret-right" type="FontAwesome"/>}
            <Text style={{ paddingLeft:10, fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>Venue Location</Text>
        </View>
        <View style={{flexDirection:'row'}}>
            <Icon style={{ fontSize:  Responsive.font(16), color:'white',alignSelf:'center' }} name="ios-pricetag" type="Ionicons"/>
            <Text style={{ paddingLeft:10, fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>{this.totalDiv[value]}</Text>
        </View>
    </TouchableOpacity>

    {this.state.showMap ? <View style={{backgroundColor:'white',marginRight:10, marginLeft:10}}>
        {/* <Text>{JSON.stringify(this.state.scheduleData.flat(1))}</Text> */}
        <MapView style={{height:500, width:'100%'}}
        provider={PROVIDER_GOOGLE}
        initialRegion={{   latitude: this.lat,
         longitude: this.lon,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,}} >
             <Marker
                coordinate={{latitude: this.lat, longitude: this.lon}}
       
        />
         </MapView>


    </View>:null}

    <TouchableOpacity onPress={()=>this.setState({showDownload:!this.state.showDownload})} activeOpacity={1} style={{flexDirection:'row', padding:10,marginRight:10, marginLeft:10, marginTop:10,
                        alignItems:'center',backgroundColor:'#64A8B5', borderRadius:5, justifyContent:'space-between', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        
                        shadowOpacity: 0.23,
                        shadowRadius: 2.62,
                        elevation: 3,}}>
        
        <View style={{flexDirection:'row'}}>
            {this.state.showDownload?<Icon style={{ fontSize: Responsive.font(16), color:'white',alignSelf:'center' }} name="caret-down" type="FontAwesome"/>:<Icon style={{ alignSelf:'center',fontSize:  Responsive.font(16), color:'white' }} name="caret-right" type="FontAwesome"/>}
            <Text style={{ paddingLeft:10, fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>Event Schedule</Text>
        </View>
        <View style={{flexDirection:'row'}}>
            <Icon style={{ fontSize:  Responsive.font(16), color:'white',alignSelf:'center' }} name="ios-pricetag" type="Ionicons"/>
            <Text style={{ paddingLeft:10, fontFamily:'Lato-Bold', color:'white',fontSize:Responsive.font(13)}}>{this.totalDiv[value]}</Text>
        </View>
    </TouchableOpacity>

    {this.state.showDownload ? <View style={{flexDirection:'row',backgroundColor:'white',marginRight:10, marginLeft:10,paddingTop:10, paddingLeft:10, paddingBottom:10, justifyContent:'center'}}>
        <TouchableOpacity  onPress={()=>this.createPdf()} style={{flexDirection:'row', backgroundColor:'#6D6D6D', width:Responsive.width(130), justifyContent:'center',shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        
                        shadowOpacity: 0.23,
                        shadowRadius: 2.62,
                        elevation: 3,borderRadius:5}}>
            <Icon style={{ fontSize: Responsive.font(20), color:'white', alignSelf:'center', paddingRight:10 }} name="download" type="FontAwesome"/>
            <View style={{paddingVertical:5}}>
                <Text style={{fontFamily:'Lato-Medium', color:'white',alignSelf:'center', fontSize:Responsive.font(12)}}>Table View</Text>
                <Text style={{fontFamily:'Lato-Medium', color:'white',alignSelf:'center', fontSize:Responsive.font(8)}}>(Download PDF)</Text>
            </View>
        </TouchableOpacity>
        
        <View style={{paddingHorizontal:10}}></View>
        <TouchableOpacity onPress={()=>this.openBrowser()} style={{flexDirection:'row', backgroundColor:'#6D6D6D', width:Responsive.width(130), justifyContent:'center',shadowColor: "#000",
                        borderRadius:5,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        
                        shadowOpacity: 0.23,
                        shadowRadius: 2.62,
                        elevation: 3,}}>
            <Icon style={{ fontSize: Responsive.font(20), color:'white', alignSelf:'center', paddingRight:10 }} name="open-in-browser" type="MaterialIcons"/>
            <View style={{paddingVertical:5}}>
                <Text style={{fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(12),alignSelf:'center',}}>Bracket View</Text>
                <Text style={{fontFamily:'Lato-Medium', color:'white', fontSize:Responsive.font(8), alignSelf:'center',}}>(Open in browser)</Text>
            </View>
        </TouchableOpacity>

        </View>:null}

    <View style={{paddingBottom:10}}></View>
</ScrollView>
    );
  }
}

export default PlayerEventDetailsScreen;
const styles = StyleSheet.create({
    cardStyles: {
        alignSelf:'center',
        width: '100%',
        borderRadius:3,
        backgroundColor:'#FFFFFF',
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
        fontSize: Responsive.font(12),
        textAlignVertical:'center'
    },
    inHead: {
        fontSize:Responsive.font(16), color:'#585858', fontFamily:'Lato-Bold'
    },
    detail:{
        fontSize:Responsive.font(11), color:'#585858', fontFamily:'Lato-Medium', textAlignVertical:'center', marginTop:1
    },
    division:{
        color: '#585858',
        fontFamily: 'Lato-Bold',
        fontSize: Responsive.font(12),
    },
    mySBtn: {
        backgroundColor: 'white',
        padding: 2,
        justifyContent:'center',
        alignSelf:'center',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: Responsive.width(10),
        marginRight:10,
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