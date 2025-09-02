package com.bitsbids.bits_bids.dto;

import java.time.LocalDateTime;

import com.bitsbids.bits_bids.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {

    private Long Id;
    private String fullName;
    private String email;
    private String password;
    private String profilePictureUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Double balance;
    private Role role;
}
