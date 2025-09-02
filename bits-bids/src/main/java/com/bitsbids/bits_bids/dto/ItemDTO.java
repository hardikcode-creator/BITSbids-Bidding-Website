package com.bitsbids.bits_bids.dto;

import java.time.LocalDateTime;

import com.bitsbids.bits_bids.entity.ItemStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemDTO {
    private Long Id;
    private String name;
    private String description;
    private String imageUrl;
    private Double startingPrice;
    private Double currentPrice;
    private Long createdById;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime auctionEndTime;
    private LocalDateTime auctionStartTime;
    private ItemStatus status;
}
