"use client"

import { useEffect, useState } from 'react'
import { Users, ShieldCheck, AlertTriangle } from 'lucide-react'
import { api } from '@/services/api'
import { User, Role } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        api.users.getAll(),
        api.roles.getAll(),
      ])
      setUsers(usersData)
      setRoles(rolesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    }
  }

  const activeUsers = users.filter(user => user.status === 'active').length
  const inactiveUsers = users.length - activeUsers

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} active, {inactiveUsers} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              Manage access control
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map(role => {
                const usersWithRole = users.filter(user => user.role === role.name).length
                return (
                  <div key={role.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {role.permissions.length} permissions
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {usersWithRole} users
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}