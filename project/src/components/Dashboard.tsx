"use client"

import { useState } from 'react'
import { Layout } from './Layout'
import { UserManagement } from './UserManagement'
import { RoleManagement } from './RoleManagement'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <Layout>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'users'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'roles'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary'
            }`}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
        </div>
        {activeTab === 'users' ? <UserManagement /> : <RoleManagement />}
      </div>
    </Layout>
  )
}