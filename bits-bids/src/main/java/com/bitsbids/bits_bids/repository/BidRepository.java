package com.bitsbids.bits_bids.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.bitsbids.bits_bids.entity.Bid;


import jakarta.transaction.Transactional;

public interface BidRepository extends JpaRepository<Bid, Long>, JpaSpecificationExecutor<Bid> {

    @Query("SELECT b FROM Bid b where b.item.Id = :itemId")
    List<Bid> findByItemId(@Param("itemId") Long itemId);

    Page<Bid> findAll(Specification<Bid> spec, Pageable pageable);

    
    @Query("SELECT b FROM Bid b WHERE b.item.Id = :itemId ORDER BY b.placedAt DESC LIMIT 1")
    Optional<Bid> findTopByItemIdOrderByCreatedAtDesc(@Param("itemId") Long itemId);


    @Query("""
    SELECT b.user.id, SUM(b.amount) 
    FROM Bid b 
    WHERE b.isWinningBid = false AND b.isSettled = false
    GROUP BY b.user.id
""")
List<Object[]> findUnsettledBidsGroupedByUser();

    @Transactional
    @Modifying
    @Query("UPDATE Bid b SET b.isSettled = true WHERE b.isWinningBid = false AND b.isSettled = false")
    void markBidsAsSettled();

   @Query("""
    SELECT b
    FROM Bid b
    WHERE b.user.id = :currentUserId
      AND b.amount = (
          SELECT MAX(b2.amount)
          FROM Bid b2
          WHERE b2.user.id = :currentUserId
            AND b2.item.id = b.item.id
      )
""")
List<Bid> findTopBidsByUser(@Param("currentUserId") Long currentUserId);

  @Query("SELECT SUM(isWinningBid) FROM Bid b WHERE b.user.Id = :Id ")
    Integer getWinCount(@Param("Id") Long Id);

    @Query(" SELECT COUNT(DISTINCT b.item.Id) FROM Bid b   WHERE b.user.Id = :Id AND b.item.status = 'COMPLETED' ")
    Integer getTotalCount(@Param("Id") Long Id);


    @Query("SELECT b.item.name , b.item.startingPrice , b.amount FROM Bid b where b.user.Id = :Id and b.isWinningBid = true")
    List<Object[]> getWinningItems(@Param("Id") Long Id);

    @Query("SELECT b FROM Bid b where b.user.Id = :Id and  b.item.Id IN (SELECT c.item.Id  from Bid c group by c.item.Id , c.user.Id having sum(c.isWinningBid)>0 and c.user.Id = :Id ) ")
    List<Bid>getWinBids(@Param("Id") Long Id);
}
