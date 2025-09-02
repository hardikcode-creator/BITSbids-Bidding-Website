package com.bitsbids.bits_bids.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDTO {
    private String fullName;
    private String email;
    private String profilePictureUrl;
    private LocalDateTime createdAt;
    private Double balance;


}
