import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { formatDate, truncateText } from '../../utils/helpers';

const AboutPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['about_profile', 'philosophy'])
        .eq('is_public', true);

      if (data) {
        const profile = {};
        data.forEach(setting => {
          profile[setting.key] = setting.value;
        });
        setProfileData(profile);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  const profile = profileData?.about_profile || {};
  const philosophy = profileData?.philosophy || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            👤 Tentang Muniful Ikhsan Alhafizi
          </h1>
          <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
            Muthawwif Profesional Lulusan Al-Azhar Kairo dengan Pengalaman Membimbing 
            Jamaah VIP dan Rombongan Ulama
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Profile Image & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              {/* Profile Image Placeholder */}
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-6xl font-bold mb-6">
                🕋
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {profile.full_name || 'Muniful Ikhsan Alhafizi'}
              </h2>
              <p className="text-gray-600 mb-4">Muthawwif Profesional</p>
              
              {/* Quick Facts */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>📍 {profile.address || 'Ponorogo, Jawa Timur'}</p>
                <p>🎂 {profile.birth_date || '29 Mei 1999'}</p>
                <p>📧 {profile.email || 'munifulikhsanalhafizi@gmail.com'}</p>
                <p>📱 {profile.phone || '+62 821 1909 7273'}</p>
              </div>

              {/* Social Media */}
              <div className="mt-6 flex justify-center space-x-4">
                <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                  📷 Instagram
                </a>
                <a href={`https://facebook.com/${profile.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                  📘 Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Education */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                🎓 Riwayat Pendidikan
              </h3>
              <div className="space-y-4">
                {(profile.education || []).map((edu, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.institution}</h4>
                      <p className="text-gray-600">{edu.level}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                💼 Pengalaman Profesional
              </h3>
              <div className="space-y-4">
                {(profile.experience || []).map((exp, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-yellow-600 font-medium">{exp.company}</p>
                    <p className="text-gray-600 mt-2">{exp.description}</p>
                    {exp.clients && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Klien VIP:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          {exp.clients.map((client, i) => (
                            <li key={i}>• {client}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Islamic Studies */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            📚 Keilmuan Islam
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(profile.islamic_studies || []).map((study, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">{study.subject}</h4>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Kitab yang Dipelajari:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {study.books.map((book, i) => (
                      <li key={i}>• {book}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Guru:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {study.teachers.map((teacher, i) => (
                      <li key={i}>• {teacher}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Specializations */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              ⭐ Spesialisasi
            </h3>
            <div className="space-y-3">
              {(profile.specializations || []).map((spec, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700">{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              🏆 Prestasi & Pencapaian
            </h3>
            <div className="space-y-3">
              {(profile.achievements || []).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-yellow-500">🏆</span>
                  <span className="text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Philosophy */}
        {philosophy && (
          <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              🤲 Visi, Misi & Filosofi Pelayanan
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Vision */}
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🎯
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Visi</h4>
                <p className="text-gray-700">{philosophy.vision}</p>
              </div>

              {/* Mission */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🚀
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Misi</h4>
                <ul className="text-gray-700 space-y-2">
                  {(philosophy.mission || []).map((item, index) => (
                    <li key={index} className="text-sm">• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Values */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  💎
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Nilai-Nilai</h4>
                <ul className="text-gray-700 space-y-2">
                  {(philosophy.values || []).map((value, index) => (
                    <li key={index} className="text-sm">• {value}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Approach */}
            <div className="mt-8 text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Pendekatan Pelayanan</h4>
              <p className="text-gray-700 max-w-4xl mx-auto italic">
                "{philosophy.approach}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;