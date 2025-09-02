package com.bitsbids.bits_bids.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.bitsbids.bits_bids.dto.UserInfoDTO;
import com.bitsbids.bits_bids.entity.Role;
import com.bitsbids.bits_bids.entity.User;
import com.bitsbids.bits_bids.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class AdminService {
    private final UserRepository userRepository;
    public List<UserInfoDTO> getAllUsers(){

        List<User>users = userRepository.findAll();
        return users.stream().filter(user->(user.getRole()==Role.ROLE_USER))
                    .map(this::toUserDTO).toList();
    }

    @Transactional
    public boolean deleteUser(String email){
        User user = userRepository.findByEmail(email)
                        .orElseThrow(()->  new RuntimeException("User Not Found"));
        userRepository.delete(user);
        return true;
    }
    private UserInfoDTO toUserDTO(User user)
    {
        return UserInfoDTO.builder()
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .balance(user.getBalance())
                    .profilePictureUrl(user.getProfilePictureUrl())
                    .createdAt(user.getCreatedAt())
                    .build();
    }
}
