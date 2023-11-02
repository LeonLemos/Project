import { configureStore } from '@reduxjs/toolkit'

import provider from "./reducers/provider"
import nftliser from './reducers/nftliser'
import inft from './reducers/inft'


export const store = configureStore({
    reducer: {
        provider,
        nftliser,
        inft
        
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})