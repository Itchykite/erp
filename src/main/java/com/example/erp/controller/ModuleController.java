package com.example.erp.controller;

import com.example.erp.model.Module;
import com.example.erp.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ModuleController {

    @Autowired
    private ModuleRepository moduleRepository;

    @GetMapping
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Module> createModule(@RequestBody Module module) {
        return ResponseEntity.ok(moduleRepository.save(module));
    }
}
