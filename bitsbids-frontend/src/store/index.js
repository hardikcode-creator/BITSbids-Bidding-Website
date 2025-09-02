import { configureStore } from "@reduxjs/toolkit";
import itemSlice from "./itemsSlice";
import userSlice from "./userSlice";
import sortSlice from "./sortSlice";
import bidSlice from "./bidSlice";
const bitsbidsStore = configureStore({
    reducer:{
        items:itemSlice.reducer,
        user:userSlice.reducer,
        filters:sortSlice.reducer,
        bids:bidSlice.reducer
    }
});
export default bitsbidsStore;