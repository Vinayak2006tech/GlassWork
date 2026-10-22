import { Task, TaskPriority, TaskStatus } from '../types/models';
import {
  simulateNetwork,
  getStoredItem,
  setStoredItem,
  STORAGE_KEYS,
  initializeStorage,
} from './api';

export interface CreateTaskDTO {
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
}

export type UpdateTaskDTO = Partial<Omit<Task, 'id' | 'createdAt'>>;

export const taskService = {
  /**
   * Fetches all tasks, optionally scoped to a specific project.
   */
  async getTasks(projectId?: string): Promise<Task[]> {
    initializeStorage();
    return simulateNetwork(() => {
      const allTasks = getStoredItem<Task[]>(STORAGE_KEYS.TASKS, []);
      if (!projectId) {
        return allTasks;
      }
      return allTasks.filter((t) => t.projectId === projectId);
    });
  },

  /**
   * Fetches a single task by ID.
   */
  async getTaskById(id: string): Promise<Task | null> {
    initializeStorage();
    return simulateNetwork(() => {
      const allTasks = getStoredItem<Task[]>(STORAGE_KEYS.TASKS, []);
      return allTasks.find((t) => t.id === id) || null;
    });
  },

  /**
   * Creates a new task.
   */
  async createTask(dto: CreateTaskDTO): Promise<Task> {
    initializeStorage();
    return simulateNetwork(() => {
      const allTasks = getStoredItem<Task[]>(STORAGE_KEYS.TASKS, []);
      const now = new Date().toISOString();

      const newTask: Task = {
        id: `task-${Date.now()}`,
        projectId: dto.projectId,
        title: dto.title.trim(),
        description: dto.description.trim(),
        status: dto.status,
        priority: dto.priority,
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate,
        createdAt: now,
        updatedAt: now,
      };

      const updated = [newTask, ...allTasks];
      setStoredItem(STORAGE_KEYS.TASKS, updated);
      return newTask;
    });
  },

  /**
   * Updates an existing task.
   */
  async updateTask(id: string, updates: UpdateTaskDTO): Promise<Task> {
    initializeStorage();
    return simulateNetwork(() => {
      const allTasks = getStoredItem<Task[]>(STORAGE_KEYS.TASKS, []);
      const index = allTasks.findIndex((t) => t.id === id);

      if (index === -1) {
        throw new Error(`Task with ID "${id}" was not found.`);
      }

      const updatedTask: Task = {
        ...allTasks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      allTasks[index] = updatedTask;
      setStoredItem(STORAGE_KEYS.TASKS, allTasks);
      return updatedTask;
    });
  },

  /**
   * Deletes a task by ID.
   */
  async deleteTask(id: string): Promise<void> {
    initializeStorage();
    return simulateNetwork(() => {
      const allTasks = getStoredItem<Task[]>(STORAGE_KEYS.TASKS, []);
      const filtered = allTasks.filter((t) => t.id !== id);
      setStoredItem(STORAGE_KEYS.TASKS, filtered);
    });
  },

  /**
   * Batch updates status for multiple tasks.
   */
  async batchUpdateStatus(ids: string[], status: TaskStatus): Promise<Task[]> {
    initializeStorage();
    return simulateNetwork(() => {
      const allTasks = getStoredItem<Task[]>(STORAGE_KEYS.TASKS, []);
      const idSet = new Set(ids);
      const now = new Date().toISOString();

      const updated = allTasks.map((t) => {
        if (idSet.has(t.id)) {
          return {
            ...t,
            status,
            updatedAt: now,
          };
        }
        return t;
      });

      setStoredItem(STORAGE_KEYS.TASKS, updated);
      return updated.filter((t) => idSet.has(t.id));
    });
  },

  /**
   * Batch deletes multiple tasks by ID.
   */
  async batchDeleteTasks(ids: string[]): Promise<void> {
    initializeStorage();
    return simulateNetwork(() => {
      const allTasks = getStoredItem<Task[]>(STORAGE_KEYS.TASKS, []);
      const idSet = new Set(ids);
      const filtered = allTasks.filter((t) => !idSet.has(t.id));
      setStoredItem(STORAGE_KEYS.TASKS, filtered);
    });
  },
};

