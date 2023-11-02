import { createSlice } from "@reduxjs/toolkit"

export const inft = createSlice ({
    name:'inft',
    initialState: {
        contract:null,
        balance:0,
        cost:0,
        minting:{
            isMinting:false,
            isSuccess:false,
            transactionHash: null
        }
    },
    reducers: {
        setInftContract:(state,action)=>{
            state.contract = action.payload
        },
        inftBalanceLoaded:(state, action)=>{
            state.balance = action.payload
        },
        inftCostLoaded:(state,action)=>{
            state.cost = action.payload
        },
        mintRequest:(state, action)=>{
            state.minting.isMinting = true
            state.minting.isSuccess = false
            state.minting.transactionHash = null
        },
        mintSuccess:(state, action)=>{
            state.minting.isMinting = false
            state.minting.isSuccess = true
            state.minting.transactionHash = action.payload
        },
        mintFail:(state, action)=>{
            state.minting.isMinting = false
            state.minting.isSuccess = false
            state.minting.transactionHash = null
        }
        
    }
})

export const { setInftContract, inftBalanceLoaded, inftCostLoaded, mintRequest, mintSuccess, mintFail } = inft.actions;

export default inft.reducer;