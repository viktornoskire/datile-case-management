package dev.datile.service;

import dev.datile.domain.User;
import dev.datile.dto.users.NewUserDto;
import dev.datile.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        User existingUser = userRepository.findByEmail(user.email()).orElse(null);

        if (existingUser != null) {
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
        return userRepository.findAll();
    }

}
