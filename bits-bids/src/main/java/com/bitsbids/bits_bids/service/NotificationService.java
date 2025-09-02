package com.bitsbids.bits_bids.service;
import org.springframework.stereotype.Service;

import com.bitsbids.bits_bids.entity.Bid;
import com.bitsbids.bits_bids.entity.Item;
import com.bitsbids.bits_bids.entity.User;
import com.bitsbids.bits_bids.entity.WinningBid;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Service
public class NotificationService {

    private final EmailService emailService;

    public void sendWinNotification(WinningBid winningBid){
            
        Item item = winningBid.getItem();
        Bid bid = winningBid.getWinningBid();
        User user = bid.getUser();
        String body  = "Congratulation "+user.getFullName()+"\nYou have won the auction for item: " + item.getName() + 
                       ".\nWinning Bid Amount: " + bid.getAmount() + 
                       ".\nAuction Ended At: " + item.getAuctionEndTime().toLocalTime() +
                       "\n "+item.getAuctionEndTime().toLocalDate() +
                       ".\nItem Description: " + item.getDescription() +
                       ".\nThank you for participating!";
    
        emailService.sendEmail(user.getEmail(), "Congratulations! You've won the auction", body);

    }
}
