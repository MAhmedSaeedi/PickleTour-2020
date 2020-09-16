import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, FlatList, PermissionsAndroid, Platform, BackHandler } from 'react-native';
import { Icon } from 'native-base'
import TeamPlayerCards from '../Cards/TeamPlayerCards';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
  } from 'react-native-popup-menu';
import Responsive from 'react-native-lightweight-responsive';
import XLSX from 'xlsx'
import { writeFile, readFile, DownloadDirectoryPath,DocumentDirectoryPath } from 'react-native-fs'

const DDP = DownloadDirectoryPath+"/"
const input = res=>res
const output = str=>str

class PlayersListScreen extends Component {
    static navigationOptions = ({navigation})=> {
        const { SlideInMenu } = renderers
        return{
            
                headerMode:'float',
                headerRight:(
                    <Menu style={{marginRight:10}}>
                        <MenuTrigger>
                            <Icon type="MaterialCommunityIcons" name="dots-vertical"  style={{ alignSelf:'center',fontSize:Responsive.font(24) ,color: 'white'}}/>   
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={{ marginTop: 30 }}>
                            <MenuOption onSelect={navigation.getParam('Download')}>
                                <Text style={{fontFamily:'Lato-Medium', fontSize:Responsive.font(12), color:'#6B6B6B', padding:5}}>Download Excel Sheet</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                // <TouchableOpacity onPress={navigation.getParam('Modal')} style={{width:30, height:30}}>
                //     <Icon type="MaterialCommunityIcons" name="dots-vertical"  style={{ marginRight:10,alignSelf:'center',fontSize:Responsive.font(24) ,color: 'white'}}/>
                // </TouchableOpacity>
                ),
                headerTitle:
                    <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Players</Text>
            
        }
    }
  constructor(props) {
    super(props);
    this.compList=''
    this.fileName=''
    this.state = {
        isVisible:false,
        playersList:[]
    };
    this.exportFile = this.exportFile.bind(this)
  }
  
  componentDidMount(){
      this.props.navigation.setParams({Download:()=> this.requestPermission()})
      const players = this.props.navigation.getParam('data')
      let fileName = this.props.navigation.getParam('fileName')
      const res = fileName.replace(/[^a-zA-Z0-9-]/g,'_');
      this.fileName=res
      this.setState({playersList:players})
      this.createJSONObject(players)
      this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction)
      
  }

  backAction=()=>{
    this.props.navigation.goBack(null)
    return true    
  }
  componentWillUnmount(){
    this.backHandler.remove()
  }
  createJSONObject(data){
    let list =[]
    let n= 1

    data.map(e=>{
      list.push({"No.":n,"Name":e.fName,"Gender":e.gender,"DOB":e.dob,"Email":e.email,"Phone":e.phone })
      n=n=1
    })
    if(list.length==1 || list.length ==2){
      list.push({"No.":'  ',"Name":'  ',"Gender":'  ',"DOB":'  ',"Email":'  ',"Phone":'  ' })
      list.push({"No.":'  ',"Name":'  ',"Gender":'  ',"DOB":'  ',"Email":'  ',"Phone":'  ' })
      list.push({"No.":'  ',"Name":'  ',"Gender":'  ',"DOB":'  ',"Email":'  ',"Phone":'  ' })
      this.compList=list
    }
    else{
      this.compList = list
    }
    
  }

  requestPermission=()=>{
    var that = this
    async function externalStoragePermission(){
      try{
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title:'Allow PickleTour access',
            message:'PickleTour needs access to storage to download pdf'
          }
        )
        if(granted ===PermissionsAndroid.RESULTS.GRANTED){
          if(that.compList.length>=1)
          {
            that.exportFile()
          }
          else{
            Alert.alert("Error","Player list is empty.")
          }
        }
        else{
          alert('Permission denied.')
        }
      }catch(err){

      }
    }
    if(Platform.OS==='android'){
      externalStoragePermission()
    }
    else{
      if(this.compList.length>=1){
        this.exportFile()
      }
      else{
        Alert.alert("Error","Player list is empty.")
      }
      
    }
  }
  exportFile(){
    const ws = XLSX.utils.json_to_sheet(this.compList)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb,ws,"SheetJS")

    const wbout = XLSX.write(wb,{type:'binary',bookType:"xlsx"})
    const file = DDP+`${this.fileName}.xlsx`

    writeFile(file, output(wbout),'ascii').then((res)=>{
      Alert.alert("File saved successfully","Exported to "+file)
    }).catch((err)=>{
      Alert.alert("Export error","error"+err.message)
    })
  }

  showAlert(){
      console.log('Downloaded')
    //   Alert.alert('Download Excel Sheet','',[
    //       {
    //           text:'No',
    //           style:'cancel'
    //       },
    //       {
    //           text:'Yes',
    //           onPress: async () =>{
    //               try{
    //                   console.log('Download')
    //               }catch(error){}
    //           }
    //       }
    //   ])
  }


  render() {
    return (
      <View style={{flex:1, backgroundColor:'white', paddingTop:10}}>
          <FlatList
            data={this.state.playersList}
            keyExtractor={item=>item._id}
            renderItem={({item})=>(
              <TeamPlayerCards data={item}/>
            )}
            ListEmptyComponent={()=>{
              return <Text style={{fontSize:Responsive.font(20), fontFamily:'Lato-bold', color:'#464646',alignSelf:'center', paddingBottom:10, paddingTop:'50%'}}>No Players have registered yet!</Text>
          }}
          />
      </View>
    );
  }
}

export default PlayersListScreen;
