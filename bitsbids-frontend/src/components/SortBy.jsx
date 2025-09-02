
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import styles from "./SortBy.module.css";
import { useDispatch, useSelector } from "react-redux";
import { sortActions } from "../store/sortSlice";
const SortBy = () => {
  const filters = useSelector((store)=>store.filters);
  const dispatch = useDispatch();
  const handleFieldChange = (e) => {
    let sortField = filters.sortBy.split(",")[0];
    let  sortOrder = filters.sortBy.split(",")[1];
    sortField = e.target.value;
    dispatch(sortActions.setsortBy(sortField+","+sortOrder));
  };

  const toggleOrder = () => {
   let sortField = filters.sortBy.split(",")[0];
    let sortOrder = filters.sortBy.split(",")[1];
    sortOrder = (sortOrder==='asc')?'desc':'asc';
    dispatch(sortActions.setsortBy(sortField+","+sortOrder));
  };

  return (
    <div className={styles.sortContainer}>
      <label className={styles.label}>Sort by:</label>
      <select
        className={styles.dropdown}
        value={filters.sortBy.split(",")[0]}
        onChange={handleFieldChange}
      >
        <option value="auctionEndTime">Auction End Time</option>
        <option value="currentPrice">Current Price</option>
        <option value="startingPrice">Start Price</option>
        <option value="createdAt">Time</option>
        <option value="auctionStartTime">Auction Start Time</option>
      </select>

      <button className={styles.orderButton} onClick={toggleOrder}>
        {filters.sortBy.split(",")[1].toLowerCase() === "asc" ? <FaArrowUp /> : <FaArrowDown />}
      </button>
    </div>
  );
};

export default SortBy;
