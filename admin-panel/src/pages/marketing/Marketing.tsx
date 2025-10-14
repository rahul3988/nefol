import React, { useState, useEffect } from 'react'

type Campaign = {
  id: number
  name: string
  type: 'email' | 'social' | 'push' | 'sms'
  status: 'draft' | 'active' | 'paused' | 'completed'
  audience: string
  sent: number
  opened: number
  clicked: number
  converted: number
  createdAt: string
  scheduledFor?: string
}

type EmailTemplate = {
  id: number
  name: string
  subject: string
  preview: string
  createdAt: string
}

export default function Marketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'audiences'>('campaigns')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const apiBase = (import.meta as any).env.VITE_API_URL || `http://${window.location.hostname}:4000`

  useEffect(() => {
    loadCampaigns()
    loadTemplates()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiBase}/api/marketing/campaigns`)
      const data = await res.json()
      setCampaigns(data)
    } catch (error) {
      console.error('Failed to load campaigns:', error)
      // Mock data
      setCampaigns([
        {
          id: 1,
          name: 'Welcome Series',
          type: 'email',
          status: 'active',
          audience: 'New customers',
          sent: 1250,
          opened: 890,
          clicked: 234,
          converted: 45,
          createdAt: '2024-01-15',
          scheduledFor: '2024-01-20'
        },
        {
          id: 2,
          name: 'Product Launch',
          type: 'social',
          status: 'active',
          audience: 'All customers',
          sent: 3200,
          opened: 2100,
          clicked: 567,
          converted: 89,
          createdAt: '2024-01-10'
        },
        {
          id: 3,
          name: 'Cart Abandonment',
          type: 'email',
          status: 'paused',
          audience: 'Cart abandoners',
          sent: 890,
          opened: 456,
          clicked: 123,
          converted: 23,
          createdAt: '2024-01-05'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const res = await fetch(`${apiBase}/api/marketing/templates`)
      const data = await res.json()
      setTemplates(data)
    } catch (error) {
      console.error('Failed to load templates:', error)
      // Mock data
      setTemplates([
        {
          id: 1,
          name: 'Welcome Email',
          subject: 'Welcome to Nefol! Start Your Skincare Journey',
          preview: 'Thank you for joining Nefol. Discover our premium skincare products...',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Product Recommendation',
          subject: 'Perfect Products for Your Skin Type',
          preview: 'Based on your preferences, we recommend these amazing products...',
          createdAt: '2024-01-10'
        },
        {
          id: 3,
          name: 'Sale Announcement',
          subject: 'Limited Time: 30% Off All Products',
          preview: 'Don\'t miss out on our biggest sale of the year. Shop now and save...',
          createdAt: '2024-01-05'
        }
      ])
    }
  }

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'email': return '📧'
      case 'social': return '📱'
      case 'push': return '🔔'
      case 'sms': return '💬'
      default: return '📧'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          Create Campaign
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'campaigns', name: 'Campaigns', count: campaigns.length },
            { id: 'templates', name: 'Templates', count: templates.length },
            { id: 'audiences', name: 'Audiences', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Total Campaigns', value: campaigns.length, icon: '📊' },
              { title: 'Active', value: campaigns.filter(c => c.status === 'active').length, icon: '✅' },
              { title: 'Total Sent', value: campaigns.reduce((sum, c) => sum + c.sent, 0).toLocaleString(), icon: '📤' },
              { title: 'Conversion Rate', value: '3.2%', icon: '🎯' }
            ].map((stat, index) => (
              <div key={index} className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Campaigns Table */}
          <div className="metric-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-3 pr-4">Campaign</th>
                    <th className="py-3 pr-4">Type</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Audience</th>
                    <th className="py-3 pr-4">Sent</th>
                    <th className="py-3 pr-4">Opened</th>
                    <th className="py-3 pr-4">Clicked</th>
                    <th className="py-3 pr-4">Converted</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium text-gray-900">{campaign.name}</p>
                          <p className="text-sm text-gray-500">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="flex items-center space-x-1">
                          <span>{getTypeIcon(campaign.type)}</span>
                          <span className="capitalize">{campaign.type}</span>
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{campaign.audience}</td>
                      <td className="py-3 pr-4 font-medium">{campaign.sent.toLocaleString()}</td>
                      <td className="py-3 pr-4">{campaign.opened.toLocaleString()}</td>
                      <td className="py-3 pr-4">{campaign.clicked.toLocaleString()}</td>
                      <td className="py-3 pr-4 font-semibold text-green-600">{campaign.converted}</td>
                      <td className="py-3 pr-4">
                        <div className="flex space-x-2">
                          <button className="btn-secondary text-xs px-2 py-1">Edit</button>
                          <button className="btn-secondary text-xs px-2 py-1">View</button>
                          <button className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Email Templates</h2>
            <button className="btn-primary">Create Template</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="metric-card">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                <p className="text-sm text-gray-500 mb-4">{template.preview}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(template.createdAt).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-xs px-2 py-1">Edit</button>
                    <button className="btn-secondary text-xs px-2 py-1">Preview</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audiences Tab */}
      {activeTab === 'audiences' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Audience Segments</h2>
            <button className="btn-primary">Create Audience</button>
          </div>

          <div className="metric-card">
            <p className="text-gray-600">Audience management features coming soon. This will include creating customer segments, importing lists, and managing subscriber preferences.</p>
          </div>
        </div>
      )}
    </div>
  )
}








