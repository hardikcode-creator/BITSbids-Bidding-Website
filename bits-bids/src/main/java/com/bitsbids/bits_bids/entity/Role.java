package com.bitsbids.bits_bids.entity;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
public enum Role{

    ROLE_USER,
    ROLE_ADMIN;
    public Collection<? extends GrantedAuthority> getAuthorities() {
       return List.of(new SimpleGrantedAuthority(this.name()));
    }
}