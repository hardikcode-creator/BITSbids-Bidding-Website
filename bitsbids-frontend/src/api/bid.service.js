import app from "./tokenanderror.service";
const APP_URI = "http://localhost:9010";
const placeBid = (itemId,amount) => {
  return app.post(APP_URI+"/placeBid",{
    "itemId":itemId,
    "bidAmount":amount
  });

}
const getAllBids=(term,maxPrice,pageNo,pageSize)=>{
  return app.post(APP_URI+"/getAllBids/"+pageNo,null,
    {
    params: {
      term,
      maxPrice,
      pageSize
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }
  );
}
const getWinCount  =()=>{
    return app.get(APP_URI+"/getCountForWins");
}
const getAllBidsItems=()=>{
  return app.get(APP_URI+"/getAllBidsForItems");

}

const getWinsBids=()=>{
  return app.get(APP_URI+"/getAllWinBidsForItems")
}

const getWinBids=()=>{
  return app.get(APP_URI+"/getWinBids");
}
const BidService = {
    placeBid,
    getAllBids,
    getAllBidsItems,
    getWinCount,
    getWinsBids,
    getWinBids
};
export default BidService;