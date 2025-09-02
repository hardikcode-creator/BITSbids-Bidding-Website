package com.bitsbids.bits_bids.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.core.annotation.MergedAnnotations.Search;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bitsbids.bits_bids.dto.ItemDTO;
import com.bitsbids.bits_bids.entity.Bid;
import com.bitsbids.bits_bids.entity.Item;
import com.bitsbids.bits_bids.entity.ItemStatus;
import com.bitsbids.bits_bids.entity.User;
import com.bitsbids.bits_bids.entity.WinningBid;
import com.bitsbids.bits_bids.repository.BidRepository;
import com.bitsbids.bits_bids.repository.ItemRepository;
import com.bitsbids.bits_bids.repository.WinningBidRepository;
import com.bitsbids.bits_bids.utility.SearchSpecifications;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserService userService;
    private final BidRepository bidRepository;
    private final WinningBidRepository winningBidRepository;
    private final NotificationService notificationService;
    private ItemDTO toDTO(Item item , User user){
        return ItemDTO.builder()
                .Id(item.getId())
                .name(item.getName())
                .imageUrl(item.getImageUrl())
                .description(item.getDescription())
                .startingPrice(item.getStartingPrice())
                .currentPrice(item.getCurrentPrice())
                .auctionStartTime(item.getAuctionStartTime())
                .auctionEndTime(item.getAuctionEndTime())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .createdById(user.getId())
                .status(item.getStatus())
                .build();
    }
    private Item toEntity(ItemDTO itemDTO, User user){
        return Item.builder()
                .Id(itemDTO.getId())
                .name(itemDTO.getName())
                .imageUrl(itemDTO.getImageUrl())
                .description(itemDTO.getDescription())
                .startingPrice(itemDTO.getStartingPrice())
                .currentPrice(itemDTO.getCurrentPrice())
                .auctionStartTime(itemDTO.getAuctionStartTime())
                .auctionEndTime(itemDTO.getAuctionEndTime())
                .createdBy(user)
                .status(itemDTO.getStatus())
                .build();
    }
    public ItemDTO addItem(ItemDTO itemDTO) throws IllegalArgumentException {
            if( itemDTO.getAuctionEndTime()!=null && itemDTO.getAuctionStartTime()!=null &&  itemDTO.getAuctionStartTime().isAfter(itemDTO.getAuctionEndTime())
                    || itemDTO.getStartingPrice()<0 || (itemDTO.getCurrentPrice() != null && itemDTO.getCurrentPrice()< itemDTO.getStartingPrice())) {
                throw new IllegalArgumentException("Auction start time must be before auction end time");
            }
            if(itemDTO.getAuctionStartTime().isBefore(LocalDateTime.now()))
            {
                throw new IllegalArgumentException("Auction must start in future time");
                
            }
            if(itemDTO.getAuctionEndTime()!=null && itemDTO.getAuctionStartTime()!=null && itemDTO.getAuctionStartTime().until(itemDTO.getAuctionEndTime(), ChronoUnit.MINUTES)<5){
                throw new IllegalArgumentException("Auction duration must be at least 5 minutes");
            }
            itemDTO.setStatus(ItemStatus.SCHEDULED);
            User user = userService.getCurrentUser();
            Item item  = itemRepository.save(toEntity(itemDTO,user));
            return toDTO(item,user);

    }

    // We will add Scheduler to Update the status of the item

    @Scheduled(fixedDelay = 5*60000)
    @Transactional
    public void updateItemStatus(){
        log.info("Running scheduled task to update item status");
        List<Item> items = itemRepository.findAll();
        for (Item item : items){
           
            if(item.getStatus() == ItemStatus.SCHEDULED && item.getAuctionStartTime().isBefore(LocalDateTime.now())){
                item.setStatus(ItemStatus.ACTIVE);
            } else if(item.getStatus() == ItemStatus.ACTIVE && item.getAuctionEndTime().isBefore(LocalDateTime.now())){
                item.setStatus(ItemStatus.COMPLETED);
                Optional<Bid> lastbid = bidRepository.findTopByItemIdOrderByCreatedAtDesc(item.getId());
                if(lastbid.isPresent()){
                    WinningBid winningBid = new WinningBid();
                    winningBid.setItem(item);
                    winningBid.setWinningBid(lastbid.get());
                    lastbid.get().setWinningBid(true);
                    bidRepository.save(lastbid.get());
                   winningBidRepository.save(winningBid);
                    notificationService.sendWinNotification(winningBid);
                }
                
            }
            itemRepository.save(item);
        }
    }

  

    public ItemDTO cancelItem(Long itemId){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User not authenticated");
        }
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        
        Item cancelleditem = null;
        if(item.getStatus() == ItemStatus.ACTIVE || item.getStatus() == ItemStatus.SCHEDULED) {
            item.setStatus(ItemStatus.CANCELLED);
            cancelleditem    =  itemRepository.save(item);
        }
        else{
            throw new IllegalArgumentException("Item cannot be cancelled as it is already completed or cancelled");
        }
       
        
       return toDTO(cancelleditem, item.getCreatedBy());
    }

    public List<ItemDTO> getAllWinnningItems(){
            User user = userService.getCurrentUser();
            List<WinningBid> winningBids = winningBidRepository.findByItemId(user.getId());
            return winningBids.stream()
                    .map(winningBid -> toDTO(winningBid.getItem(), winningBid.getItem().getCreatedBy()))
                    .toList();
    }
    public List<ItemDTO> getItems(int pageNo , ItemStatus status, Double maxPrice, Double maxStartPrice, String term, String [] sortBy) {
        int pageSize = 6;

        List<Sort.Order> sortOrders = Arrays.stream(sortBy)
                .map(s -> {
                    String[] parts = s.split(",");
                    String property = parts[0];
                    String direction = parts.length > 1 ? parts[1].trim().toUpperCase() : "ASC";
                    return new Sort.Order(Sort.Direction.fromString(direction), property);
                }).collect(Collectors.toList());
        
        Pageable pageable = PageRequest.of(pageNo, pageSize,Sort.by(sortOrders));
        Specification<Item>spec = Specification.where(null);
        spec = spec.and(SearchSpecifications.hasStatus(status));
        spec = spec.and(SearchSpecifications.maxCurrentPrice(maxPrice));
        spec = spec.and(SearchSpecifications.maxStartingPrice(maxStartPrice));
        spec = spec.and(SearchSpecifications.fullTextSearch(term));

        List<Item> items = itemRepository.findAll(spec,pageable).getContent();
        return items.stream()
                .map(item-> toDTO(item, item.getCreatedBy()))
                .toList();

    }
    
 
}
