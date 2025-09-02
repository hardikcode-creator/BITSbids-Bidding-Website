import React, { useState } from 'react'
import styles from "./AddBalanceDialog.module.css";
import { toast } from 'react-toastify';
import AdminService from '../api/admin.service';
const AddBalanceDialog = ({isOpen,setIsOpen ,email , fullName,fetchUsers}) => {

    const [amount,setAmount] = useState(100);

      const onAddBalance=async()=>{
        try{

            await AdminService.addBalance(email,amount);
            fetchUsers();
            toast.success("Balance Added Successfully")
            setIsOpen(false);
        }
        catch(e)
        {
            toast.error("Error Adding Balance"+e);
        }
    }
  return (
    <div className={`${styles['dialog-container']}`} style={isOpen?{visibility:'visible'}:{visibility:'hidden'}}>
        <span style={{position:'absolute',right:'10px',cursor:'pointer'}} onClick={()=>setIsOpen(false)}>X</span>
         <h3 style={{textAlign:'center', marginBottom:'1rem'}}>Add Balance</h3>
    <div className={styles['name-email-container']}>
         <div class="mb-3 mx-2">
  <label for="name" class="form-label">Full Name</label>
  <input type="name" className={`${styles['info-field']} form-control`} id="email" value={fullName} readOnly/>
</div>
      <div class="mb-3 w-100">
  <label for="email" class="form-label">Email address</label>
  <input type="email" className={`form-control`} id="email" value={email} readOnly/>
</div>
</div>
 <div class="mb-3 w-50 " >
  <label htmlFor="amount" class="col-form-label">Amount</label>
  <div className={styles["input-with-symbol"]}>
  <span>₹</span>
  <input 
    type="number"
    className={`${styles['info-field']} form-control`} 
    name="amount"
    value={amount}
    onChange={(e)=>setAmount(e.target.value)}
  />
</div>
</div>
<button className={styles['add-btn']} onClick={onAddBalance}>Add Amount</button>
    </div>
  )
}

export default AddBalanceDialog