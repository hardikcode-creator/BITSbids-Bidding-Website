import ProductsService from '../api/products.service';
import { useEffect, useState } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import  { itemActions } from '../store/itemsSlice';
const FetchingItems = () => {
    const dispatch = useDispatch();
    const [fetching,setfetching] = useState(false);
    const [fetched,setfetched] = useState(false);
    const filters = useSelector((store)=>store.filters);
    useEffect(() => {
       
       const interval = setInterval(()=>{
        
            fetchProducts();
       },10000);

        return () => {
            clearInterval(interval);
           
        };
    },[filters]);
    const fetchProducts  = async()=>{
        try{
            setfetching(true);
              const res = await ProductsService.getAllItems(filters.pageNo,filters.term,filters.sortBy,filters.maxPrice,filters.maxStartPrice,filters.status);
      dispatch(itemActions.addInitialItems(res.data));
            setfetched(true);
        } 
        catch (error) {
      if (axios.isCancel(error)) {
        toast.error("Network Error");
      } else {
          console.log(error);
        toast.error("Network Error");
      }
    } finally {
      setfetching(false);
    }

        
    }
 
    return (
    <></>
    )
}

export default FetchingItems