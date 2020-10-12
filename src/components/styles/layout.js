import {
    Dimensions
} from 'react-native'
import Responsive from 'react-native-lightweight-responsive'

export const standardContainer = {
    flex:1,
    justifyContent:'center',
}

export const sectionStyle={
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Responsive.height(50),
    margin: 10,
}

export const authImageStyle={
    height: Responsive.height(60),
    marginBottom: Responsive.height(30),
    alignSelf:'center',
    marginTop:Responsive.height(50)
}