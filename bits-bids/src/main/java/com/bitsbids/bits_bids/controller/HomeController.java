package com.bitsbids.bits_bids.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    
    @GetMapping("/test")
    public String test(){
        return "BitsBids is running";
    }

    @GetMapping("/health")
    public String healthCheck(){
        return "Yeah you are authorized";
    }

}
