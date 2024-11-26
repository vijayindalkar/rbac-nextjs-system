"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@/types'
import { roleSchema } from '@/schemas/roleSchema'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

type RoleFormData = {
  name: string
  permissions: string[]
  description: string
}

interface RoleModalProps {
  open: boolean
  role: Role | null
  onClose: () => void
  onSubmit: (data: RoleFormData) => Promise<void>
}

const AVAILABLE_PERMISSIONS = [
  'create:users',
  'read:users',
  'update:users',
  'delete:users',
  'create:roles',
  'read:roles',
  'update:roles',
  'delete:roles',
]

export function RoleModal({ open, role, onClose, onSubmit }: RoleModalProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      permissions: [],
      description: '',
    },
  })

  const selectedPermissions = watch('permissions')

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        permissions: role.permissions,
        description: role.description,
      })
    } else {
      reset({
        name: '',
        permissions: [],
        description: '',
      })
    }
  }, [role, reset])

  const onSubmitForm = handleSubmit(async (data) => {
    await onSubmit(data)
    onClose()
  })

  const handlePermissionChange = (permission: string, checked: boolean) => {
    const currentPermissions = selectedPermissions || []
    if (checked) {
      setValue('permissions', [...currentPermissions, permission], { shouldValidate: true })
    } else {
      setValue(
        'permissions',
        currentPermissions.filter((p) => p !== permission),
        { shouldValidate: true }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {role ? 'Edit Role' : 'Create Role'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmitForm} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter role name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-4">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={selectedPermissions?.includes(permission)}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(permission, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={permission}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission}
                  </label>
                </div>
              ))}
            </div>
            {errors.permissions && (
              <p className="text-sm text-destructive">
                {errors.permissions.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter role description"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {role ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}