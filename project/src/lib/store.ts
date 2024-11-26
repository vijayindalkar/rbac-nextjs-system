import { User, Role } from '@/types'

// Initial data
let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
  },
]

let roles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    permissions: ['create:users', 'read:users', 'update:users', 'delete:users', 'create:roles', 'read:roles', 'update:roles', 'delete:roles'],
    description: 'Full system access',
  },
  {
    id: '2',
    name: 'User',
    permissions: ['read:users', 'read:roles'],
    description: 'Basic user access',
  },
]

// Generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// Store operations
export const store = {
  users: {
    getAll: (): Promise<User[]> => {
      return Promise.resolve([...users])
    },
    getById: (id: string): Promise<User | undefined> => {
      return Promise.resolve(users.find(user => user.id === id))
    },
    create: (userData: Omit<User, 'id'>): Promise<User> => {
      const newUser = { ...userData, id: generateId() }
      users = [...users, newUser]
      return Promise.resolve(newUser)
    },
    update: (id: string, userData: Partial<User>): Promise<User> => {
      const index = users.findIndex(user => user.id === id)
      if (index === -1) {
        return Promise.reject(new Error('User not found'))
      }
      const updatedUser = { ...users[index], ...userData }
      users = [...users.slice(0, index), updatedUser, ...users.slice(index + 1)]
      return Promise.resolve(updatedUser)
    },
    delete: (id: string): Promise<void> => {
      const index = users.findIndex(user => user.id === id)
      if (index === -1) {
        return Promise.reject(new Error('User not found'))
      }
      users = [...users.slice(0, index), ...users.slice(index + 1)]
      return Promise.resolve()
    },
    search: (query: string): Promise<User[]> => {
      const lowercaseQuery = query.toLowerCase()
      const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery)
      )
      return Promise.resolve(filteredUsers)
    },
  },
  roles: {
    getAll: (): Promise<Role[]> => {
      return Promise.resolve([...roles])
    },
    getById: (id: string): Promise<Role | undefined> => {
      return Promise.resolve(roles.find(role => role.id === id))
    },
    create: (roleData: Omit<Role, 'id'>): Promise<Role> => {
      const newRole = { ...roleData, id: generateId() }
      roles = [...roles, newRole]
      return Promise.resolve(newRole)
    },
    update: (id: string, roleData: Partial<Role>): Promise<Role> => {
      const index = roles.findIndex(role => role.id === id)
      if (index === -1) {
        return Promise.reject(new Error('Role not found'))
      }
      const updatedRole = { ...roles[index], ...roleData }
      roles = [...roles.slice(0, index), updatedRole, ...roles.slice(index + 1)]
      return Promise.resolve(updatedRole)
    },
    delete: (id: string): Promise<void> => {
      const index = roles.findIndex(role => role.id === id)
      if (index === -1) {
        return Promise.reject(new Error('Role not found'))
      }
      roles = [...roles.slice(0, index), ...roles.slice(index + 1)]
      return Promise.resolve()
    },
    search: (query: string): Promise<Role[]> => {
      const lowercaseQuery = query.toLowerCase()
      const filteredRoles = roles.filter(role => 
        role.name.toLowerCase().includes(lowercaseQuery) ||
        role.description.toLowerCase().includes(lowercaseQuery)
      )
      return Promise.resolve(filteredRoles)
    },
  },
}