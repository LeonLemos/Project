import { createSlice } from "@reduxjs/toolkit"

export const nftliser = createSlice ({
    name:'nftliser',
    initialState: {
        contract:null,
        balanceOf:0,
        deposits:0,
        cost:0,
        supply:0,
        minting:{
            isMinting:false,
            isSuccess:false,
            transactionHash: null
        }
    },
    reducers: {
        setNftliserContract:(state, action)=>{
            state.contract = action.payload
        },
        nftliserBalanceLoaded:(state, action)=>{
            state.balanceOf = action.payload
        },
        nftliserDepositsLoaded:(state, action)=>{
            state.deposits = action.payload
        },
        nftliserCostLoaded:(state, action)=>{
            state.cost = action.payload
        },
        nftliserSupplyUpdated:(state, action)=>{
            state.supply = action.payload
        },
        mint2Request:(state, action)=>{
            state.minting.isMinting = true
            state.minting.isSuccess = false
            state.minting.transactionHash = null
        },
        mint2Success:(state, action)=>{
            state.minting.isMinting = false
            state.minting.isSuccess = true
            state.minting.transactionHash = action.payload
        },
        mint2Fail:(state, action)=>{
            state.minting.isMinting = false
            state.minting.isSuccess = false
            state.minting.transactionHash = null
        }
    }
})

export const { setNftliserContract, nftliserBalanceLoaded, nftliserDepositsLoaded, nftliserCostLoaded, nftliserSupplyUpdated, mint2Request, mint2Success, mint2Fail } = nftliser.actions;

export default nftliser.reducer;