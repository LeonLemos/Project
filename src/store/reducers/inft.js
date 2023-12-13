import { createSlice } from "@reduxjs/toolkit"

export const inft = createSlice ({
    name:'inft',
    initialState: {
        contract:null,
        owner:null,
        balanceOf:0,
        deposits:0,
        cost:0,
        supply:0,
        minting:{
            isMinting:false,
            isSuccess:false,
            transactionHash: null
        },
        withdrawing:{
            isWithdrawing:false,
            isSuccess:false,
            transactionHash: null
        },

    },
    reducers: {
        setInftContract:(state,action)=>{
            state.contract = action.payload
        },
        setOwner:(state,action)=>{
            state.owner = action.payload
        },
        inftBalanceLoaded:(state, action)=>{
            state.balanceOf = action.payload
        },
        inftDepositsLoaded:(state, action)=>{
            state.deposits = action.payload
        },
        inftCostLoaded:(state,action)=>{
            state.cost = action.payload
        },
        inftSupplyUpdated:(state,action)=>{
            state.supply = action.payload
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
        },
        withdrawRequest:(state, action)=>{
            state.withdrawing.isWithdrawing = true
            state.withdrawing.isSuccess = false
            state.withdrawing.transactionHash = null
        },
        withdrawSuccess:(state, action)=>{
            state.withdrawing.isWithdrawing = false
            state.withdrawing.isSuccess = true
            state.withdrawing.transactionHash = action.payload
        },
        withdrawFail:(state, action)=>{
            state.withdrawing.isWithdrawing = false
            state.withdrawing.isSuccess = false
            state.withdrawing.transactionHash = null
        }
        
    }
})

export const { setInftContract, setOwner, inftBalanceLoaded, inftCostLoaded, inftSupplyUpdated, mintRequest, mintSuccess, mintFail,withdrawRequest, withdrawSuccess, withdrawFail, inftDepositsLoaded } = inft.actions;

export default inft.reducer;