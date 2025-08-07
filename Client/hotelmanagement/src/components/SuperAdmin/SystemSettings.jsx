import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const SystemSettings = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'Hostel Management System',
    siteDescription: 'Complete hostel management solution',
    allowRegistration: false,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    maxHostelsPerOwner: 5,
    defaultRoomCapacity: 2,
    currency: 'INR',
    timeZone: 'Asia/Kolkata'
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // This would typically save to your backend
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save settings');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSystemAction = async (action) => {
    const confirmMessage = {
      backup: 'Create a system backup?',
      restore: 'Restore from backup? This will overwrite current data.',
      reset: 'Reset all system data? This action cannot be undone!',
    };

    if (window.confirm(confirmMessage[action])) {
      try {
        // These would be actual API calls
        switch (action) {
          case 'backup':
            setSuccess('System backup created successfully!');
            break;
          case 'restore':
            setSuccess('System restored from backup!');
            break;
          case 'reset':
            setSuccess('System data reset successfully!');
            break;
        }
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(`Failed to ${action} system`);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const sections = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'limits', label: 'System Limits', icon: '📊' },
    { id: 'backup', label: 'Backup & Restore', icon: '💾' },
    { id: 'logs', label: 'System Logs', icon: '📋' },
  ];

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">General Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <textarea
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select
                name="timeZone"
                value={settings.timeZone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowRegistration"
                checked={settings.allowRegistration}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Allow public registration
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Maintenance mode (system will be inaccessible to regular users)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Email Notifications</h4>
              <p className="text-sm text-gray-600">Send notifications via email</p>
            </div>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Send notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              name="smsNotifications"
              checked={settings.smsNotifications}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const SystemLimits = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Hostels per Owner
            </label>
            <input
              type="number"
              name="maxHostelsPerOwner"
              value={settings.maxHostelsPerOwner}
              onChange={handleInputChange}
              min="1"
              max="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Room Capacity
            </label>
            <input
              type="number"
              name="defaultRoomCapacity"
              value={settings.defaultRoomCapacity}
              onChange={handleInputChange}
              min="1"
              max="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const BackupRestore = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Backup & Restore</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleSystemAction('backup')}
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">💾</div>
              <p className="font-medium text-gray-700">Create Backup</p>
              <p className="text-sm text-gray-500">Backup all system data</p>
            </div>
          </button>

          <button
            onClick={() => handleSystemAction('restore')}
            className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🔄</div>
              <p className="font-medium text-gray-700">Restore Backup</p>
              <p className="text-sm text-gray-500">Restore from backup file</p>
            </div>
          </button>

          <button
            onClick={() => handleSystemAction('reset')}
            className="p-4 border-2 border-dashed border-red-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="font-medium text-gray-700">Reset System</p>
              <p className="text-sm text-gray-500">Clear all data</p>
            </div>
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <div className="flex">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <h4 className="font-medium text-yellow-800">Important Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Always create a backup before performing system updates or maintenance. 
                Restore and reset operations cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SystemLogs = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Logs</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
          <div>[2024-08-05 10:30:25] INFO: User login successful - superadmin@hostel.com</div>
          <div>[2024-08-05 10:28:14] INFO: New hostel created - Green Valley Hostel</div>
          <div>[2024-08-05 10:25:33] INFO: User created - john@example.com (admin)</div>
          <div>[2024-08-05 10:20:11] INFO: System backup completed successfully</div>
          <div>[2024-08-05 09:15:45] WARN: Failed login attempt - invalid@email.com</div>
          <div>[2024-08-05 09:10:22] INFO: Hostel updated - Blue Sky Hostel</div>
          <div>[2024-08-05 08:45:13] INFO: Room added - Blue Sky Hostel, Room 101</div>
          <div>[2024-08-05 08:30:07] INFO: System started successfully</div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Download Full Logs
          </button>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'limits':
        return <SystemLimits />;
      case 'backup':
        return <BackupRestore />;
      case 'logs':
        return <SystemLogs />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          ❌ {error}
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-xl shadow-lg p-6 h-fit">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSave}>
            {renderSectionContent()}
            
            {(activeSection === 'general' || activeSection === 'notifications' || activeSection === 'limits') && (
              <div className="flex justify-end pt-6 border-t">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;