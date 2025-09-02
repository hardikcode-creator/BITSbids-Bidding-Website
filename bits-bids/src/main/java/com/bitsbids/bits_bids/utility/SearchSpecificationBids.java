package com.bitsbids.bits_bids.utility;

import org.springframework.data.jpa.domain.Specification;

import com.bitsbids.bits_bids.entity.Bid;
import com.bitsbids.bits_bids.entity.Item;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class SearchSpecificationBids {
    public static Specification<Bid> byUserId(Long userId) {
    return (root, query, cb) -> cb.equal(root.get("user").get("Id"), userId);
}

    public static Specification<Bid>maxPrice(Double maxPrice){
       return (root,query,cb)->{
        if(maxPrice == null){
                return cb.conjunction();
        }

       

        return cb.or(
            cb.isNull(root.get("amount")),
            cb.lessThanOrEqualTo(root.get("amount"),maxPrice));
       };
    }
    public static Specification<Bid>fullTextSearch(String term){
        return (root,query,cb)->{
            if(term == null||term.trim().isEmpty()){
                return cb.conjunction();
            }
            String pattern = "%"+term.toLowerCase().trim()+"%";
            Join<Bid,Item>itemJoin = root.join("item");
            Predicate nameLike = cb.like(cb.lower(itemJoin.get("name")),pattern);
            Predicate descLike = cb.like(cb.lower(itemJoin.get("description")),pattern);
            return cb.or(nameLike,descLike);
        };
    }

}
