import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
// import user from './user'
// const reducer = combineReducers({
//     user,
// })

// const store = configureStore({
//     reducer
// })

// export default store

import exampleReducer from './example'

export default configureStore({
    reducer:{
        examples : exampleReducer
    }
})