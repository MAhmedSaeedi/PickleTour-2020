import { AUTH_BUTTON, WHITE } from './colors'
import {
    generalShadow
} from './shadows'


export const loginButton = {
    ...generalShadow,
    backgroundColor:AUTH_BUTTON,
    paddingVertical:5,
    borderRadius: 100,
    width:'40%',
    alignSelf:'center',
    alignItems:'center',
    marginTop: 20,
    paddingLeft:50,
    paddingRight:50,
}

export const googleButton = {
    paddingVertical:5,
    width:'40%',
    alignSelf:'center',
    alignItems:'center',
    paddingLeft:50,
    paddingRight:50,
}

export const signUpButton = {
    ...generalShadow,
    backgroundColor:AUTH_BUTTON,
    paddingVertical:5,
    borderRadius: 100,
    
    alignSelf:'center',
    alignItems:'center',
    marginTop: 20,
    marginBottom:20,
    paddingLeft:50,
    paddingRight:50,
    paddingTop:5,
    paddingBottom:5
}