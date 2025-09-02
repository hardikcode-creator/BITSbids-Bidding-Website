import { createSlice } from "@reduxjs/toolkit";

const bidSlice = createSlice({
    name:"bids",
    initialState:[],
    reducers:{
        addInitialBids:(state,action)=>{
            
            return action.payload;
        }
        
    }
});
export default bidSlice;
export const bidActions = bidSlice.actions;