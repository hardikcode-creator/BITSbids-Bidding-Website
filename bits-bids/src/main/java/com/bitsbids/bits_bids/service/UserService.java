package com.bitsbids.bits_bids.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bitsbids.bits_bids.dto.AuthDTO;
import com.bitsbids.bits_bids.dto.UserDTO;
import com.bitsbids.bits_bids.entity.Role;
import com.bitsbids.bits_bids.entity.User;
import com.bitsbids.bits_bids.repository.UserRepository;
import com.bitsbids.bits_bids.utility.JWTUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    
    @Value("${app.activation-link}")
    private String activationBaseLink;


    public UserDTO registerUser(UserDTO userDTO){
     boolean isEmailExist =   userRepository.findByEmail(userDTO.getEmail())
       .isPresent();
       if(isEmailExist)
       {
        throw new RuntimeException("Email Already Exist");
       }
        User user = toEntity(userDTO);
        user.setActivationToken(UUID.randomUUID().toString());
        user.setRole(Role.ROLE_USER);
        user = userRepository.save(user);
        String activationLink = activationBaseLink + user.getActivationToken();
        String subject = "Activate your BitsBids account";
        String body = "Click the link to activate your account: " + activationLink;
        
        emailService.sendEmail(user.getEmail(), subject, body);
        
        return toDTO(user);

    }

   
    public User toEntity(UserDTO userDTO){
        
        return User.builder()
                .Id(userDTO.getId())
                .fullName(userDTO.getFullName())
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .profilePictureUrl(userDTO.getProfilePictureUrl())
                .balance(userDTO.getBalance())
                .build();
    }

    public UserDTO toDTO(User user){
        return UserDTO.builder()
                .Id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .balance(user.getBalance())
                .role(user.getRole())
                .build();
    }

    public boolean activateUser(String activationToken){
        return userRepository.findByActivationToken(activationToken)
                .map(user -> {
                    user.setActivationToken(activationToken);
                    user.setIsActive(true);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }
    public boolean isAccountActive(String email) {
        return userRepository.findByEmail(email)
                .map(User::getIsActive)
                .orElse(false);
        }

    public User getCurrentUser() throws RuntimeException {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public UserDTO getUserDTO(String email){
        
        User user = null;
        
        if(email == null){

            user = this.getCurrentUser();
        }
       
        else {
            user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        return toDTO(user);

        }


    public Map<String,Object> authenticateaAndGenerateToken(AuthDTO authDTO) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authDTO.getEmail(), authDTO.getPassword()));
        
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwtToken = jwtUtil.generateToken(userDetails);
            
            return Map.of("token",jwtToken,"user",getUserDTO(authDTO.getEmail()));

    }


    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }


    }