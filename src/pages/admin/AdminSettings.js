// src/pages/admin/AdminSettings.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { canManageContent } = useAuth();
  const [activeTab, setActiveTab] = useState('site');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    site_info: {},
    contact_info: {},
    social_media: {},
    payment_settings: {},
    seo_settings: {}
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['site_info', 'contact_info', 'social_media', 'payment_settings', 'seo_settings']);

      if (data) {
        const settingsObj = {};
        data.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
        setSettings(settingsObj);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error loading settings');
    }
  };

  const handleSaveSetting = async (key, value) => {
    if (!canManageContent()) {
      toast.error('You do not have permission to update settings');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'site', label: '🌐 Site Info', icon: '🌐' },
    { id: 'contact', label: '📞 Contact', icon: '📞' },
    { id: 'social', label: '📱 Social Media', icon: '📱' },
    { id: 'payment', label: '💳 Payment', icon: '💳' },
    { id: 'seo', label: '🔍 SEO', icon: '🔍' }
  ];

  if (!canManageContent()) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🚫</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to manage settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Website Settings</h1>
          <p className="text-gray-600">Manage website configuration and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'site' && (
            <SiteInfoSettings 
              settings={settings.site_info || {}}
              onSave={(value) => handleSaveSetting('site_info', value)}
              loading={loading}
            />
          )}

          {activeTab === 'contact' && (
            <ContactSettings 
              settings={settings.contact_info || {}}
              onSave={(value) => handleSaveSetting('contact_info', value)}
              loading={loading}
            />
          )}

          {activeTab === 'social' && (
            <SocialMediaSettings 
              settings={settings.social_media || {}}
              onSave={(value) => handleSaveSetting('social_media', value)}
              loading={loading}
            />
          )}

          {activeTab === 'payment' && (
            <PaymentSettings 
              settings={settings.payment_settings || {}}
              onSave={(value) => handleSaveSetting('payment_settings', value)}
              loading={loading}
            />
          )}

          {activeTab === 'seo' && (
            <SEOSettings 
              settings={settings.seo_settings || {}}
              onSave={(value) => handleSaveSetting('seo_settings', value)}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Site Info Settings Component
const SiteInfoSettings = ({ settings, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    keywords: [],
    logo_url: '',
    favicon_url: '',
    ...settings
  });

  useEffect(() => {
    setFormData({ ...formData, ...settings });
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleKeywordsChange = (e) => {
    const keywords = e.target.value.split(',').map(k => k.trim()).filter(Boolean);
    setFormData({ ...formData, keywords });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Muniful Ikhsan Alhafizi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Muthawwif Profesional"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Platform konsultasi dan edukasi umrah haji..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keywords (comma separated)
        </label>
        <input
          type="text"
          value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : ''}
          onChange={handleKeywordsChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="umrah, haji, muthawwif, spiritual"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo URL
          </label>
          <input
            type="url"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favicon URL
          </label>
          <input
            type="url"
            value={formData.favicon_url}
            onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/favicon.ico"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

// Contact Settings Component
const ContactSettings = ({ settings, onSave, loading }) => {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    google_maps_url: '',
    office_hours: '',
    ...settings
  });

  useEffect(() => {
    setFormData({ ...formData, ...settings });
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+62 821 1909 7273"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="munifulikhsanalhafizi@gmail.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+62 821 1909 7273"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office Hours
          </label>
          <input
            type="text"
            value={formData.office_hours}
            onChange={(e) => setFormData({ ...formData, office_hours: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Konsultasi 24/7 via WhatsApp"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Jl. Pramuka 25h Kel. Kertosari Kec. Babadan..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Google Maps URL
        </label>
        <input
          type="url"
          value={formData.google_maps_url}
          onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://maps.google.com/..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

// Social Media Settings Component
const SocialMediaSettings = ({ settings, onSave, loading }) => {
  const [formData, setFormData] = useState({
    instagram: '',
    youtube: '',
    tiktok: '',
    facebook: '',
    twitter: '',
    ...settings
  });

  useEffect(() => {
    setFormData({ ...formData, ...settings });
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📷 Instagram
          </label>
          <input
            type="url"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://instagram.com/muniful_ikhsan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📘 Facebook
          </label>
          <input
            type="url"
            value={formData.facebook}
            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://facebook.com/muniful.ichsan.alhafizi"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎥 YouTube
          </label>
          <input
            type="url"
            value={formData.youtube}
            onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://youtube.com/@muthawwifmuda"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎵 TikTok
          </label>
          <input
            type="url"
            value={formData.tiktok}
            onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://tiktok.com/@muthawwifmuda"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🐦 Twitter
        </label>
        <input
          type="url"
          value={formData.twitter}
          onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://twitter.com/muthawwifmuda"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

// Payment Settings Component (Basic)
const PaymentSettings = ({ settings, onSave, loading }) => {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4">💳</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Settings</h3>
      <p className="text-gray-600">Payment gateway configuration will be available in the next update.</p>
    </div>
  );
};

// SEO Settings Component (Basic)
const SEOSettings = ({ settings, onSave, loading }) => {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">SEO Settings</h3>
      <p className="text-gray-600">Advanced SEO configuration will be available in the next update.</p>
    </div>
  );
};

export default AdminSettings;