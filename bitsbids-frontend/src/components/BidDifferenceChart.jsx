import React, { useEffect, useState } from "react";
import BidService from "../api/bid.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList
} from "recharts";
import { toast } from "react-toastify";
export default function BidDifferenceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
     fetchBidPriceDifference();
     
    }, 1000);
  }, []);

  const fetchBidPriceDifference=async()=>{
  
  try{
   const {data} = await  BidService.getWinsBids();
    let  chartData = [];
    let   index = 0;
    for(let row of data)
    {
        chartData = [...chartData,{index:index , auction:row.itemName,startPrice:row.startPrice,winningPrice:row.finalPrice}]
        index++;
    }
      setData(chartData);
  }
   catch(error)
  {
    console.log(error);
    const message = error?.response?.data?.message?error.response.data.message:"Error Fetching Bids For winning Items";
    toast.error(message);
  }

  }



  // Add difference to data
const chartData = data;
  // Tooltip formatter
  const tooltipFormatter = (value, name, props) => {

    return [`₹${value}`, name === "startPrice" ? "Start Price" : "Winning Price"];
  };

  return (
    <div
      style={{
        backgroundColor: "#151515",
        border: "1px solid #8e26d3ff",
        borderRadius: "24px",
        padding: "20px",
        flex:1
      }}
    >
      <h2 style={{ color: "#fff", textAlign: "center", marginBottom: "20px" }}>
        Winning vs Start Price
      </h2>

      <BarChart
        width={750}
        height={400}
        data={chartData}
        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="index" stroke="#fff" 
        tickFormatter={(index)=>{
          const item = chartData.find(item=>(item.index===index))
          return item.auction
        }
          }/>
        <YAxis stroke="#fff" />
        <Tooltip
          formatter={tooltipFormatter}
           labelFormatter={(index) => {
    const item = chartData.find((d) => d.index === index);
    return item ? item.auction : "";
  }}
          contentStyle={{  backgroundColor: "#151515",
        border: "3px solid #2563EB",}}
        />
        
        {/* Start Price */}
        <Bar dataKey="startPrice" fill="#8e26d3" radius={[4, 4, 0, 0]} animationDuration={1500}>
          <LabelList dataKey="startPrice" position="top" fill="#fff" formatter={(v) => `₹${v}`} />
        </Bar>
        
        {/* Winning Price */}
        <Bar dataKey="winningPrice" fill="#00C49F" radius={[4, 4, 0, 0]} animationDuration={1500}>
          <LabelList dataKey="winningPrice" position="top" fill="#fff" formatter={(v) => `₹${v}`} />
        </Bar>
      </BarChart>
    </div>
  );
}
