import React from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import BidService from '../api/bid.service';
import { bidActions } from '../store/bidSlice';
import { useLocation } from 'react-router-dom';
const FetchingBids = () => {
    const location  = useLocation();
      const dispatch = useDispatch();
      const filters  = useSelector((store)=>store.filters);
  useEffect(() => {
       
       const interval = setInterval(()=>{
        
            fetchBids();
       },10000);

        return () => {
            clearInterval(interval);
           
        };
  }, [filters,location.pathname]);

  const fetchBids = async () => {

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
    <></>
  )
}

export default FetchingBids