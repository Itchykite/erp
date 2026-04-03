package com.example.erp.service;

import com.example.erp.model.User;
import org.springframework.stereotype.Service;

@Service
public class ModuleAccessService {

    public boolean hasAccess(User user, String moduleName) {
        return user.getModules().stream()
                .anyMatch(m -> m.getModuleName().equals(moduleName));
    }
}
