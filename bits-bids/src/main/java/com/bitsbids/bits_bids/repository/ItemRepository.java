package com.bitsbids.bits_bids.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bitsbids.bits_bids.entity.Item;
import com.bitsbids.bits_bids.entity.ItemStatus;

public interface ItemRepository extends JpaRepository<Item, Long> , JpaSpecificationExecutor<Item> {
    // Additional query methods can be defined here if needed
     
    List<Item> findByStatus(ItemStatus status, Pageable pageable);
    Page<Item> findAll(Specification<Item> spec, Pageable pageable);
}
