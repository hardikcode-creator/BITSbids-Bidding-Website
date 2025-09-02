import React, { useState } from 'react'
import styles from "./Navbar.module.css"
import { Link, useLocation } from "react-router";
import {assets} from "../assets/frontend_assets/assets";
import userService from '../api/user.service';
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/userSlice";
import { FaRegUser } from "react-icons/fa";
import { sortActions } from '../store/sortSlice';
const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((store)=>store.user);
  const location = useLocation();
  const handleLogout=()=>{
    userService.logout();
    dispatch(userActions.removeUser());
  }
  return (
    <div className={styles['navbar']}>
        <Link  to ="/">
        <img  className={styles['logo']} src={assets.logo} alt="Logo" />
        </Link>
        <ul className={styles['navbar-list']}>
            <Link to="/" onClick={()=>{dispatch(sortActions.resetFilters());}} className={location.pathname==="/"?styles['active']:null}>Home</Link>
          {user.role==='ROLE_USER'? <> <Link to="/bids" onClick={()=>{
              dispatch(sortActions.resetFilters());
            }} className={location.pathname==="/bids"?styles['active']:null}>All Bids</Link>
           </>
            :  <Link to="/users"  className={location.pathname==="/users"?styles['active']:null} >Manage Users</Link>
          }
          {user.role==="ROLE_USER"?  <Link to="/winning" className={location.pathname==="/winning"?styles['active']:null}>All Winnings</Link> : <Link to="/addItem" className={location.pathname==="/addItem"?styles['active']:null}>Add Item</Link>
          }
        </ul>
        <div className={styles['navbar-right']}>
         <Link to=  {user.role==="ROLE_USER"?"/winning":"/users"} className={styles['navbar-wallet']} >
            <span className={styles['wallet-content']}>
              <img className={styles['wallet-icon']} src={assets.coin} alt="wallet" />
              {user.balance}
            </span>
          </Link>
            <Link to="/login" className={styles['navbar-button']} onClick={(e)=>handleLogout(e)}>Logout</Link>
           <Link to="/profile" className={styles['navbar-profile']} >
           <FaRegUser/>
           </Link>
          

        </div>
    </div>
  )
}

export default Navbar