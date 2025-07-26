import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { formatDate, truncateText } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';

const ContactPage = () => {
  const { user } = useAuth();
  const [contactInfo, setContactInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultation_type: 'general',
    preferred_date: '',
    message: ''
  });

  useEffect(() => {
    fetchContactInfo();
    
    // Pre-fill form if user is logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  const fetchContactInfo = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['contact_info', 'social_media'])
        .eq('is_public', true);

      if (data) {
        const contact = {};
        data.forEach(setting => {
          contact[setting.key] = setting.value;
        });
        setContactInfo(contact);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const consultationData = {
        ...formData,
        user_id: user?.id || null,
        preferred_date: formData.preferred_date ? new Date(formData.preferred_date).toISOString() : null
      };

      const { error } = await supabase
        .from('consultations')
        .insert(consultationData);

      if (error) throw error;

      setSubmitted(true);
      setFormData({
        name: '',
        email: user?.email || '',
        phone: '',
        consultation_type: 'general',
        preferred_date: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const whatsappNumber = contactInfo.contact_info?.whatsapp?.replace(/[^0-9]/g, '') || '6282119097273';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Assalamualaikum, saya ingin berkonsultasi tentang persiapan umrah/haji`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            📞 Hubungi Kami
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Siap membantu persiapan spiritual Anda menuju tanah suci. 
            Konsultasi 24/7 dengan muthawwif berpengalaman
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📍 Informasi Kontak
              </h2>
              
              <div className="space-y-4">
                {contactInfo.contact_info?.phone && (
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">📞</span>
                    <div>
                      <p className="font-medium text-gray-900">Telepon</p>
                      <a 
                        href={`tel:${contactInfo.contact_info.phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {contactInfo.contact_info.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.contact_info?.whatsapp && (
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">💬</span>
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp</p>
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {contactInfo.contact_info.whatsapp}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.contact_info?.email && (
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-500 text-xl">✉️</span>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a 
                        href={`mailto:${contactInfo.contact_info.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {contactInfo.contact_info.email}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.contact_info?.address && (
                  <div className="flex items-start space-x-3">
                    <span className="text-red-500 text-xl">📍</span>
                    <div>
                      <p className="font-medium text-gray-900">Alamat</p>
                      <p className="text-gray-600 text-sm">
                        {contactInfo.contact_info.address}
                      </p>
                    </div>
                  </div>
                )}

                {contactInfo.contact_info?.office_hours && (
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-500 text-xl">⏰</span>
                    <div>
                      <p className="font-medium text-gray-900">Jam Pelayanan</p>
                      <p className="text-gray-600 text-sm">
                        {contactInfo.contact_info.office_hours}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-4">💬 Konsultasi Langsung</h3>
              <p className="text-green-100 mb-6">
                Butuh jawaban cepat? Hubungi langsung via WhatsApp untuk konsultasi gratis
              </p>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                💬 Chat WhatsApp
              </a>
            </div>

            {/* Social Media */}
            {contactInfo.social_media && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🌐 Ikuti Kami</h3>
                <div className="space-y-3">
                  {contactInfo.social_media.instagram && (
                    <a 
                      href={contactInfo.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition-colors"
                    >
                      <span className="text-xl">📷</span>
                      <span>Instagram</span>
                    </a>
                  )}
                  {contactInfo.social_media.facebook && (
                    <a 
                      href={contactInfo.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <span className="text-xl">📘</span>
                      <span>Facebook</span>
                    </a>
                  )}
                  {contactInfo.social_media.youtube && (
                    <a 
                      href={contactInfo.social_media.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <span className="text-xl">🎥</span>
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📝 Form Konsultasi
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Pesan Terkirim!</h3>
                  <p className="text-gray-600 mb-6">
                    Terima kasih atas kepercayaan Anda. Kami akan menghubungi Anda dalam 24 jam.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="email@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+62812-3456-7890"
                      />
                    </div>

                    {/* Consultation Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Konsultasi
                      </label>
                      <select
                        name="consultation_type"
                        value={formData.consultation_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="general">Konsultasi Umum</option>
                        <option value="umrah">Persiapan Umrah</option>
                        <option value="haji">Persiapan Haji</option>
                        <option value="spiritual">Bimbingan Spiritual</option>
                        <option value="urgent">Konsultasi Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Konsultasi yang Diinginkan
                    </label>
                    <input
                      type="datetime-local"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan / Pertanyaan *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Jelaskan kebutuhan konsultasi Anda atau pertanyaan yang ingin diajukan..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '⏳ Mengirim...' : '📤 Kirim Pesan'}
                    </button>
                    
                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                    >
                      💬 Chat Langsung
                    </a>
                  </div>

                  <p className="text-sm text-gray-500">
                    * Kolom wajib diisi. Kami akan merespons dalam 24 jam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;