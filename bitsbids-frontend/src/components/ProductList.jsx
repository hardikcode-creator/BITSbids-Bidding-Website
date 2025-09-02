import Product from "./Product";
import styles from "./ProductList.module.css";
import { useSelector } from 'react-redux';
import SortBy from "./SortBy";
import BasicPagination from "./BasicPagination";
const ProductList = () => {

  const items = useSelector((store)=>(store.items));
  const bids = useSelector((store)=>(store.bids));
const handleTimeLeft = (status,endTime,starttime) => {
  const now = Date.now(); // timestamp in ms
  const end = new Date(endTime).getTime(); // timestamp in ms
  const start = new Date(starttime).getTime();
  let diffMs = end - now; // can be negative if expired
  let diffStart = start - now;
  if(status==="SCHEDULED")
  {
   const days = Math.floor(diffStart / (1000 * 60 * 60 * 24));
  diffStart %= (1000 * 60 * 60 * 24);

  const hours = Math.floor(diffStart / (1000 * 60 * 60));
  diffStart %= (1000 * 60 * 60);

  const minutes = Math.floor(diffStart / (1000 * 60));
  diffStart %= (1000 * 60);

  const seconds = Math.floor(diffStart / 1000);
  return seconds<0?"SCHEDULING":`${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  if (diffMs <= 0) {
    return "Expired";
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  diffMs %= (1000 * 60 * 60 * 24);

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  diffMs %= (1000 * 60 * 60);

  const minutes = Math.floor(diffMs / (1000 * 60));
  diffMs %= (1000 * 60);

  const seconds = Math.floor(diffMs / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
const yourBid=(itemId,currentPrice,bids)=>{

  for(let bid of bids)
  {
    if(bid.itemId === itemId && bid.bidAmount == currentPrice)
    {
      return true;
    }
  
  }
  return false;
}
  return (
    <div className={styles['product-sort-container']}>
    <SortBy></SortBy>
    <div className={styles['productlist']}>
        {items.map((item)=>(<Product key={item.id} image={item.imageUrl} id={item.id} title={item.name} description={item.description} currentPrice={item.currentPrice} startPrice={item.startingPrice} isYourBid={yourBid(item.id,item.currentPrice,bids)} status={item.status} timeLeft={handleTimeLeft(item.status,item.auctionEndTime,item.auctionStartTime)}/>))}
    </div>
    <BasicPagination/>
    </div>
  )
}

export default ProductList