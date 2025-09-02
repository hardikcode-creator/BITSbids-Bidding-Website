package com.bitsbids.bits_bids.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bitsbids.bits_bids.dto.AuthDTO;
import com.bitsbids.bits_bids.dto.UserDTO;
import com.bitsbids.bits_bids.entity.User;
import com.bitsbids.bits_bids.repository.UserRepository;
import com.bitsbids.bits_bids.service.UserService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    @Value("${upload-dir}")
    private  String uploadDir;
    @PostMapping("/register")
    public ResponseEntity<Map<String,Object>> registerUser(@RequestBody UserDTO userDTO) {
        try{
        UserDTO registeredUser = userService.registerUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("user",registeredUser));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",e.getMessage()));
        }
    }
    @GetMapping("/activate")
    public ResponseEntity<String>activateAccount(@RequestParam("token") String token) {
       
        boolean isActivated = userService.activateUser(token);
        if (isActivated) {
            return ResponseEntity.ok("Account activated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid activation token");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> loginUser(@RequestBody AuthDTO  authDTO) {
        
        try{
                if(!userService.isAccountActive(authDTO.getEmail())){
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        Map.of("message", "Account is not active or registered.")
                    );
                }
                Map<String,Object> loggedinUser = userService.authenticateaAndGenerateToken(authDTO);
                return ResponseEntity.ok(loggedinUser);

        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message",e.getMessage()));
        }
    }
    @PostMapping("/profileupload/{fullName}")
    public ResponseEntity<Map<String,String>>uploadProfilePic(@PathVariable String fullName , @RequestParam(value = "file", required = false) MultipartFile file)throws IOException
    {   
           try{
                     if (file == null) {
                        System.out.println("File is empty");
            return ResponseEntity.badRequest().body(Map.of("message","No file provided."));
        }

        // Empty check
        if (file.isEmpty()) {
            System.out.println("File is 0 size");
            return ResponseEntity.badRequest().body(Map.of("message","Uploaded file is empty."));
        }

               Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "profile-images"));
        String imageUrl = uploadResult.get("secure_url").toString();
            User user = userService.getCurrentUser();
            user.setProfilePictureUrl(imageUrl);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("imageUrl",imageUrl));
           }
           catch(Exception e) 
           {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message",e.getMessage()));
           }
    }

    // @GetMapping("/getUser")
    // public ResponseEntity<Map<String,Object>>getUserDetails(@RequestBody String email)
    // {
    //     try{
    //         if(!userService.isAccountActive(email)){
    //              return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
    //                     Map.of("message", "Account is not active or registered.")
    //                 );
    //         }
    //         UserDTO user = userService.getUserDTO(email);
    //         return ResponseEntity.ok(Map.of("user",user));

    //     }
    //     catch(Exception e){
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message",e.getMessage()));
    //     }
    // }
}
