"use client"

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Role } from '@/types'
import { api } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { RoleList } from './roles/RoleList'
import { RoleModal } from './roles/RoleModal'

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadRoles()
  }, [])

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

  const handleCreateRole = async (roleData: Omit<Role, 'id'>) => {
    try {
      await api.roles.create(roleData)
      loadRoles()
      setIsModalOpen(false)
      toast({
        title: "Success",
        description: "Role created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async (id: string, roleData: Partial<Role>) => {
    try {
      await api.roles.update(id, roleData)
      loadRoles()
      setIsModalOpen(false)
      setSelectedRole(null)
      toast({
        title: "Success",
        description: "Role updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = async (id: string) => {
    try {
      await api.roles.delete(id)
      loadRoles()
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      <RoleList
        roles={roles}
        onEdit={(role) => {
          setSelectedRole(role)
          setIsModalOpen(true)
        }}
        onDelete={handleDeleteRole}
      />

      <RoleModal
        open={isModalOpen}
        role={selectedRole}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedRole(null)
        }}
        onSubmit={selectedRole ? 
          (data) => handleUpdateRole(selectedRole.id, data) : 
          handleCreateRole
        }
      />
    </div>
  )
}