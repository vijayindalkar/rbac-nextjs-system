import { User, Role } from '@/types'
import { store } from '@/lib/store'

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      await delay(500) // Simulate network request
      return store.users.getAll()
    },
    getById: async (id: string): Promise<User | undefined> => {
      await delay(500)
      return store.users.getById(id)
    },
    create: async (user: Omit<User, 'id'>): Promise<User> => {
      await delay(500)
      return store.users.create(user)
    },
    update: async (id: string, user: Partial<User>): Promise<User> => {
      await delay(500)
      return store.users.update(id, user)
    },
    delete: async (id: string): Promise<void> => {
      await delay(500)
      return store.users.delete(id)
    },
    search: async (query: string): Promise<User[]> => {
      await delay(500)
      return store.users.search(query)
    },
  },
  roles: {
    getAll: async (): Promise<Role[]> => {
      await delay(500)
      return store.roles.getAll()
    },
    getById: async (id: string): Promise<Role | undefined> => {
      await delay(500)
      return store.roles.getById(id)
    },
    create: async (role: Omit<Role, 'id'>): Promise<Role> => {
      await delay(500)
      return store.roles.create(role)
    },
    update: async (id: string, role: Partial<Role>): Promise<Role> => {
      await delay(500)
      return store.roles.update(id, role)
    },
    delete: async (id: string): Promise<void> => {
      await delay(500)
      return store.roles.delete(id)
    },
    search: async (query: string): Promise<Role[]> => {
      await delay(500)
      return store.roles.search(query)
    },
  },
}