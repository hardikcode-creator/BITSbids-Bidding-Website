import app from "./tokenanderror.service";
const APP_URI = "http://localhost:9010";
const getAllItems = (pageNo, term, sortBy, maxPrice, maxStartPrice, status) => {
  return app.post(APP_URI + '/getItems/' + pageNo, null, {
    params: {
      term,
      sortBy,
      status,
      maxPrice,
      maxStartPrice
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const cancelItem = async(itemId)=>{
  return await app.get(APP_URI+"/admin/cancelItem/"+itemId)
}

const ProductsService = {
    getAllItems,
    cancelItem
};
export default ProductsService;