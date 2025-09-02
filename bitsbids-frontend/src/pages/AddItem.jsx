import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from "./AddItem.module.css";
import { assets } from '../assets/frontend_assets/assets';
import { useState , useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminService from '../api/admin.service';
const AddItem = () => {
    const [minDateTime, setMinDateTime] = useState("");
    const [file,setFile] = useState();
const toDateTimeLocal = (date) => {
  // convert to local time for datetime-local
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

useEffect(() => {
  const now = new Date();

  setMinDateTime(toDateTimeLocal(now));
}, []);



    const handleSubmit=async(e)=>{
    
    try{
        e.preventDefault();
        const formData = new FormData(e.target);
        const auctionStartTime = new Date(formData.get("auctionStartTime"));
        const auctionEndTime = new Date(formData.get("auctionEndTime"));
        const startingPrice = formData.get("startingPrice");
        
        if(startingPrice===null||startingPrice===0)
        {
            toast.error("Start Price Must have some value");
            return ;
        }
        if(!auctionStartTime || !auctionEndTime)
        {
            toast.error("Auction Start and End Time must have some value");
            return ;
        }
        console.log(typeof(auctionStartTime));
        let diffM = (auctionEndTime.getTime()-auctionStartTime.getTime())/1000;
        diffM /= 60;
        if(diffM<=5)
        {
            toast.error("Auction duration must be atleast 5 minutes");
            return ;
        }
       await  AdminService.addItem(formData)
        toast.success("Item Added Successfully");
    }
    catch(error)
    {
        const message = error?.response?.data?.message?error.response.data.message:"Error Adding item";
        toast.error(message);
    }
    }

  return (
    <>
    <Navbar/>
    <form method='post' onSubmit={handleSubmit}>
    <div className={styles['add-item-container']}>
           
            <h3 style={{textAlign:'center',marginBottom:'1.5rem'}}>Add Item</h3>
            <div className={`mb-3`}>
                     <label for="file" class="form-label " >
                        <img style={{height:'50px', width:'50px'}} src={assets.item} alt="Item Image"/>
                     </label>
                    <input type="file" className='form-control' name="file" id="file" style={{display:'none'}} onChange={(e)=>setFile(e.target.value)}/>
            </div>         
            <div className={styles['name-starting-container']}>
               <div className={`mb-3 ${styles['name-container']}`}>
                     <label for="name" class="form-label ">Name</label>
                    <input type="text" name='name' class="form-control" placeholder="Enter Item Name" required/>
            </div>    
             <div className={`mb-3 ${styles['price-container']}`}>
                     <label for="startingPrice" class="form-label ">Start Price</label>
                    <input type="number" name='startingPrice' class="form-control" placeholder="Enter Start Price" required />
            </div>   
            </div>      
             <div className={styles['start-end-container']}>
               <div className={`mb-3 ${styles['start-container']}`}>
                     <label for="auctionStartTime" class="form-label ">Aucton Start Time</label>
                    <input type="datetime-local" name='auctionStartTime' class="form-control" min={minDateTime}/>
            </div>    
             <div className={`mb-3 ${styles['end-container']}`}>
                     <label for="auctionEndTime" class="form-label ">Auction End Time</label>
                    <input type="datetime-local" name='auctionEndTime' class="form-control" min={minDateTime} />
            </div>   
            </div>  
            <div className={`mb-3`}>
                     <label for="description" class="form-label ">Description</label>
                    <textarea rows={5} className='form-control' name='description' placeholder='Enter description about Item'/>
            </div>    
            <button type="submit" className={styles['add-btn']}>
                Add Item
            </button>
              
    </div>
    </form>
    <Footer/>
    
    </>
  );
}

export default AddItem