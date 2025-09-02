package com.bitsbids.bits_bids.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bitsbids.bits_bids.entity.WinningBid;

public interface WinningBidRepository extends JpaRepository<WinningBid, Long> {
    
   
    @Query("SELECT w FROM WinningBid w WHERE w.item.id = :itemId")
    List<WinningBid> findByItemId(@Param("itemId") Long itemId);
    
    // Other repository methods can be defined as needed
    
}
