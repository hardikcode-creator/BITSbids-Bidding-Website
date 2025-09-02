package com.bitsbids.bits_bids.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.jaxb.SpringDataJaxb.PageRequestDto;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bitsbids.bits_bids.dto.BidDTO;
import com.bitsbids.bits_bids.dto.UserDTO;
import com.bitsbids.bits_bids.entity.Bid;
import com.bitsbids.bits_bids.entity.Item;
import com.bitsbids.bits_bids.entity.ItemStatus;
import com.bitsbids.bits_bids.entity.User;
import com.bitsbids.bits_bids.repository.BidRepository;
import com.bitsbids.bits_bids.repository.ItemRepository;
import com.bitsbids.bits_bids.repository.UserRepository;
import com.bitsbids.bits_bids.utility.SearchSpecificationBids;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BidService {
    
        private final ItemRepository itemRepository;
        private final BidRepository bidRepository;
        private final UserService userService;
        private final UserRepository userRepository;
        private BidDTO toDTO(Bid bid){
           
                return BidDTO.builder()
                        .Id(bid.getId())
                        .bidAmount(bid.getAmount())
                        .itemId(bid.getItem().getId())
                        .placedById(bid.getUser().getId())
                        .placedAt(bid.getPlacedAt())
                        .itemName(bid.getItem().getName())
                        .itemDescription(bid.getItem().getDescription())
                        .imageUrl(bid.getItem().getImageUrl())
                        .isWinningBid(bid.isWinningBid())
                        .build();
        }

        private Bid toEntity(BidDTO bidDTO, Item item , User user){
                return Bid.builder()
                        .amount(bidDTO.getBidAmount())
                        .item(item)
                        .user(user)
                        .placedAt(LocalDateTime.now())
                        .build();
        }

        public BidDTO placeBid(BidDTO bidDTO) throws IllegalArgumentException {
                System.out.println("Placing bid: " + bidDTO);
                Item item  = itemRepository.findById(bidDTO.getItemId())
                        .orElseThrow(() -> new IllegalArgumentException("Item not found"));
             User user = userService.getCurrentUser();
                
                        if(item.getStatus() != ItemStatus.ACTIVE) {
                    throw new IllegalArgumentException("Item is not active for bidding");   
         }   
                if(bidDTO.getBidAmount()!=null && item.getCurrentPrice() != null && bidDTO.getBidAmount() <= item.getCurrentPrice()) {
                    throw new IllegalArgumentException("Bid amount must be greater than current price");
                }
                if(bidDTO.getBidAmount()>user.getBalance())
                {
                    throw new IllegalArgumentException("Add Balance to Account!");
                }
                if(item.getAuctionEndTime().isBefore(LocalDateTime.now())) {
                    throw new IllegalArgumentException("Auction has already ended");
                }
                
                user.setBalance(user.getBalance()-bidDTO.getBidAmount());
                item.setCurrentPrice(bidDTO.getBidAmount());
                itemRepository.save(item);
                Bid bid = bidRepository.save(toEntity(bidDTO, item, user));
                return toDTO(bid);
        }

    public List<BidDTO> getBidsForItem(Long itemId){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        List<Bid> bids = bidRepository.findByItemId(item.getId());
        return bids.stream().map(this::toDTO).toList();

    }
    public List<BidDTO>findByUserId(int pageNo , Double maxPrice , String term , int pageSize){
        User user = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(pageNo,pageSize);
        Specification<Bid>spec = Specification.where(null);
        spec = spec.and(SearchSpecificationBids.byUserId(user.getId()));
        spec = spec.and(SearchSpecificationBids.maxPrice(maxPrice));
        spec = spec.and(SearchSpecificationBids.fullTextSearch(term));
        List<Bid>bids = bidRepository.findAll(spec,pageable).getContent();
        return bids.stream().map(this::toDTO).toList();
    }
    public List<BidDTO> getBidsByUser(Long userId) {
        User user = userService.getUserById(userId);
        int pageSize = 6;
        Pageable pageable = PageRequest.of(0,pageSize);
        Specification<Bid>spec = Specification.where(null);
        spec = spec.and(SearchSpecificationBids.byUserId(userId));
        List<Bid> bids = bidRepository.findAll(spec,pageable).getContent();

        return bids.stream().map(this::toDTO).toList();
    }
    public List<BidDTO> getBidsByCurrentUser(){
        User user = userService.getCurrentUser();
        List<Bid> bids = bidRepository.findTopBidsByUser(user.getId());
        return bids.stream().map(this::toDTO).toList();
    }

    public List<BidDTO> findByItemId(Long itemId) {
        
        return bidRepository.findByItemId(itemId).stream()
                .map(this::toDTO)
                .toList();
    }

    public UserDTO addBalance(String email, Double amount)
    {
        User user = userRepository.findByEmail(email)
                        .orElseThrow(()-> new RuntimeException("User Not Found"));
        if(amount<=0)
        {
            throw new RuntimeException("Invalid Amount ");

        }
        user.setBalance(user.getBalance()+amount);
        User savedUser = userRepository.save(user);
        return userService.toDTO(savedUser);
    }

      @Scheduled(cron = "0 40 13 * * ?")
    @Transactional
    public void settlePendingTransactions(){
        log.info("Running Scheduler to Settle Pending Transactions");
         List<Object[]> groupedResults = bidRepository.findUnsettledBidsGroupedByUser();


         for (Object[] row : groupedResults) {
        Long userId = (Long) row[0];
        Double totalAmount = (Double) row[1];
        User user = userService.getUserById(userId);
        totalAmount+=user.getBalance();
        user.setBalance(totalAmount);
        userRepository.save(user);       
    }

    // Mark all these bids as settled in one go
    bidRepository.markBidsAsSettled();
    }

    public Map<String,Object> getAllWinsCount()
    {
        User user = userService.getCurrentUser();
        Integer won_count = bidRepository.getWinCount(user.getId());
        Integer total_count  = bidRepository.getTotalCount(user.getId());
        Map<String ,Object>count_map  =  new HashMap<>();
        count_map.put("win_count", won_count);
        count_map.put("loss_count",total_count-won_count);
        return count_map;
    }

    public List<Map<String,Object>> getWinBidsPerItem() {
        User user = userService.getCurrentUser();
        List<Object[]>result = bidRepository.getWinningItems(user.getId());
       List<Map<String, Object>> response = new ArrayList<>();
    for (Object[] row : result) {
        Map<String, Object> itemData = new HashMap<>();
        itemData.put("itemName", row[0]);
        itemData.put("startPrice", row[1]);
        itemData.put("finalPrice", row[2]);
        response.add(itemData);
    }
    return response;
    }

    public List<BidDTO>getWinBids(){
        User user = userService.getCurrentUser();
        List<Bid>bids = bidRepository.getWinBids(user.getId());
        return bids.stream().map(this::toDTO).toList();
    }

}
