import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import BidService from "../api/bid.service";

export default function WinLossPieChart() {
  const [chartData, setChartData] = useState([]);
  const [totalBids,setTotalBids] = useState(0);

  // 🎨 Theme Colors
  const COLORS = ["#00C49F", "#FF6B6B"];

  useEffect(() => {
    setTimeout(() => {

     fetchWinCount();
     
    }, 1000);
  }, []);

  const fetchWinCount=async()=>{
  
  try{
   const {data} = await  BidService.getWinCount();
    
      setChartData([
        { name: "Wins", value: data.win_count },
        { name: "Losses", value: data.loss_count }
      ]);
      setTotalBids(Number(data.win_count)+Number(data.loss_count))
  }
   catch(error)
  {
    const message = error?.response?.data?.message?error.response.data.message:"Error Fetching Win Count";
    toast.error(message);
  }

  }


  const tooltipFormatter = (value, name) => {
    const percentage = ((value / totalBids) * 100).toFixed(1);
    return [`${value} (${percentage}%)`, name];
  };

  return (
    <div
      style={{
        backgroundColor: "#151515",
        border: "1px solid #8e26d3ff",
        borderRadius: "24px",
   
        padding: "20px",
     
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>Win / Loss % </h2>
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={120} // larger donut
          outerRadius={150} // larger outer ring
          stroke="none"
          paddingAngle={4}
          dataKey="value"
          animationBegin={0}
          animationDuration={1500}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index]}
              strokeWidth={0}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={tooltipFormatter}
          contentStyle={{
             backgroundColor: "#151515",
        border: "3px solid #2563EB",
          }}
        />
      </PieChart>
    </div>
  );
}
