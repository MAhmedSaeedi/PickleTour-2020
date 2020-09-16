import React, { Component } from 'react';
import { AsyncStorage, Dimensions, StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity, Keyboard} from 'react-native';
import axios from 'axios'
import Responsive from 'react-native-lightweight-responsive';
import ToBeRequestedEvents from '../ToBeRequestedEvents';





class FindRecreationalScreenRef extends Component {
  constructor(props) {
    super(props);
    this.data=''
        this.state = {
            isSearching:false,
            eventType: '',
            seLoc: '',
            tourData: [],
            value:0,
            filteredData:[],
            searchData:[],
            loading: true,
            dataFound: false,
            counter: 0,
            dropChanged: false,
            gettingUrl: 'https://pickletour.com/api/get/tournament/page/',
            options:[
              {
                key:0,
                text:'All'
              },
              {
                key:1,
                text:'PickleTour'
              },
              {
                key:2,
                text:'USAPA Sanctioned'
              }
            ]
        };
        this.onEndReachedCalledDuringMomentum = true;
        this.getData = this.getData.bind(this)
  }

  getData =()=>{
    var prevData =[]
    var con = this.state.counter
    if(this.state.dropChanged){
      this.setState({
        loading:true,
        dataFound:false,
        counter:0,
        dropChanged:false
      })
      con = 0
    }
    else{
      prevData = this.state.tourData
    }

    var newData =[]
    var dummyData =[]
    var gettingUrl = 'https://pickletour.com/api/get/bothRecreationals'
    axios.get(gettingUrl)
    .then((response)=>{
      newData = response.data
    //   var allData = [...prevData, ...newData]
      var con = this.state.counter
      if(newData.length > 0){
          newData.map(item=>{
            var msDiff = new Date(item.regEndDate).getTime() - new Date().getTime()
            if(msDiff>=0){
              if(item.type=='Recreational'){
                dummyData.push(item)
              }
            }
          })
        if(dummyData.length>0){
            var allData =[...dummyData]
            var sortedArray = allData.sort((a,b)=> new Date(a.tStartDate) - new Date (b.tStartDate))
            
            this.setState({
                tourData:allData,
                searchData:allData,
                backupData:allData,
                filteredData:allData,
                loading:false,
                dataFound:true,
                counter:con+1
            })
        }
        else{
            this.setState({
              backupData:dummyData,
              loading:false,
              dataFound:false
            })
        }
      }
      else{
        //var allData =[...prevData]
        this.setState({
          //tourData:allData,
          //searchData:allData,
          backupData:dummyData,
          loading:false,
          dataFound:false
        })
      }
    }).catch((error)=>{
      //console.log(error)
    })
    
  }

  onEndReached = ({ distanceFromEnd }) => {
    var con = this.state.counter
    if (this.state.dataFound) {
        if (!this.onEndReachedCalledDuringMomentum) {
            this.setState({    // prevState?
                loading: true,
                counter: con + 1
            });
            this.forceUpdate()
            this.getData()
            this.onEndReachedCalledDuringMomentum = true;
        }
    }
  }

  componentDidMount(){
    const today = new Date();
    const h = today.getHours();
    let m = today.getMinutes();
    m = (m < 10) ? ("0" + m) : m;
    let time = h+':'+m      
    this.setState({todayDate:today, todayTime:time, value:0,})
    this.getData()
    this.getUserData()
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
    
  }

  keyboardDidHide=()=>{
    Keyboard.dismiss()
    this.setState({isSearching:false,})
  }

  searchPickleTour (){
    const {backupData} = this.state
   let newData = backupData
   let dummyData =[]
   if(backupData.length>0){
    newData.map(item=>{
      if(item.type=='Recreational'){
        dummyData.push(item)
      }
   })
   }
   if(dummyData.length>0){
     this.setState({tourData:dummyData, filteredData:dummyData})
   }
   else{
    this.setState({tourData:dummyData, filteredData:dummyData})
   }
}


 searchUSAPASantioned(){
   const {backupData} = this.state
   let newData = backupData
   let dummyData =[]
   if(backupData.length>0){
    newData.map(item=>{
      if(item.type=='Sanctioned Recreational'){
        dummyData.push(item)
      }
   })
   }
   if(dummyData.length>0){
     this.setState({tourData:dummyData, filteredData:dummyData})
   }
   else{
    this.setState({tourData:dummyData, filteredData:dummyData})
   }
 }


  searchFilterFunction = text =>{
      this.setState({isSearching:true})
      const newData = this.state.filteredData.filter(item=>{
          const itemData =`${item.tournamentName.toUpperCase()}`
          const textData = text.toUpperCase()
          return itemData.indexOf(textData) > -1;
      })
      if(newData.length ==0){
          this.searchFilterFunctionLocation(text)
      }
      else{
          this.setState({tourData:newData})
      }
  }


