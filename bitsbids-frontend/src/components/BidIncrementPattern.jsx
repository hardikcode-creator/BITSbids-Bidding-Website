import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import BidService from "../api/bid.service"
export default function BidIncrementPattern() {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [itemDict , setitemDict] = useState({}); // Store item names dynamically
  useEffect(() => {
    setTimeout(() => {

     fetchWinCount();
     
    }, 1000);
  }, []);
function getColor(index) {
   const purpleShades = [
    "hsla(280, 90%, 51%, 1.00)", 
     "hsla(128, 38%, 50%, 1.00)", // aqua
    "hsla(166, 58%, 56%, 1.00)",// base purple
   // deeper purple
    "hsla(300, 65%, 69%, 1.00)"  // soft magenta
  ];

  const greenShades = [
    "hsla(160, 91%, 48%, 1.00)", // teal-green
     "hsla(253, 42%, 50%, 1.00)", // lighter purple
    "hsla(255, 47%, 75%, 1.00)", 
    "hsl(140, 60%, 50%)"  // fresh lime-green
  ];

  const palette = [...purpleShades, ...greenShades];
  return palette[index % palette.length];
}

  const fetchWinCount=async()=>{
  
  try{
   const {data} = await  BidService.getWinBids();
   let objData  = {};
   let itemsDict = {};
    data.bids.forEach((bid)=>{

      if(!objData[bid.itemId])
          objData[bid.itemId]=[];
      if(!itemsDict[bid.itemId])
      {
        itemsDict[bid.itemId] = bid.itemName;
      }
       objData[bid.itemId].push({"itemId":bid.itemId,"amount":bid.bidAmount})
    });
  
    const merged = [];
// Loop over each itemId in objData
Object.values(objData).forEach(arr => {
  arr.forEach((bid, idx) => {
    if (!merged[idx]) merged[idx] = { bidStep: idx + 1 };
    merged[idx][bid.itemId] = bid.amount;
  });
});

      setData(merged);
      setItems(Object.keys(itemsDict));
      setitemDict(itemsDict);
  }
   catch(error)
  {
    console.log(error);
    const message = error?.response?.data?.message?error.response.data.message:"Error Fetching Bidding Pattern";
    toast.error(message);
  }

  }

  return (
    <div
      style={{
        backgroundColor: "#151515",
        border: "1px solid #8e26d3ff",
        borderRadius: "24px",
        marginTop: "20px",
        padding: "15px",
        width: "100%",
      }}
    >
      <h2 style={{ color: "#fff", textAlign: "center", marginBottom: "30px" }}>
        Your Bidding Patterns
      </h2>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <LineChart
          width={1000}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 20,bottom:20 }}
        >
          <CartesianGrid stroke="#444" strokeDasharray="3 3" />
          <XAxis
            dataKey="bidStep"
            label={{ value: "Bid Step", position: "insideBottom", fill: "#fff", dy: 10 }}
            stroke="#fff"
          />
          <YAxis
            label={{ value: "Bid Amount (₹)", angle: -90, position: "insideLeft", fill: "#fff" }}
            stroke="#fff"
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#151515",
        border: "3px solid #2563EB", }}
            formatter={(value, name) => [`₹${value}`, name]}
          />
          <Legend wrapperStyle={{ color: "#fff"  }} />

          {items.map((item, idx) => (
            <Line
              key={item}
              type="monotone"
              dataKey={item}
              stroke={getColor(idx)}
              name={itemDict[item]}
              strokeWidth={3}
              dot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
              animationDuration={1500}
            />
          ))}
        </LineChart>
      </div>
    </div>
  );
}
