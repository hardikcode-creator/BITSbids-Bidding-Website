import React, { useState } from 'react'
import styles from "./Product.module.css";
import { FaClock } from "react-icons/fa";
import {assets} from "../assets/frontend_assets/assets"
import { useDispatch, useSelector } from 'react-redux';
import BidDialog from './BidDialog';
import { toast } from "react-toastify"; 
import BidService from '../api/bid.service';
import { userActions } from '../store/userSlice';
import ProductsService from '../api/products.service';
const Product = ({ image,id, title, description ,currentPrice, startPrice, isYourBid, status, timeLeft }) => {
  const status_class = 'status-'+status.toLocaleString();
  const user = useSelector((store)=>store.user);
  const [isDialogOpen,setisDialogOpen]  = useState(false);
  const dispatch = useDispatch();
  const handlePlaceBid=async(amount)=>{
    if(startPrice>amount)
    {
      toast.error("Must be greater than start Price");
      return ;
    }
    if(user.balance<amount )
    {
      toast.error("Add Balance to Account!");
      return ;
    }
    try{
      const data = await BidService.placeBid(id,amount);
      dispatch(userActions.setBalance(user.balance-Number(amount)));

        toast.success("Bid Placed SuccessFully");
    }
    catch(e)
    {
      console.log(e);
      const message = e?.response?.data?.message?e.response.data.message:"Error Placing Bid";
      toast.error(message);
    }


  }
  const cancelItem=()=>{

    try{
      const {data} = ProductsService.cancelItem(id);
      toast.success("Product Cancelled Successfully");
    }
    catch(e)
    {
      const message =  e?.response?.data?.message?e.response.data.message:"Something went wrong while cancelling the item ";
      toast.error(message);
    }
  }
  return (

    <>
    <div className={styles['item-container']}>
        <div className={styles['item-image-container']}>
            <img className={styles['item-image']} src={image?image:assets.item_img}/>
            {(isYourBid==true) && <span className={`${styles["tag"]} ${styles['your-bid']}`}>Your Bid</span>}
            { status
             && <span className={`${styles["tag"]} ${styles[status_class.toLowerCase()]}`}
            >{status}</span>}
            </div>
        <div className={styles['item-info']}>
            <h3 className={styles['item-title']}>{title}</h3>
            <div className={styles['price-bid-container']}>
            <div className={styles['current-price']}><span>{currentPrice?'₹ '+currentPrice.toLocaleString():" -"}</span></div>
            {user.role ==='ROLE_USER'?
            ((status==='ACTIVE')?<button className={styles["add-bid-btn"]} onClick={()=>setisDialogOpen(true)}>Add Bid</button>:null)
            :(status==='ACTIVE'||status==='SCHEDULED')?<button onClick={cancelItem} className={styles["cancel-item-btn"]}>Cancel</button>:null}
            </div>
            <p className={styles['start-price']}>Start Price: ₹{startPrice.toLocaleString()}</p>
            <p className={styles['descrption']}>{description}</p>
        </div>
        {<div className={styles['time-left']} >
          <FaClock className={styles['clock-icon']}/>
          {timeLeft}
        </div>}
    </div>
    <BidDialog 
       open={isDialogOpen}
        onClose={() => setisDialogOpen(false)}
        currentPrice={currentPrice}
        onPlaceBid={handlePlaceBid}/>
    </>
  )
}

export default Product;


