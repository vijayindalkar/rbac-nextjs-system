"use client"

import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { User, Role } from '@/types'
import { api } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserList } from './users/UserList'
import { UserModal } from './users/UserModal'

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roles, setRoles] = useState<Role[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
    loadRoles()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const loadUsers = async () => {
    try {
      const data = await api.users.getAll()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    }
  }

  const loadRoles = async () => {
    try {
      const data = await api.roles.getAll()
      setRoles(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load roles",
        variant: "destructive",
      })
    }
  }

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    try {
      await api.users.create(userData)
      loadUsers()
      setIsModalOpen(false)
      toast({
        title: "Success",
        description: "User created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    try {
      await api.users.update(id, userData)
      loadUsers()
      setIsModalOpen(false)
      setSelectedUser(null)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await api.users.delete(id)
      loadUsers()
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredUsers.length === 0 && searchQuery && (
        <div className="text-center text-muted-foreground py-8">
          No users found matching "{searchQuery}"
        </div>
      )}

      <UserList
        users={filteredUsers}
        onEdit={(user) => {
          setSelectedUser(user)
          setIsModalOpen(true)
        }}
        onDelete={handleDeleteUser}
      />

      <UserModal
        open={isModalOpen}
        user={selectedUser}
        roles={roles}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
        onSubmit={selectedUser ? 
          (data) => handleUpdateUser(selectedUser.id, data) : 
          handleCreateUser
        }
      />
    </div>
  )
}