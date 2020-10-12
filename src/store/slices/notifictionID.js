import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    notificationID:null,
    hasFound:false,
    loading:false
}

const notifcationSlice = createSlice({
    name:'notification',
    initialState,
    reducers:{
        getNotificationIDSuccess : ( state, { payload })=>{
            state.hasFound = true,
            state.notificationID = payload
        },

        getNotificationIDFailure : state => {
            state.hasFound = false
        },
        getNotificationID : state => {
            state.loading = true
        }
    }
})

export const  { getNotificationID, getNotificationIDFailure, getNotificationIDSuccess } = notifcationSlice.actions

export default notifcationSlice.reducer

export const notificationSelector = state => state.notificationID

export function fetchNotificationID() {
    return async dispatch=>{
        dispatch(getNotificationID())
        try{
            const id = await window.storage.load({key :'notificationID'})
            dispatch(getNotificationIDSuccess(id))
        }catch(e){
            dispatch(getNotificationIDFailure())
        }
    }
}