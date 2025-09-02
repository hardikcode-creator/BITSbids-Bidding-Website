package com.bitsbids.bits_bids.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bitsbids.bits_bids.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Additional query methods can be defined here if needed

    Optional<User> findByEmail(String email);
    Optional<User> findByActivationToken(String activationToken);
  
}
