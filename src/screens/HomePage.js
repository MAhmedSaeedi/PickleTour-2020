import React, { Component } from 'react';
import { AsyncStorage, Dimensions, StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity, Keyboard} from 'react-native';
import Responsive from 'react-native-lightweight-responsive';
import ToBeRequestedEvents from './ToBeRequestedEvents';
import axios from 'axios';


export default class HomePage extends Component {
  static navigationOptions = {
    headerMode:'float',
    headerTitle:
        <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Find Events</Text>
}
  constructor(props) {
    super(props);
    this.state = {
        isTourLoading:false,
        tourData:[],
        tourDataSearch:[],
        tourOffset:0,
        tempTourOffset:0,
        tourExtraDataLoading:false,
        tourExtraDataFound:false,
        checkedExtraTourData:false,
        isSearching:false,

        isRecreationalLoading:false,
        recreationalData:[],
        recreationalDataSearch:[],
        recreationalOffset:0,
        tempRecreationalOffset:0,
        recreationalExtraDataLoading:false,
        recreationalExtraDataFound:false,
        showMessageRecreational:false,
        checkedExtraLeaguesData:false,

        isLeaguesLoading:false,
        leaguesData:[],
        leaguesDataSearch:[],
        leaguesOffset:0,
        tempLeaguesOffset:0,
        leagueExtraDataLoading:false,
        leagueExtraDataFound:false,
        checkedExtraRecreationalData:false,
        actScr:1,
        todayDate:null,
        todayTime:null
    };
  }
  componentDidMount(){
      const today = new Date();
      const h = today.getHours();
      let m = today.getMinutes();
      m = (m < 10) ? ("0" + m) : m;
      let time = h+':'+m      
      this.setState({todayDate:today, todayTime:time})
      this.getUserData()
      this.getTourData()
      // this.getLeaguesData()
      // this.getRecreationalData()
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  keyboardDidHide=()=>{
    Keyboard.dismiss()
    this.setState({isSearching:false,})
  }
  getTourData(){
    this.setState({isTourLoading:true})
    var con =  this.state.tourOffset
    var myEvents=[]
    var dummyData=[]
    var prevEvents = this.state.tourData
    var gettingUrl = 'https://pickletour.com/api/get/tournament/page/'
    axios.get(gettingUrl + con)
    .then((response)=>{
        myEvents = response.data
        if(myEvents.length>0){
            myEvents.map(item=>{
              var msDiff = new Date(item.regEndDate).getTime() - new Date().getTime()
              if(msDiff >=0){
                dummyData.push(item)
              }
            })
            if(dummyData.length>0){
               this.setState({
                tourData:dummyData,
                tourDataSearch:dummyData,
                isTourLoading:false,              
               })
            }
            else{
              this.setState({
                isTourLoading:false
             })
            }
           
        }
        else{
            this.setState({
               isTourLoading:false
            })
        }
    }).catch((error)=>{
        //console.log(error)
    })

}
getMoreTourData(counter){
  this.setState({tourExtraDataLoading:true})
  var myEvents=[]
  var prevEvents = this.state.tourData
  var gettingUrl = 'https://pickletour.com/api/get/tournament/page/'
  axios.get(gettingUrl + counter)
  .then((response)=>{
      myEvents = response.data
      var allEvents = [...prevEvents, ...myEvents]
      if(myEvents.length>0){
          this.setState({
              tourData:allEvents,
              tourDataSearch:allEvents,
              tempTourOffset:counter,
              tourExtraDataLoading:false,
              tourExtraDataFound:true,
              checkedExtraTourData:true                            
          })
      }
      else{
          this.setState({
             tourExtraDataLoading:false,
             tourExtraDataFound:false,
             checkedExtraTourData:true
          })
      }
  }).catch((error)=>{
      //console.log(error)
  })

}
getLeaguesData(){
    this.setState({isLeaguesLoading:true})
    var myEvents=[]
    var con =  this.state.leaguesOffset
    var gettingUrl = 'https://pickletour.com/api/get/league/page/'
    axios.get(gettingUrl + con)
    .then((response)=>{
        myEvents = response.data
        if(myEvents.length>0){
            this.setState({
                leaguesData:myEvents,
                leaguesDataSearch:myEvents,
                isLeaguesLoading:false,
                
                
            })
        }
        else{
            this.setState({
               isLeaguesLoading:false
            })
        }
    }).catch((error)=>{
        //console.log(error)
    })

}

getRecreationalData(){
    this.setState({isRecreationalLoading:true})
    var myEvents=[]
    var con =  this.state.recreationalOffset
    var gettingUrl = 'https://pickletour.com/api/get/recreational/page/'
    axios.get(gettingUrl + con)
    .then((response)=>{
        myEvents = response.data
        
        if(myEvents.length>0){
            this.setState({
                recreationalData:myEvents,
                recreationalDataSearch:myEvents,
                isRecreationalLoading:false,
                tourDataFound:true
                
                
            })
        }
        else{
            this.setState({
               isRecreationalLoading:false,
               tourDataFound:false
            })
        }
    }).catch((error)=>{
       // console.log(error)
    })

}

getMoreRecreationalData(counter){
  this.setState({recreationalExtraDataLoading:true })
  var myEvents=[]
  var prevEvents = this.state.recreationalData
  var gettingUrl = 'https://pickletour.com/api/get/recreational/page/'
  axios.get(gettingUrl + counter)
  .then((response)=>{
      myEvents = response.data
      var allEvents = [...prevEvents, ...myEvents]
      if(myEvents.length>0){
          this.setState({
              recreationalData:allEvents,
              recreationalDataSearch:allEvents,
              tempRecreationalOffset:counter,
              recreationalExtraDataLoading:false,
              recreationalExtraDataFound:true,
              
          })
      }
      else{
          this.setState({
            recreationalExtraDataLoading:false,
            recreationalExtraDataFound:false,
            showMessageRecreational:true
            
          })
      }
  }).catch((error)=>{
     // console.log(error)
  })

}

getMoreLeaguesData(counter){
  this.setState({leagueExtraDataLoading:true})
  var myEvents=[]
  var prevEvents = this.state.leaguesData
  var gettingUrl = 'https://pickletour.com/api/get/league/page/'
  axios.get(gettingUrl + counter)
  .then((response)=>{
      myEvents = response.data
      var allEvents = [...prevEvents, ...myEvents]
      if(myEvents.length>0){
          this.setState({
              leaguesData:allEvents,
              leaguesDataSearch:allEvents,
              tempLeaguesOffset:counter,
              leagueExtraDataLoading:false, 
              leagueExtraDataFound:true,
              checkedExtraLeaguesData:true 
          })
      }
      else{
          this.setState({
            leagueExtraDataLoading:false,
            leagueExtraDataFound:false,
            checkedExtraLeaguesData:true
          })
      }
  }).catch((error)=>{
     // console.log(error)
  })

}
async getUserData(){
    try{
        let user = await AsyncStorage.getItem('userProfileDataPlayer')
        this.data= JSON.parse(user)
  
      }catch(error){
        //console.log(error)
      }
}

handleMoreTourData=()=>{
    var con = this.state.tempTourOffset+1
    this.getMoreTourData(con)
}

handleMoreRecreationalData=()=>{
  var con = this.state.tempRecreationalOffset+1
  this.getMoreRecreationalData(con)
}

handleMoreLeaguesData=()=>{
  var con = this.state.tempLeaguesOffset+1
  this.getMoreRecreationalData(con)
}


searchFilterFunction = text =>{
    this.setState({isSearching:true})
    if(this.state.actScr ==1){
        const newData = this.state.tourDataSearch.filter(item =>{
            const itemData = `${item.tournamentName.toUpperCase()}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;    
        })

        if(newData.length ==0){
          this.searchFilterFunctionLocation(text)
        }
        else{
          this.setState({ tourData :newData })
        }
        
    }
    else if(this.state.actScr ==2){
        const newData = this.state.leaguesDataSearch.filter(item =>{
            const itemData = `${item.tournamentName.toUpperCase()}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;    
        })
     
        if(newData.length ==0){
          this.searchFilterFunctionLocation(text)
        }
        else{
          this.setState({ leaguesData :newData })
        }
        
    }
    else{
        const newData = this.state.recreationalDataSearch.filter(item =>{
            const itemData = `${item.tournamentName.toUpperCase()}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;    
        })
        if(newData.length ==0){
          this.searchFilterFunctionLocation(text)
        }
        else{
          this.setState({ recreationalData :newData })
        }
    }
}

searchFilterFunctionLocation = text =>{
  if(this.state.actScr ==1){
      const newData = this.state.tourDataSearch.filter(item =>{
          const itemData = `${item.address.toUpperCase()}`
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;  
      })
      this.setState({ tourData :newData })
  }
  else if(this.state.actScr ==2){
      const newData = this.state.leaguesDataSearch.filter(item =>{
          const itemData = `${item.address.toUpperCase()}`
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;  
      })
      this.setState({ leaguesData :newData })
  }
  else{
      const newData = this.state.recreationalDataSearch.filter(item =>{
          const itemData = `${item.address.toUpperCase()}`
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;  
      })
      this.setState({ recreationalData :newData })
  }
}

  renderRecreationalFooter =()=>{
    const { showMessageRecreational, recreationalExtraDataLoading} = this.state
    if(showMessageRecreational){
      return(
        <Text style={{ justifyContent: 'center', textAlign: 'center', paddingBottom:10 }}>No Remaining Data</Text>
      )
    }
    else if(recreationalExtraDataLoading){
      return(
        <ActivityIndicator size="large" color="#48A080" style={{paddingBottom:10}} />
      )
    }
    else
      return null
  }
  render() {
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
        
        {/* <View style={styles.wrapTopSty}>
                    <TouchableOpacity onPress={() => this.setState({ actScr: 1 })} style={this.state.actScr == 1 ? styles.topBarStyAct : styles.topBarSty}>
                        <Text style={this.state.actScr==1?styles.selectedtopBarText:styles.topBarText}>Tournaments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ actScr: 2 })} style={this.state.actScr == 2 ? styles.topBarStyAct : styles.topBarSty}>
                        <Text style={this.state.actScr==2?styles.selectedtopBarText:styles.topBarText}>Leagues</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ actScr: 3  })} style={this.state.actScr == 3 ? styles.topBarStyAct : styles.topBarSty}>
                        <Text style={this.state.actScr==3?styles.selectedtopBarText:styles.topBarText}>Recreational</Text>
                    </TouchableOpacity>
        </View> */}
        <View style={styles.SectionStyle}>
            <TextInput
            placeholder="Search by name or location"
            placeholderTextColor="#B1B1B1"
            style={styles.forms}
            onChangeText={value => this.searchFilterFunction(value)}
            />
            <Image style={{ marginRight:10, width: 20, height: 20 }} source={require('../../assets/Path100.png')} />
        </View>
        {this.state.actScr ==1 ?
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop:10 }}>
        {this.state.isTourLoading ? (
          <View style={{justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large"  />
          </View>
        ) : null}
        <FlatList
          bounces={false}
          data={this.state.tourData}
          onEndReachedThreshold={0.01}
          showsVerticalScrollIndicator={false}
          onEndReached={this.handleMoreTourData}
          renderItem ={({item})=>
          (
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('RefereeRequestScreen',{item:item, user:this.data}) }}>
              <ToBeRequestedEvents key={item._id} data={item} user={this.data} />
            </TouchableOpacity>
          )
          
        }
          // ListFooterComponent=
          // {!this.state.isSearching && (this.state.tourExtraDataLoading ? <ActivityIndicator size="large" color="#48A080" style={{paddingBottom:10}} /> : this.state.tourExtraDataFound ? null : this.state.checkedExtraTourData && <Text style={{ justifyContent: 'center', textAlign: 'center', paddingBottom:10 }}>No Remaining Data</Text>) }
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            !this.state.isTourLoading&&
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50
              }}
            >
              <Text style={{fontFamily:'Lato-Bold',alignSelf:'center',fontSize:Responsive.font(20)}}>Events not found !</Text>
            </View>
          )}
        />
      </View>:null}

      {this.state.actScr ==2 ?
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop:10 }}>
        {this.state.isLeaguesLoading ? (
          <View style={{justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large"  />
          </View>
        ) : null}
        <FlatList
          bounces={false}
          data={this.state.leaguesData}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          onEndReached={this.handleMoreLeaguesData}
          // ListFooterComponent=
          // {!this.state.isSearching && (this.state.leagueExtraDataLoading ? <ActivityIndicator size="large" color="#48A080" style={{paddingBottom:10}}/> : this.state.leagueExtraDataFound ? null : this.state.checkedExtraLeaguesData && <Text style={{ justifyContent: 'center', textAlign: 'center', paddingBottom:10 }}>No Remaining Data</Text>)}
          renderItem ={({item})=>(
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('RefereeRequestScreen',{item:item, user:this.data}) }}>
                  <ToBeRequestedEvents key={item._id} data={item} user={this.data} />
              </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50
              }}
            >
              <Text style={{ color: 'black' }}>No events Found</Text>
            </View>
          )}
        />
      </View>:null}

      {this.state.actScr ==3 ?
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop:10 }}>
        {this.state.isRecreationalLoading ? (
          <View style={{justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large"  />
          </View>
        ) : null}
        <FlatList
          onEndReachedThreshold={0.5}
          bounces={false}
          showsVerticalScrollIndicator={false}
          onEndReached={this.handleMoreRecreationalData}
          data={this.state.recreationalData}
          ListFooterComponent={this.renderRecreationalFooter}
          renderItem ={({item})=>(
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('RefereeRequestScreen',{item:item, user:this.data}) }}>
                  <ToBeRequestedEvents key={item._id} data={item} user={this.data} />
              </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50
              }}
            >
              <Text style={{ color: 'black' }}>No events Found</Text>
            </View>
          )}
        />
      </View>:null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    SectionStyle: {
        marginTop:10,
        alignSelf:'center',
        width:'92%',
        borderRadius:20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        // borderRadius: 5,
        borderColor: "#48A080",
        borderWidth: 1,
        
    },
    forms: {
        paddingTop: 5,
        paddingRight: 5,
        paddingBottom: 5,
        paddingLeft: 0,
        backgroundColor: '#F2F2F2',
        color: '#48A080',
        width: Dimensions.get('window').width - 100,
        fontSize: Responsive.font(16),
        fontFamily:'Lato-Medium'
    },
    topBarSty: {
        height: 40,
        width: Dimensions.get('window').width / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },

    wrapTopSty: {
        backgroundColor: '#686868',
        flexDirection: 'row',
    },
    topBarText: {
        color: 'white',
        fontFamily: 'Lato-Bold',
        fontSize:Responsive.font(13)
    },
    selectedtopBarText:{
        color:'#9EEACE',
        fontFamily: 'Lato-Bold',
        textDecorationLine:'underline',
        fontSize:Responsive.font(13)
    },
    topBarStyAct: {
        height: 40,
        width: Dimensions.get('window').width / 3,
        alignItems: 'center',
        justifyContent: 'center',
        
    },




});
