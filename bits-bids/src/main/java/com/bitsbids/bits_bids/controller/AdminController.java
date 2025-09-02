package com.bitsbids.bits_bids.controller;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bitsbids.bits_bids.dto.BidDTO;
import com.bitsbids.bits_bids.dto.ItemDTO;
import com.bitsbids.bits_bids.dto.UserDTO;
import com.bitsbids.bits_bids.dto.UserInfoDTO;
import com.bitsbids.bits_bids.service.AdminService;
import com.bitsbids.bits_bids.service.BidService;
import com.bitsbids.bits_bids.service.ItemService;
import com.cloudinary.Cloudinary;
import com.cloudinary.http5.api.Response;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final BidService bidService;
    private final AdminService adminService;
    private final ItemService itemService;
    private final Cloudinary cloudinary;
    @PostMapping("/addItem")
    public ResponseEntity<Map<String,Object>> addItem(@ModelAttribute ItemDTO itemDTO , @RequestParam(value="file",required =false) MultipartFile file){

      try{  
         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","" + "Unauthorized access"));
            }
            
                     if (file == null) {
                        System.out.println("File is empty");
            return ResponseEntity.badRequest().body(Map.of("message","No file provided."));
        }

        // Empty check
        if (file.isEmpty()) {
            System.out.println("File is 0 size");
            return ResponseEntity.badRequest().body(Map.of("message","Uploaded file is empty."));
        }
                System.out.println(file.getOriginalFilename());
                System.out.println(itemDTO);
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "item-images"));
                String imageUrl = uploadResult.get("secure_url").toString();
                itemDTO.setImageUrl(imageUrl);
                ItemDTO savedItem = itemService.addItem(itemDTO);
                return ResponseEntity.ok(Map.of("item",savedItem));
      } catch (IllegalArgumentException e) {
          return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
    catch(IOException e)
    {
        return ResponseEntity.badRequest().body(Map.of("message","Error uploading file"));
    }
    catch(Exception e)
    {
        return ResponseEntity.internalServerError().body(Map.of("message","Error Adding Item"));
    }
      }


    @GetMapping("/cancelItem/{itemId}")
      public ResponseEntity<Map<String,Object>> cancelItem(@PathVariable Long itemId){
          try {
              ItemDTO cancelledItem = itemService.cancelItem(itemId);
              return ResponseEntity.ok(Map.of("item", cancelledItem));
          } catch (IllegalArgumentException e) {
              return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
          }
          catch (Exception e) {
              return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while cancelling the item"));
          }

      }

      @GetMapping("/getAllBidsForItem/{itemId}")
      List<BidDTO> getAllBidsForItem(@PathVariable Long itemId) {
          Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
          if (authentication == null || !authentication.isAuthenticated()) {
              throw new IllegalArgumentException("User not authenticated");
          }
          return bidService.findByItemId(itemId);
      }

      @GetMapping("/test")
      public String test() {
          return "Admin endpoint is working";
      }

      @PutMapping("/addBalance/{email}/{amount}")
      public ResponseEntity<Map<String,Object>>addBalance(@PathVariable("email")String email, @PathVariable("amount") Double amount)
      {
        try{
        UserDTO user = bidService.addBalance(email, amount);
            return ResponseEntity.ok(Map.of("user",user));

      }
      catch(Exception e)
      {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",e.getMessage()));
      }

    }
    @DeleteMapping("/deleteUser/{email}")
    public void deleteUser(@PathVariable("email") String email)
    {
        try{
                adminService.deleteUser(email);
            ResponseEntity.status(HttpStatus.NO_CONTENT);
        }
        catch(Exception e){
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("/getAllUsers")
    public ResponseEntity<Map<String,List<UserInfoDTO>>>allUsers()
    {
        List<UserInfoDTO>users = adminService.getAllUsers();
        return ResponseEntity.ok(Map.of("users",users));
    }
}
