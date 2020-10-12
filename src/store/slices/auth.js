import { createSlice } from '@reduxjs/toolkit' 
import axios from 'axios'
import {
    GoogleSignin,
    statusCodes
} from '@react-native-community/google-signin'

export const initialState = {
    loading:false,
    hasErrors:false,
    userData:null,
    userToken:null,
    errorDescriptive:''
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        getAuth : state =>{
            state.loading = true
        },
        getAuthSuccess :(state,{payload})=>{
            state.userData = payload,
            state.loading = false,
            state.hasErrors = false
        },
        getAuthFailure : (state, {payload}) =>{
            state.loading = false,
            state.hasErrors  = true
            state.errorDescriptive = payload
        },
        removeAuthSuccess :(state, {payload})=>{
            state.loading = false,
            state.hasErrors = false
        }
    }
})

export const  { getAuth, getAuthFailure, getAuthSuccess, removeAuthSuccess } = authSlice.actions

export default authSlice.reducer

export const authSelector = state => state.auth

export function authUser(user, password) {
    
    return async dispatch=>{
        dispatch(getAuth())
        
        try{
            const response = await axios.post('http://192.168.100.10/',{
                "email":"imran1@gmail.com",
                "password":"imran123"
            })
            const data = await response.json()
            console.log('Response', response)
            // window.storage.save({
            //     key:'userData',
            //     data:JSON.stringify(data)
            // })
        }catch(error){
            
            console.log('Error',error)
        }
    }

}

export function googleSignIn(){
    return async dispatch=>{
        dispatch(getAuth())

        try{
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            //store values here with async storage
            dispatch(getAuthSuccess(userInfo))
        }catch(error){
            dispatch(getAuthFailure(error))
        }
    }
}

export function googleSignOut(){
    return async dispatch=>{
        dispatch(getAuth())
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            dispatch(removeAuthSuccess())
            //remove values here with async storage
          } catch (error) {
            dispatch(getAuthFailure(error))
          }
    }
}

