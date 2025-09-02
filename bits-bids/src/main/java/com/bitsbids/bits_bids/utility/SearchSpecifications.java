package com.bitsbids.bits_bids.utility;

import org.springframework.data.jpa.domain.Specification;

import com.bitsbids.bits_bids.entity.Item;
import com.bitsbids.bits_bids.entity.ItemStatus;

import jakarta.persistence.criteria.Predicate;

public class SearchSpecifications {
    public static Specification<Item> hasStatus(ItemStatus status){
     return  (root,query,cb)->{
            if(status == null)
            {
                return cb.conjunction();
            }
        return     cb.equal(root.get("status"), status);
        };

    }
    public static Specification<Item> maxCurrentPrice(Double maxPrice){
        return (root,query,cb)->{
            if(maxPrice == null )
            {
                return cb.conjunction();
            }

            return cb.or(
                cb.isNull(root.get("currentPrice")),
             cb.lessThanOrEqualTo(root.get("currentPrice"), maxPrice)
            );
        };
    }
    public static Specification<Item> maxStartingPrice(Double maxPrice){
        return (root,query,cb)->{
            if(maxPrice == null || root.get("startingPrice") == null)
            {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("startingPrice"), maxPrice);
        };
    }
    public static Specification<Item>fullTextSearch(String term)
    {
        
        return (root, query, cb) -> {
            if(term == null || term.trim().isEmpty()) {
                return cb.conjunction();
            }
            String pattern = "%" + term.toLowerCase().trim() + "%";
            Predicate nameLike = cb.like(cb.lower(root.get("name")), pattern);
            Predicate descLike = cb.like(cb.lower(root.get("description")), pattern);
            return cb.or(nameLike, descLike);
        };
    }
    
}
