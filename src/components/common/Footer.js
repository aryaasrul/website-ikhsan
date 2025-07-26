import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

const Footer = () => {
  const [siteSettings, setSiteSettings] = useState({});

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['site_info', 'contact_info', 'social_media'])
        .eq('is_public', true);

      if (data) {
        const settings = {};
        data.forEach(setting => {
          settings[setting.key] = setting.value;
        });
        setSiteSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">🕋</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{siteSettings.site_info?.title || 'Muniful Ikhsan Alhafizi'}</h3>
                <p className="text-gray-400 text-sm">{siteSettings.site_info?.tagline || 'Muthawwif Profesional'}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {siteSettings.site_info?.description || 'Platform konsultasi dan edukasi umrah haji dengan muthawwif profesional lulusan Al-Azhar Kairo.'}
            </p>
            
            {/* Social Media */}
            {siteSettings.social_media && (
              <div className="flex space-x-4">
                {siteSettings.social_media.instagram && (
                  <a 
                    href={siteSettings.social_media.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors"
                  >
                    <span className="text-lg">📷</span>
                  </a>
                )}
                {siteSettings.social_media.facebook && (
                  <a 
                    href={siteSettings.social_media.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors"
                  >
                    <span className="text-lg">📘</span>
                  </a>
                )}
                {siteSettings.social_media.youtube && (
                  <a 
                    href={siteSettings.social_media.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors"
                  >
                    <span className="text-lg">🎥</span>
                  </a>
                )}
                {siteSettings.social_media.tiktok && (
                  <a 
                    href={siteSettings.social_media.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors"
                  >
                    <span className="text-lg">🎵</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Menu Utama</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors">Beranda</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">Tentang</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-yellow-400 transition-colors">Blog</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-yellow-400 transition-colors">Materi Premium</Link></li>
              <li><Link to="/consultation" className="text-gray-300 hover:text-yellow-400 transition-colors">Konsultasi</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <div className="space-y-3">
              {siteSettings.contact_info?.phone && (
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">📞</span>
                  <a 
                    href={`tel:${siteSettings.contact_info.phone}`}
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    {siteSettings.contact_info.phone}
                  </a>
                </div>
              )}
              
              {siteSettings.contact_info?.whatsapp && (
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">💬</span>
                  <a 
                    href={`https://wa.me/${siteSettings.contact_info.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              )}
              
              {siteSettings.contact_info?.email && (
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">✉️</span>
                  <a 
                    href={`mailto:${siteSettings.contact_info.email}`}
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    {siteSettings.contact_info.email}
                  </a>
                </div>
              )}
              
              {siteSettings.contact_info?.address && (
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 mt-1">📍</span>
                  <span className="text-gray-300 text-sm">
                    {siteSettings.contact_info.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Muniful Ikhsan Alhafizi. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;