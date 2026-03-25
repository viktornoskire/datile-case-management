package dev.datile.service;

import dev.datile.domain.User;
import dev.datile.dto.users.NewUserDto;
import dev.datile.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(NewUserDto user) {
        boolean existingUser = userRepository.existsByEmailAndIsActiveTrue(user.email());

        if (existingUser) {
            throw new RuntimeException("User already exists");
        }

        User u = new User();
        u.setName(user.name());
        u.setEmail(user.email());
        u.setPassword(passwordEncoder.encode(user.password()));
        u.setRole(user.role());
        return userRepository.save(u);
    }

    public List<User> getAllUsers(){
        return userRepository.findByIsActiveTrue();
    }

    public User updateUser(Long id, NewUserDto user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // prevent duplicate emails
        User emailOwner = userRepository.findByEmailAndIsActiveTrue(user.email()).orElse(null);
        if (emailOwner != null && !emailOwner.getId().equals(id)) {
            throw new RuntimeException("Email already in use");
        }

        existingUser.setName(user.name());
        existingUser.setEmail(user.email());
        existingUser.setRole(user.role());

        if (user.password() != null && !user.password().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(user.password()));
        }

        return userRepository.save(existingUser);
    }

    public void softDeleteUser(Long id) {

        User userToDelete = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();

        User currentUser =userRepository.findByEmailAndIsActiveTrue(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        // ❗ Prevent self delete
        if (currentUser.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete yourself");
        }

        // ❗ Prevent deleting last admin
        if ("ADMIN".equals(userToDelete.getRole())) {
            long adminCount = userRepository.countByRoleAndIsActiveTrue("ADMIN");

            if (adminCount <= 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete the last admin");
            }
        }

        userToDelete.setActive(false);
        userRepository.save(userToDelete);
    }

    public boolean userExists(String email) {
        return userRepository.existsByEmailAndIsActiveTrue(email);
    }

}
