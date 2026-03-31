package dev.datile.controller;

import dev.datile.dto.security.LoginRequest;
import dev.datile.repository.UserRepository;
import dev.datile.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public AuthController(JwtService jwtService, AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,
                                   HttpServletResponse response) {
       try {
           Authentication authentication = authenticationManager.authenticate(
                   new UsernamePasswordAuthenticationToken(
                           loginRequest.email(),
                           loginRequest.password()
                   )
           );

           var userDetails = (org.springframework.security.core.userdetails.User)
                   authentication.getPrincipal();

           var user = userRepository.findByEmail(userDetails.getUsername())
                   .orElseThrow();

           if (!user.isActive()) {
               return ResponseEntity.status(HttpStatus.FORBIDDEN)
                       .body("User is inactive");
           }

           String role = userDetails.getAuthorities().stream()
                   .findFirst()
                   .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                   .orElseThrow();

           String token = jwtService.generateToken(
                   userDetails.getUsername(),
                   role
           );

           Cookie cookie = new Cookie("jwt", token);
           cookie.setHttpOnly(true);
           cookie.setPath("/");
           cookie.setMaxAge(60 * 60 * 24);
           cookie.setSecure(false); // true in prod

           response.addCookie(cookie);

           return ResponseEntity.ok().build();
       }  catch (DisabledException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("User is inactive");

    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setSecure(false);

        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();

        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

        String name = userRepository.findNameByEmail(email).getName();

        return ResponseEntity.ok(Map.of(
                "name", name,
                "email", email,
                "role", role
        ));
    }
}