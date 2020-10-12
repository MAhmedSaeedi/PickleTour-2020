import Responsive from 'react-native-lightweight-responsive';
import {
    BLACK, GREY, WHITE
} from './colors'

export const boldFont = {
    fontFamily:'Lato-Bold'
}

export const mediumFont = {
    fontFamily:'Lato-Medium'
}

export const text14 = {
    ...mediumFont,
    fontSize: Responsive.font(14),

}

export const inputText = {
    ...text14,
    color:BLACK
}

export const labelText = {
    ...text14,
    color:'grey'
}
export const inputTextButton = {
    ...text14,
    color:'grey'
}
export const loginText ={
    fontSize:Responsive.font(16),
    ...mediumFont,
    color: WHITE,
}

export const registerText = {
    ...mediumFont,
    color: WHITE,
    alignSelf:'center',
    fontSize:Responsive.font(16),
    textDecorationLine:'underline',
}

export const orText ={
    ...mediumFont,
    color: WHITE,
    marginVertical:Responsive.height(10),
    alignSelf:'center',
    fontSize:Responsive.font(16),
}