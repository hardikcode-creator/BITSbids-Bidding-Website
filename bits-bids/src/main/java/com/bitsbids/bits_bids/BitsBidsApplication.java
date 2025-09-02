package com.bitsbids.bits_bids;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@EnableScheduling
@SpringBootApplication
public class BitsBidsApplication {

	public static void main(String[] args) {
		SpringApplication.run(BitsBidsApplication.class, args);
	}

}
