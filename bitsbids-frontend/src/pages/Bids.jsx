import React, { useEffect } from "react";
import styles from "./Bids.module.css";
import { FaTrophy } from "react-icons/fa";
import BidService from "../api/bid.service";
import { useDispatch, useSelector } from "react-redux";
import { bidActions } from "../store/bidSlice";
import {assets} from "../assets/frontend_assets/assets"
import BasicPagination from "../components/BasicPagination";
import SearchandFilter from "../components/SearchandFilter";
const Bids = () => {

  const bids = useSelector((store) => store.bids);
  return (

    <div className={styles['bid-sort-container']}>
  <SearchandFilter bidsPage={true}/>
    <div className={styles["bids-container"]}>
      {bids.length === 0 ? (
        <p className={styles["no-bids"]}>No bids placed yet.</p>
      ) : (
        <div className={styles["bids-list"]}>
          {bids.map((bid) => (
            <div
              key={bid.id}
              className={`${styles["bid-card"]} ${
                bid.winningBid ? styles["winning-bid"] : ""
              }`}
            >
              {/* Image Section */}
              <div className={styles["bid-image"]}>
                <img
                  src={ assets.shoes}
                  alt={bid.itemName}
                />
              </div>

              {/* Content Section */}
              <div className={styles["bid-details"]}>
                <div className={styles["bid-header"]}>
                  <h3 className={styles["item-name"]}>
                    {bid.itemName}{" "}
                    {bid.winningBid && (
                      <FaTrophy className={styles["trophy-icon"]} />
                    )}
                  </h3>
                  <span className={styles["placed-at"]}>
                    Placed at: {new Date(bid.placedAt).toLocaleString()}
                  </span>
                </div>

                <p className={styles["item-description"]}>
                  {bid.itemDescription || "No description available."}
                </p>

                <div className={styles["bid-prices"]}>
                  <span className={styles["price"]}>
                    Price: ₹{bid.bidAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
     <BasicPagination/>
     </div>
  );
};

export default Bids;
