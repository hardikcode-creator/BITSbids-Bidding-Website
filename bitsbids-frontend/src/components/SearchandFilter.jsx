import React, { useRef , useState} from 'react'
import styles from './SearchandFilter.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { sortActions } from '../store/sortSlice';
import ProductsService from '../api/products.service';
import { itemActions } from '../store/itemsSlice';
import {bidActions} from "../store/bidSlice";
import BidService from '../api/bid.service';
import {toast} from "react-toastify";
import { useEffect } from 'react';
import {useLocation} from "react-router-dom";
const SearchandFilter = ({bidsPage}) => {
  const dispatch=useDispatch();
  const filters = useSelector((store)=>store.filters);
  const [maxPrice,setMaxPrice] = useState(5000);
  const [term,setTerm] = useState("");
const updateFilters=()=>{
    dispatch(sortActions.setSearch(term));
  dispatch(sortActions.setMaxPrice(maxPrice));
}

  const handleSort=async()=>{
  try{
    const res = await ProductsService.getAllItems(filters.pageNo,filters.term,filters.sortBy,filters.maxPrice,filters.maxStartPrice,filters.status);
      dispatch(itemActions.addInitialItems(res.data));
  }
  catch(error){
    console.log(error);
    toast.error("Error Fetching Items");
  }
}

useEffect(()=>{
   if(bidsPage==true){
      handleSortBid();
    }
    else{
      handleSort();
    }
},[filters]);

const handleSortBid=async()=>{

    try{
    if(location.pathname.includes("bids")){
    const { data } = await BidService.getAllBids(filters.term,filters.maxPrice,filters.pageNo,5);
    dispatch(bidActions.addInitialBids(data.bids));
    }
    else{
      const {data} = await BidService.getAllBidsItems();
      dispatch(bidActions.addInitialBids(data.bids));
    }
  }
  catch(error)
  {
    const message = error?.response?.data?.message?error.response.data.message:"Error Placing Bid";
    toast.error(message);
  }
  };


    return (
    <div className={styles["search-filter-container"]}>

<div className={styles['search-container']}>
  <input type="text" placeholder="Search items..." className={styles["search-input"]} onChange={(e)=>setTerm(e.target.value)} value={term}/>
  <button className={styles["apply-button"]} onClick={updateFilters}>Apply</button>
</div>

  <div className={styles["filter-group"]}>

    <label htmlFor="maxCurrentPrice">Max Current Price: <span id="currentPriceVal">₹{maxPrice}</span></label>
    <input type="range" min="0" max="5000"  id="maxCurrentPrice" className={styles["slider"]} value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)}/>
  </div>


  {(bidsPage==false)?< div className={styles["filter-group"]} >

    <label htmlFor="maxStartPrice">Max Start Price: <span id="startPriceVal">₹{filters.maxStartPrice}</span></label>
    <input type="range" min="0" max="5000" id="maxStartPrice" className={styles["slider"]}
    value={filters.maxStartPrice}     onChange={(e)=>dispatch(sortActions.setMaxStartPrice(e.target.value))}/>
  </div>:null}
 
{(bidsPage==false)?  <div className={styles["filter-group"]}>
    <label htmlFor="statusSelect">Status:</label>
    <select id="statusSelect" 
      value={filters.status}
    className={styles["status-dropdown"]} onChange={(e)=>{dispatch(sortActions.setStatus(e.target.value))}}>
      <option value="ACTIVE">ACTIVE</option>
      <option value="SCHEDULED">SCHEDULED</option>
      <option value="COMPLETED">COMPLETED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  </div>:null}
</div>

  )
};

export default SearchandFilter;