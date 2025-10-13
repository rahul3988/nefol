import React from 'react'

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button className="btn-primary">
          Save Changes
        </button>
      </div>
      
      <div className="metric-card">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Store Settings</h2>
        <p className="text-gray-600 mb-6">Configure your store settings and preferences.</p>
        
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">General</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-primary focus:outline-none" placeholder="Nefol Store" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-primary focus:outline-none" placeholder="support@nefol.com" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Appearance</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-primary focus:outline-none">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-primary focus:outline-none">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
