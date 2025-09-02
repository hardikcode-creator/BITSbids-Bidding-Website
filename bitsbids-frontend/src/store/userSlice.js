import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_VALUE=localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{
        fullName:"",
        email:"",
        profilePictureUrl:"",
        role:"ROLE_USER",
        balance:0
    };

const userSlice = createSlice({
    name:"user",
    initialState:DEFAULT_VALUE,
    reducers:{
        removeUser:(state,action)=>{
            localStorage.removeItem("user");
            return {fullName:"",
        email:"",
        profilePictureUrl:"",
        role:"ROLE_USER",
        balance:0};
        },
        addUser:(state,action)=>{
            const {email,fullName,profilePictureUrl,role,balance} = action.payload;
            localStorage.setItem("user",JSON.stringify({
                email,fullName,profilePictureUrl,role,balance
            }))
            return {
                email,fullName,profilePictureUrl,role,balance
            }
        },
        setName:(state,action)=>{
            state.fullName=action.payload;
            localStorage.setItem("user",JSON.stringify(state));
        },
        setBalance:(state,action)=>{
            state.balance=action.payload;
            localStorage.setItem("user",JSON.stringify(state));
        },
        setProfilepic:(state,action)=>{
            state.profilePictureUrl = action.payload;
            localStorage.setItem("user",JSON.stringify(state));
        }
        

    }
});
export default userSlice;
export const userActions = userSlice.actions;