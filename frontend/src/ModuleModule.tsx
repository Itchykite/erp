import React, { useState, useEffect } from "react";
import {
  dbGetModules,
  dbCreateModule,
  dbUpdateModule,
  dbDeleteModule,
} from "./Module";
import type { Module } from "./Module";
import "./ModuleModule.css";

export function ModuleBar() {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <div className="module-bar">
      <div className="module-header">
        <div className="module-bar-header">
          <button
            onClick={() =>
              setActivePanel(activePanel === "modules" ? null : "modules")
            }
          >
            {activePanel === "modules"
              ? "Hide Module List"
              : "Show Module List"}
          </button>
        </div>
        <div className="module-bar-header">
          <button
            onClick={() =>
              setActivePanel(activePanel === "create" ? null : "create")
            }
          >
            {activePanel === "create"
              ? "Hide Create Module"
              : "Show Create Module"}
          </button>
        </div>
        <div className="module-bar-header">
          <button
            onClick={() =>
              setActivePanel(activePanel === "update" ? null : "update")
            }
          >
            {activePanel === "update"
              ? "Hide Update Module"
              : "Show Update Module"}
          </button>
        </div>
        <div className="module-bar-header">
          <button
            onClick={() =>
              setActivePanel(activePanel === "delete" ? null : "delete")
            }
          >
            {activePanel === "delete"
              ? "Hide Delete Module"
              : "Show Delete Module"}
          </button>
        </div>
      </div>

      <hr />

      <div className="module-content">
        <div className="module-content-list">
          {activePanel === "modules" && <ModuleList />}
        </div>
        <div className="module-content-section">
          {activePanel === "create" && <CreateModule />}
          {activePanel === "update" && <UpdateModule />}
          {activePanel === "delete" && <DeleteModule />}
        </div>
      </div>
    </div>
  );
}

export function ModuleList() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    dbGetModules().then(setModules);
  }, []);

  return (
    <div className="module-list">
      <ol>
        {modules.map((module) => (
          <li key={module.id}>{module.moduleName}</li>
        ))}
      </ol>
    </div>
  );
}

export function CreateModule() {
  const [moduleName, setModuleName] = useState("");
  const [modules, setModules] = useState<Module[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newModule = await dbCreateModule({ moduleName: moduleName });

    if (newModule) {
      alert(`Module "${newModule.moduleName}" created successfully`);
      setModuleName("");
      setModules([...modules, newModule]);
    } else {
      alert("Failed to create module");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <input
        type="text"
        placeholder="Enter module name"
        value={moduleName}
        onChange={(e) => setModuleName(e.target.value)}
      />
      <button type="submit">Create Module</button>
    </form>
  );
}

export function UpdateModule() {
  const [modules, setModules] = useState<Module[]>([]);

  const [moduleId, setModuleId] = useState("");
  const [moduleName, setModuleName] = useState("");

  useEffect(() => {
    dbGetModules().then(setModules);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = parseInt(moduleId);
    if (isNaN(id)) {
      alert("Please enter a valid module ID");
      return;
    }

    const updatedModule = await dbUpdateModule(id, { moduleName: moduleName });

    if (updatedModule) {
      alert(`Module with ID ${id} updated successfully`);
      setModuleId("");
      setModuleName("");
    } else {
      alert(`Failed to update module with ID ${id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
        <option value="">Select module</option>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.moduleName}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter new module name"
        value={moduleName}
        onChange={(e) => setModuleName(e.target.value)}
      />
      <button type="submit">Update Module</button>
    </form>
  );
}

export function DeleteModule() {
  const [modules, setModules] = useState<Module[]>([]);

  const [moduleId, setModuleId] = useState("");

  useEffect(() => {
    dbGetModules().then(setModules);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = parseInt(moduleId);
    if (isNaN(id)) {
      alert("Please enter a valid module ID");
      return;
    }

    const success = await dbDeleteModule(id);

    if (success) {
      alert(`Module with ID ${id} deleted successfully`);
      setModuleId("");
    } else {
      alert(`Failed to delete module with ID ${id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
        <option value="">Select module</option>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.moduleName}
          </option>
        ))}
      </select>
      <button type="submit">Delete Module</button>
    </form>
  );
}
