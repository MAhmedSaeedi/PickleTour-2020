import {
    inputText
} from './text'
import {
    WHITE
} from './colors'
import Responsive from 'react-native-lightweight-responsive'
import { generalShadow } from './shadows'
generalShadow
export const authField = {
    ...inputText,
    ...generalShadow,
    width:'90%',
    height:Responsive.height(50),
    paddingLeft:Responsive.width(20),
    padding:8,
    borderRadius:50,
    backgroundColor:WHITE
}

export const authFieldSignUp = {
    ...generalShadow,
    width:'95%',
    height:Responsive.height(50),
    paddingLeft:Responsive.width(20),
    padding:8,
    justifyContent:'center',
    borderRadius:50,
    alignSelf:'center',
    backgroundColor:WHITE
}

export const selectButton ={
    ...generalShadow,
    width:'90%',
    height:Responsive.height(50),
    paddingLeft:Responsive.width(20),
    padding:8,
    justifyContent:'center',
    borderRadius:50,
    alignSelf:'center',
    backgroundColor:WHITE,
    color:'grey',

}