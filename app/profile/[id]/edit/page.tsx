/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils';
import { FiSave, FiX, FiPlus } from 'react-icons/fi';
import SingleImageUpload from '@/components/ui/SingleImageUpload';

const DarkLoading = ({ color = 'text-amber-500', className = 'min-h-screen bg-gray-900', ...props }: any) => (
    <div className={`flex items-center justify-center ${className}`} {...props}>
        <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-t-current ${color}`}></div>
    </div>
);

const AmberButton = ({ children, onClick, className, size, type = "button", variant, isLoading, ...props }: any) => {
    const baseStyle = "font-bold transition duration-200 ease-in-out rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    const sizeStyle = size === 'sm' ? 'px-4 py-1.5 text-sm' : 'px-6 py-2 text-base';
    
    let colorStyle = "";
    if (variant === 'secondary') {
        colorStyle = "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500/50";
    } else if (variant === 'outline') {
        colorStyle = "border-2 border-amber-600 text-amber-400 hover:bg-amber-600/10";
    } else {
        colorStyle = "bg-amber-500 text-gray-900 hover:bg-amber-400 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50";
    }
  
    return (
      <button
        onClick={onClick}
        type={type}
        disabled={isLoading}
        className={`${baseStyle} ${sizeStyle} ${colorStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-2 border-t-white"></div>
        ) : (
          children
        )}
      </button>
    );
};

const DarkInput = ({ label, name, type = 'text', value, onChange, placeholder, required, onKeyPress, ...props }: any) => (
    <div>
        {label && (
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
                {label} {required && <span className='text-red-500'>*</span>}
            </label>
        )}
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            onKeyPress={onKeyPress}
            className="w-full px-4 py-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150"
            {...props}
        />
    </div>
);

const DarkCard = ({ children, className, ...props }: any) => (
    <div className={`bg-gray-800 rounded-xl shadow-2xl border border-gray-700 ${className}`} {...props}>
        {children}
    </div>
);

const DarkCardHeader = ({ children, className }: any) => (
    <div className={`p-6 border-b border-gray-700 ${className}`}>
        {children}
    </div>
);

const DarkCardBody = ({ children, className }: any) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);
// -----------------------------------------------------------------------------

export default function ProfileEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profilePic: '',
    languages: [] as string[],
    expertise: [] as string[],
    dailyRate: '',
    travelPreferences: '',
  });
  const [languageInput, setLanguageInput] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');

  const profileId = Array.isArray(params.id) ? params.id[0] : params.id;
