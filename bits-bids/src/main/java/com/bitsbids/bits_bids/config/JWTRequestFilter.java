package com.bitsbids.bits_bids.config;

import java.io.IOException;
import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.bitsbids.bits_bids.utility.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JWTRequestFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final JWTUtil jwtUtil;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
       
             final String authHeader =    request.getHeader("Authorization");
             String email = null;
             String jwt = null;
            try{
             if(authHeader!=null && authHeader.startsWith("Bearer ")){
                
                jwt = authHeader.substring(7);
                email  = jwtUtil.extractUsername(jwt);
             }
             if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null)
             {

            
                UserDetails userdetails = this.userDetailsService.loadUserByUsername(email);
                if(jwtUtil.validateToken(jwt, userdetails)){
                    Collection<SimpleGrantedAuthority> authorities = 
                        jwtUtil.extractAuthorities(jwt).stream()
                            .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
                            .toList();
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userdetails,null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
             }
         
    }catch (io.jsonwebtoken.ExpiredJwtException ex) {
            
            handleExpiredToken(request, response);
            return; 
        } catch (Exception ex) {
          
        }
    filterChain.doFilter(request, response);
}

    private void handleExpiredToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String accept = request.getHeader("Accept");
    boolean wantsHtml = accept != null && accept.contains("text/html");

    if (wantsHtml) {
        // redirect browser to login with an indicator
        response.sendRedirect("/login?expired=true");
    } else {
        // API client: JSON 401 with custom info
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"token_expired\",\"message\":\"Session expired; please login again.\"}");
    }
}

}
