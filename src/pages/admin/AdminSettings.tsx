import React, { useState } from 'react';
import { Save, Globe, Shield, Mail, Database, Palette } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import toast from 'react-hot-toast';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'DinTalk',
    siteDescription: 'A transparent platform where people can share experiences about companies and individuals',
    contactEmail: 'contact@dintalk.com',
    supportEmail: 'support@dintalk.com',
    
    // Moderation Settings
    autoApproveReports: false,
    requireEmailVerification: true,
    allowAnonymousReports: true,
    maxReportsPerDay: 5,
    
    // Email Settings
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    
    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: '24',
    maxLoginAttempts: '5',
    
    // Appearance
    primaryColor: '#2563eb',
    logoUrl: '',
    faviconUrl: ''
  });

  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'moderation', name: 'Moderation', icon: Shield },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
                
                <Input
                  label="Contact Email"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
              
              <TextArea
                label="Site Description"
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
              />
              
              <Input
                label="Support Email"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
              />
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Moderation Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Auto-approve Reports</label>
                    <p className="text-sm text-gray-500">Automatically approve reports without manual review</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoApproveReports}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoApproveReports: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Require Email Verification</label>
                    <p className="text-sm text-gray-500">Users must verify their email before submitting reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => setSettings(prev => ({ ...prev, requireEmailVerification: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Allow Anonymous Reports</label>
                    <p className="text-sm text-gray-500">Users can submit reports without revealing their identity</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowAnonymousReports}
                    onChange={(e) => setSettings(prev => ({ ...prev, allowAnonymousReports: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <Input
                  label="Max Reports Per Day"
                  type="number"
                  value={settings.maxReportsPerDay}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxReportsPerDay: e.target.value }))}
                />
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="SMTP Host"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  placeholder="smtp.gmail.com"
                />
                
                <Input
                  label="SMTP Port"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                  placeholder="587"
                />
                
                <Input
                  label="SMTP Username"
                  value={settings.smtpUsername}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                />
                
                <Input
                  label="SMTP Password"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Enable Two-Factor Authentication</label>
                    <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableTwoFactor}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableTwoFactor: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Session Timeout (hours)"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                  />
                  
                  <Input
                    label="Max Login Attempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Appearance Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="h-10 w-20 border border-gray-300 rounded-md"
                  />
                </div>
                
                <Input
                  label="Logo URL"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
                
                <Input
                  label="Favicon URL"
                  value={settings.faviconUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, faviconUrl: e.target.value }))}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}