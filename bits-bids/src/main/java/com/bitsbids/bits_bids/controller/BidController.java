package com.bitsbids.bits_bids.controller;

import java.util.List;
import java.util.Map;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bitsbids.bits_bids.dto.BidDTO;
import com.bitsbids.bits_bids.dto.ItemDTO;
import com.bitsbids.bits_bids.entity.Bid;
import com.bitsbids.bits_bids.entity.ItemStatus;
import com.bitsbids.bits_bids.service.BidService;
import com.bitsbids.bits_bids.service.ItemService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BidController{

    private final ItemService itemService;
    
    private final BidService bidService;

    
    @PostMapping("/placeBid")
    public ResponseEntity<Map<String,Object>> placeBid(@RequestBody BidDTO bidDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized access"));
            }
            BidDTO placedBid = bidService.placeBid(bidDTO);
            return ResponseEntity.ok(Map.of("bid", placedBid));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while placing the bid"));
        }
    }

    @PostMapping("/getAllBids/{pageNo}")
        public ResponseEntity<Map<String,Object>>getBidsForUser(@PathVariable int pageNo , @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) String term , @RequestParam(required = false , defaultValue = "6") Integer pageSize)
        {
            try{
                    
                return ResponseEntity.ok(Map.of("bids",bidService.findByUserId(pageNo,maxPrice,term,pageSize)));
            }
            catch(Exception e )
            {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message",e.getMessage()));
            }

        }

    @GetMapping("/getBidsForItem/{itemId}")
    public ResponseEntity<Map<String, Object>> getBidsForItem(@PathVariable Long itemId) {
        try {
            return ResponseEntity.ok(Map.of("bids", bidService.getBidsForItem(itemId)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while fetching bids for the item"));
        }
    }

    @GetMapping("/getAllWinItems")
    public ResponseEntity<Map<String, Object>> getAllWinningItems() {
        try {
            return ResponseEntity.ok(Map.of("winningItems", itemService.getAllWinnningItems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while fetching winning bids"));
        }
    }

    @PostMapping("/getItems/{pageNo}")
    public ResponseEntity<List<ItemDTO>> getItems(
        @PathVariable int pageNo,
        @RequestParam(required = false) ItemStatus status,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) Double maxStartPrice,
        @RequestParam(required = false) String term,
        @RequestParam(defaultValue = "auctionEndTime,asc currentPrice,desc") String sortBy) {
        try {
           System.out.println(status+" "+maxPrice+" "+maxStartPrice+" "+term+" "+sortBy);
            String[] sortByArray = sortBy.trim().split("\\s+");
           
            return ResponseEntity.ok(itemService.getItems(pageNo, status, maxPrice, maxStartPrice, term, sortByArray));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getAllBidsForItems")
    public ResponseEntity<Map<String,Object>>getAllBidsForItems(){
        try{
                List<BidDTO>bids = bidService.getBidsByCurrentUser();
                return ResponseEntity.ok(Map.of("bids",bids));
        }
        catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message",e.getMessage()));
        }
    }


    @GetMapping("/getCountForWins")
    public ResponseEntity<Map<String,Object>>getAllWinsCount(){

        try{
               Map<String,Object> result_map =  bidService.getAllWinsCount();
              return ResponseEntity.ok(result_map);
        }
        catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Error Fetching Wins Percentage"));
        }
    }

        @GetMapping("/getAllWinBidsForItems")
    public ResponseEntity<List<Map<String,Object>>>getAllWinBids(){
        try{
                List<Map<String,Object>>bids = bidService.getWinBidsPerItem();
                return ResponseEntity.ok(bids);
        }
        catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of(Map.of("message","Error Fetching Bids For Items ")));
        }
    }

    @GetMapping("/getWinBids")
    public ResponseEntity<Map<String,?>>getWinBids(){
        try{
            List<BidDTO>bids  =bidService.getWinBids();
            return ResponseEntity.ok(Map.of("bids",bids));
        }
        catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Error Fetching Bids for Bidding Pattern"));
        }
    }
    
    
}