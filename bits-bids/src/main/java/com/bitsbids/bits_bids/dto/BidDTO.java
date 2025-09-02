package com.bitsbids.bits_bids.dto;

import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BidDTO {
    private Long Id;
    private Double bidAmount;
    private Long itemId;
    private Long placedById;
    private String itemName;
    private String itemDescription;
    private String imageUrl;
    private LocalDateTime placedAt;
    private boolean isWinningBid;
}