useEffect(() => {
    if (!profileId) return; 

    if (currentUser?.id !== profileId) {
      toast.error('Unauthorized');
      router.push('/');
      return;
    }
    fetchProfile();
}, [profileId, currentUser?.id, router]); 
  const fetchProfile = async () => {
    if (!profileId) return;
    try {
      const response = await api.get(`/users/${profileId}`);
      const profile = response.data.data;
      
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        profilePic: profile.profilePic || '',
        languages: profile.languages || [],
        expertise: profile.expertise || [],
        dailyRate: profile.dailyRate?.toString() || '',
        travelPreferences: profile.travelPreferences || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicUpload = (url: string) => {
    setFormData({ ...formData, profilePic: url });
  };

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languageInput.trim()],
      });
      setLanguageInput('');
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((l) => l !== lang),
    });
  };

  const addExpertise = () => {
    if (expertiseInput.trim() && !formData.expertise.includes(expertiseInput.trim())) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, expertiseInput.trim()],
      });
      setExpertiseInput('');
    }
  };

  const removeExpertise = (exp: string) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((e) => e !== exp),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: any = {
        name: formData.name,
        bio: formData.bio,
        profilePic: formData.profilePic,
        languages: formData.languages,
      };

      if (currentUser?.role === 'GUIDE') {
        updateData.expertise = formData.expertise;
        // Use unary plus operator or parseFloat to ensure dailyRate is a number or null
        updateData.dailyRate = formData.dailyRate ? +formData.dailyRate : null;
      }

      if (currentUser?.role === 'TOURIST') {
        updateData.travelPreferences = formData.travelPreferences;
      }

      await api.patch(`/users/${profileId}`, updateData);
      toast.success('Profile updated successfully! ✨');
      router.push(`/profile/${profileId}`);
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DarkLoading />;

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <DarkCard>
          <DarkCardHeader>
            <h1 className="text-3xl font-extrabold text-amber-400">Edit Profile 📝</h1>
            <p className="text-gray-400 mt-2">
              Update your personal details to keep your profile current.
            </p>
          </DarkCardHeader>

          <DarkCardBody>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Picture */}
              <SingleImageUpload 
                onUploadComplete={handleProfilePicUpload}
                existingImage={formData.profilePic}
                label="Profile Picture"
                // Custom dark theme styles for the upload component
                // className="border-gray-700 bg-gray-900 p-4 rounded-lg" 
              />
              
              <div className='space-y-6'>
                {/* Basic Info */}
                <div>
                  <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <DarkInput
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150"
                        placeholder="Tell us about yourself and your passions..."
                      />
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Languages 🗣️</h2>
                  
                  <div className="flex gap-2 mb-3">
                    <DarkInput
                      value={languageInput}
                      onChange={(e: any) => setLanguageInput(e.target.value)}
                      placeholder="e.g., English, Spanish, French"
                      onKeyPress={(e: any) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addLanguage();
                        }
                      }}
                    />
                    <AmberButton
                      type="button"
                      onClick={addLanguage}
                      variant="outline"
                      size="sm"
                    >
                      <FiPlus className="mr-1" /> Add
                    </AmberButton>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-sky-800/40 text-sky-300 rounded-full text-sm flex items-center gap-2 border border-sky-700"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="text-sky-400 hover:text-sky-200 transition"
                        >
                          <FiX />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

        
              {currentUser?.role === 'GUIDE' && (
                <div className='space-y-6'>
                  <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Guide Details 🌟</h2>

              
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-300">Areas of Expertise</h3>
                    
                    <div className="flex gap-2 mb-3">
                      <DarkInput
                        value={expertiseInput}
                        onChange={(e: any) => setExpertiseInput(e.target.value)}
                        placeholder="e.g., Food Tours, History, Photography"
                        onKeyPress={(e: any) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addExpertise();
                          }
                        }}
                      />
                      <AmberButton
                        type="button"
                        onClick={addExpertise}
                        variant="outline"
                        size="sm"
                      >
                        <FiPlus className="mr-1" /> Add
                      </AmberButton>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.expertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-amber-800/40 text-amber-300 rounded-full text-sm flex items-center gap-2 border border-amber-700"
                        >
                          {exp}
                          <button
                            type="button"
                            onClick={() => removeExpertise(exp)}
                            className="text-amber-400 hover:text-amber-200 transition"
                          >
                            <FiX />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                
                  <DarkInput
                    label="Daily Rate ($ USD)"
                    name="dailyRate"
                    type="number"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    placeholder="150"
                    min="0"
                  />
                </div>
              )}

              
              {currentUser?.role === 'TOURIST' && (
                <div className='space-y-6'>
                  <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Travel Preferences 🗺️</h2>
                  <div>
                    <label htmlFor="travelPreferences" className="block text-sm font-medium text-gray-300 mb-1">
                      Travel Interests
                    </label>
                    <textarea
                      id="travelPreferences"
                      name="travelPreferences"
                      value={formData.travelPreferences}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150"
                      placeholder="e.g., Adventure, Food, Culture, Photography"
                    />
                  </div>
                </div>
              )}

             
              <div className="flex gap-4 pt-6 border-t border-gray-700">
                <AmberButton
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </AmberButton>
                <AmberButton
                  type="submit"
                  isLoading={saving}
                  className="flex-1"
                >
                  <FiSave className="mr-2" /> Save Changes
                </AmberButton>
              </div>
            </form>
          </DarkCardBody>
        </DarkCard>
      </div>
    </div>
  );
}

