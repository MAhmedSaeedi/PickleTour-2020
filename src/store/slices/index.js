import { combineReducers } from 'redux'
import {  configureStore} from '@reduxjs/toolkit'
import recipesReducer from './recipes'
import notificationReducer  from './notifictionID'
import authReducer from './auth'
const rootReducer = combineReducers({
    recipes:recipesReducer,
    notificationID : notificationReducer,
    auth :authReducer
})

export const store = configureStore({
    reducer :rootReducer
})

