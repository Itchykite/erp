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
    @CrossOrigin
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    @PostMapping
    @CrossOrigin
    public ResponseEntity<Module> createModule(@RequestBody Module module) {
        return ResponseEntity.ok(moduleRepository.save(module));
    }

    @PutMapping("/{id}")
    @CrossOrigin
    public ResponseEntity<Module> updateModule(@PathVariable Long id, @RequestBody Module moduleDetails) {
        return moduleRepository.findById(id).map(module -> {
            module.setModuleName(moduleDetails.getModuleName());
            return ResponseEntity.ok(moduleRepository.save(module));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CrossOrigin
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        return moduleRepository.findById(id).map(module -> {
            moduleRepository.delete(module);
            return ResponseEntity.ok().<Void>build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
