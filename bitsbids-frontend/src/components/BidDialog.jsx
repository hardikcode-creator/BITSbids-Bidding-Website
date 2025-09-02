import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from "@mui/material";
import styles from "./BidDialog.module.css";
import { toast } from "react-toastify";
export default function BidDialog({ open, onClose, currentPrice, onPlaceBid }) {
  const [bidAmount, setBidAmount] = useState("");

  const handleBidChange = (e) => {
    setBidAmount(e.target.value);
  };

  const handleSubmit = () => {
    if (!bidAmount || isNaN(bidAmount) ||(currentPrice &&  Number(bidAmount) <= currentPrice)) {
      toast.error(`Bid must be greater than current price ${currentPrice}`);
      return;
    }
    onPlaceBid(Number(bidAmount));
    setBidAmount("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
        sx={{
    '& .MuiDialog-paper': {   // Targets dialog container
      backgroundColor: '#1e1e2f',
      borderRadius: '12px',
      border: '2px solid #1976d2',
      padding: '10px',
      color:"#fff"
      
    }
  }}>
      <DialogTitle >Place Your Bid</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Current Price: <strong>₹{currentPrice}</strong>
        </Typography>
        <TextField
          label="Your Bid Amount"
          variant="outlined"
          fullWidth
          value={bidAmount}
          onChange={handleBidChange}
          type="number"
          sx={{
            borderColor: ' #59a3eeff',
            
              // Input text color
             
    '& .MuiInputBase-input': {
      color: '#fff'
    },
    // Placeholder color
    '& .MuiInputBase-input::placeholder': {
      color: '#aaa',
      opacity: 1
    },
    // Label color
    '& .MuiInputLabel-root': {
      color: '#bbb'
    },
          }}
  
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary"
        sx={{

            backgroundColor: "#2A2A2A",
            border: "2px solid #2563EB",
            cursor: "pointer",
            color:"#fff",
  transition: "background 0.3s ease, border 0.3s ease",
             "&:hover":{
                  backgroundColor: "#1E40AF",
                  borderColor:" #1E40AF"
             }
        }}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}
         sx={{

            backgroundColor: "#1E40AF",
            borderColor: "#1E40AF",
            cursor: "pointer",
            color:"#fff",
  transition: "background 0.3s ease, border 0.3s ease",
             "&:hover":{
                  backgroundColor: "#4c68c1",
                  border: "1px solid #FFF",
  transform: "translateY(-1px)",
             }
        }}
        
        >
          Place Bid
        </Button>
      </DialogActions>
    </Dialog>
  );
}
