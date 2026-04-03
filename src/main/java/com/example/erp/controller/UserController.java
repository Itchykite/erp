package com.example.erp.controller;

import com.example.erp.model.User;
import com.example.erp.repository.ModuleRepository;
import com.example.erp.repository.UserRepository;
import com.example.erp.dto.UserDTO;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModuleRepository moduleRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    @CrossOrigin
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @CrossOrigin
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User saved = userRepository.save(user);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(e.getClass().getName() + ": " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @CrossOrigin
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUsername(userDetails.getUsername());
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            user.setName(userDetails.getName());
            user.setLastName(userDetails.getLastName());
            user.setEmail(userDetails.getEmail());
            return ResponseEntity.ok(userRepository.save(user));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/modules")
    public ResponseEntity<User> assignModulesToUser(
            @PathVariable Long id,
            @RequestBody UserDTO request) {

        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        Set<Long> moduleIds = request.getModuleIds();
        Set<com.example.erp.model.Module> modules = new HashSet<>(moduleRepository.findAllById(moduleIds));

        user.setModules(modules);
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/{id}")
    @CrossOrigin
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
