package com.example.erp.dto;

import java.util.Set;

public class UserDTO {
    private Set<Long> moduleIds;

    public Set<Long> getModuleIds() {
        return moduleIds;
    }

    public void setModuleIds(Set<Long> moduleIds) {
        this.moduleIds = moduleIds;
    }
}