  async getUserData(){
    try{
        let user = await AsyncStorage.getItem('userProfileDataPlayer')
        this.data= JSON.parse(user)
  
      }catch(error){
       // console.log(error)
      }
}

  searchFilterFunctionLocation = text =>{
      const newData = this.state.filteredData.filter(item=>{
          const itemData = `${item.address.toUpperCase()}`
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1
      })
      this.setState({tourData:newData})
  }
  sendCallForFilter(key){
    if(key==0){
      this.setState({value:key, tourData:this.state.backupData, filteredData:this.state.backupData})
    }
    else if(key==1){
      this.setState({value:key},()=>this.searchPickleTour())
    }
    else {
      this.setState({value:key},()=>this.searchUSAPASantioned())
    }
  }



  render() {
    const { options, value } = this.state
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
             <View style={{flexDirection:'row', justifyContent:'space-around',width:'88%',alignSelf:'center', marginTop:10}}>
                {options.map(item=>{
                    return(<View key={item.key} style={styles.buttonContainer} >
                      <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.sendCallForFilter(item.key)}>
                        
                        { value ==item.key ? 
                        <View style={{backgroundColor:'#5AACAC', paddingHorizontal:10,paddingVertical:5, borderRadius:5, borderWidth:1, borderColor:'#5AACAC'}}>
                          <Text style={{fontFamily:'Lato-Medium', fontSize:Responsive.font(12), color:'white'}}>  {item.text}  </Text>
                        </View>
                        
                        :
                        <View style={{paddingHorizontal:10, paddingVertical:5, borderRadius:5, borderWidth:1, borderColor:'#5AACAC'}}>
                          <Text style={{fontFamily:'Lato-Medium', fontSize:Responsive.font(12), color:'#585858'}}>  {item.text}  </Text>
                        </View>
                        }
                        
                      </TouchableOpacity>
                      
                      
                    </View>)
                  })}
              </View>
          <View style={styles.SectionStyle}>
          <TextInput
            placeholder="Search by name or location"
            placeholderTextColor="#B1B1B1"
            style={styles.forms}
            onChangeText={value => this.searchFilterFunction(value)}
            />
            <Image style={{ marginRight:10, width: 20, height: 20 }} source={require('../../../assets/Path100.png')} />
          </View>
       

       <View style={{borderWidth:0.5,borderColor:'#E2E2E2', marginRight:10, marginLeft:10, marginBottom:10}}></View>
          <FlatList
            extraData={this.state}
            data={this.state.tourData}
            renderItem={({item})=>(
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('RefereeRequestScreen',{item:item, user:this.data}) }}>
              <ToBeRequestedEvents key={item._id} data={item} user={this.data} />
            </TouchableOpacity>
            )}
            ListFooterComponent={
                this.state.loading?
                <View style={{}}>
                  <ActivityIndicator size="large" color="#48A080" />
                </View> : 
                this.state.dataFound?null:<Text> </Text>
              }
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 50
                  }}
                >
                  {!this.state.loading && <Text style={{ color: 'black', fontFamily:'Lato-Medium', fontSize:Responsive.font(16) , marginTop:'25%'}}>No events Found</Text>}
                </View>
              )}
              keyExtractor={(item, index)=>index}
              // onEndReached={this.onEndReached.bind(this)}
              // onEndReachedThreshold={0.5}
              // onMomentumScrollBegin={()=>{this.onEndReachedCalledDuringMomentum=false}}
          />
          

          
      </View>
    );
  }
}

export default FindRecreationalScreenRef;

const styles = StyleSheet.create({
    SectionStyle: {
        marginTop:10,
        alignSelf:'center',
        width:'92%',
        borderRadius:20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        // borderRadius: 5,
        borderColor: "#64A8B5",
        borderWidth: 1,
        marginBottom:10
        
    },
    forms: {
        paddingTop: 5,
        paddingRight: 5,
        paddingBottom: 5,
        paddingLeft: 0,
        backgroundColor: 'white',
        color: '#48A080',
        width: Dimensions.get('window').width - 100,
        fontSize: Responsive.font(16),
        fontFamily:'Lato-Medium'
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  circle: {
      height: 12,
      width: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'black',
      alignSelf:'center',
      alignItems: 'center',
      justifyContent: 'center',
  },
  checkedCircle: {
   
      width: 5,
      height: 5,
      borderRadius: 7,
      backgroundColor: 'black',
      alignSelf:'center'
  },
})




