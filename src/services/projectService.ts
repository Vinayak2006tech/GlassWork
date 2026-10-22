import { Project } from '../types/models';
import {
  simulateNetwork,
  getStoredItem,
  setStoredItem,
  STORAGE_KEYS,
  initializeStorage,
} from './api';

export interface CreateProjectDTO {
  name: string;
  description: string;
  memberIds?: string[];
}

export const projectService = {
  /**
   * Fetches all projects from storage.
   */
  async getProjects(): Promise<Project[]> {
    initializeStorage();
    return simulateNetwork(() => {
      return getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
    });
  },

  /**
   * Fetches a project by its unique ID.
   */
  async getProjectById(id: string): Promise<Project | null> {
    initializeStorage();
    return simulateNetwork(() => {
      const projects = getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
      return projects.find((p) => p.id === id) || null;
    });
  },

  /**
   * Creates a new project and prepends to storage.
   */
  async createProject(dto: CreateProjectDTO): Promise<Project> {
    initializeStorage();
    return simulateNetwork(() => {
      const projects = getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: dto.name.trim(),
        description: dto.description.trim(),
        memberIds: dto.memberIds && dto.memberIds.length > 0 ? dto.memberIds : ['user-1'],
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updated = [newProject, ...projects];
      setStoredItem(STORAGE_KEYS.PROJECTS, updated);
      return newProject;
    });
  },

  /**
   * Updates an existing project.
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    initializeStorage();
    return simulateNetwork(() => {
      const projects = getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error(`Project with ID "${id}" was not found.`);
      }

      const updatedProject = {
        ...projects[index],
        ...updates,
      };

      projects[index] = updatedProject;
      setStoredItem(STORAGE_KEYS.PROJECTS, projects);
      return updatedProject;
    });
  },

  /**
   * Deletes a project.
   */
  async deleteProject(id: string): Promise<void> {
    initializeStorage();
    return simulateNetwork(() => {
      const projects = getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
      const filtered = projects.filter((p) => p.id !== id);
      setStoredItem(STORAGE_KEYS.PROJECTS, filtered);
    });
  },
};
