package com.bitsbids.bits_bids.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    private Long Id;
    @Column(nullable = false)
    private String name;
    private String description;
    private String imageUrl;
    private Double startingPrice;
    private Double currentPrice;
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    private LocalDateTime auctionEndTime;
    private LocalDateTime auctionStartTime;
    @Enumerated(EnumType.STRING)
    private ItemStatus status;

    @PrePersist
    public void defaultHandler(){
        if(this.status == null){
            this.status = ItemStatus.SCHEDULED;
        }
        if(this.auctionStartTime == null){
            this.auctionStartTime = LocalDateTime.now().plusMinutes(5);
        }
        if(this.auctionEndTime == null){
            this.auctionEndTime = LocalDateTime.now().plusDays(1);
        }


    }

}
