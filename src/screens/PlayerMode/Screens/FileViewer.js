import React, { Component } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview';
// import { captureScreen } from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

class FileViewerScreen extends Component {
    static navigationOptions = {
        headerMode:'float',
        headerTitle:
            <Text style={{ alignSelf:'center', color: 'white',fontFamily:'Lato-Bold',fontSize:Responsive.font(20)  }}>Bracket View</Text>
    }
  constructor(props) {
    super(props);
    this.state = {
        
    };
  }
//   componentDidMount = async ()=>{
//       try{
//         const file = this.props.data
//         const loadfile = 'file://'+file
//         const asset = await AssetUtils.resolveAsync(loadfile)
//         this.setState({asset})
//       }catch(error){

//       }
//   }

  async createPdf(uri){
    let options ={
      html:`<img src="${uri}" width="100%" style="width:500px;height:600px;"/>`,
      fileName:'test',
      directory:'Documents'
    }
    let file = await RNHTMLtoPDF.convert(options)
    alert(file.filePath)
  }

  takeScreenShot=()=>{
    // captureScreen({format:"jpg", quality:0.8})
    // .then(uri=>this.createPdf(uri))
  }
  render() {
    const file = this.props.path
      
    return (
      <View style={{flex:1, justifyContent:'center', backgroundColor:'white'}}>
        
         <WebView
          originWhitelist={['*']}
          source={{ uri: "https://www.pickletour.com/BracketsEnds/Men's%20Singles/League/Box%20League/5e7e1157208320001f27b29e" }}
        />
        <TouchableOpacity onPress={()=>this.takeScreenShot()} style={{backgroundColor:'#32CDEA', width:'80%', height:40, justifyContent:'center', borderRadius:5, alignSelf:'center', marginBottom:4}}>
          <Text style={{alignSelf:'center', color:'white', fontFamily:'Lato-Bold', fontSize:Responsive.font(14)}}>Download</Text>
        </TouchableOpacity>
      </View>
      
      
    );
  }
}

export default FileViewerScreen;
