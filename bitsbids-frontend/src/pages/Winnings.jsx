import React, { useEffect } from 'react'
import styles from "./Winnings.module.css";
import WinLossPieChart from '../components/WinLossPieChart'
import BidDifferenceChart from '../components/BidDifferenceChart'
import BidIncrementPattern from '../components/BidIncrementPattern';
const Winnings = () => {


  // useEffect(()=>{

       
  //      setTimeout(()=>{ 

  //      },1000);

  // },[]);
  return (
    <div className={styles['winning-container']}>
    <WinLossPieChart/>
    <BidDifferenceChart/>
    <BidIncrementPattern/>
    </div>
  )
}

export default Winnings