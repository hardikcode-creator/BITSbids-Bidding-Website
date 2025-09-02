import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    term:"",
    pageNo:0,
    status:"ACTIVE",
    sortBy:"auctionEndTime,asc",
    maxPrice:5000,
    maxStartPrice:5000
}

const sortSlice = createSlice({
    name:"filters",
    initialState,
    reducers:{
        setSearch:(state,action)=>{state.term = action.payload;},
        setPage:(state,action)=>{state.pageNo=action.payload;},
        setMaxPrice:(state,action)=>{state.maxPrice=action.payload},
        setMaxStartPrice:(state,action)=>{state.maxStartPrice=action.payload},
        setsortBy:(state,action)=>{state.sortBy=action.payload},
        setStatus:(state,action)=>{state.status=action.payload},
        resetFilters: () => initialState

    }
});
export default sortSlice;
export const sortActions = sortSlice.actions;