// components/Profile/ProfileForm.jsx
import React, { useState, useEffect } from 'react';
import { Save, X, Globe, MapPin, User, FileText, Twitter, Linkedin } from 'lucide-react';

const ProfileForm = ({ profile, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    website: '',
    twitter_handle: '',
    linkedin_url: '',
    location: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        website: profile.website || '',
        twitter_handle: profile.twitter_handle || '',
        linkedin_url: profile.linkedin_url || '',
        location: profile.location || ''
      });
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    // URL validation
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (formData.linkedin_url && !isValidUrl(formData.linkedin_url)) {
      newErrors.linkedin_url = 'Please enter a valid LinkedIn URL';
    }

    // Twitter handle validation
    if (formData.twitter_handle) {
      const twitterRegex = /^@?[\w]+$/;
      if (!twitterRegex.test(formData.twitter_handle)) {
        newErrors.twitter_handle = 'Please enter a valid Twitter handle';
      }
    }

    // Bio length validation
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up twitter handle
      const cleanData = {
        ...formData,
        twitter_handle: formData.twitter_handle.startsWith('@') 
          ? formData.twitter_handle 
          : formData.twitter_handle ? `@${formData.twitter_handle}` : ''
      };
      
      onSave(cleanData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
          <User className="h-4 w-4 inline mr-1" />
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.full_name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your full name"
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="h-4 w-4 inline mr-1" />
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.bio ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Tell us about yourself..."
        />
        <div className="flex justify-between mt-1">
          {errors.bio && (
            <p className="text-sm text-red-600">{errors.bio}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {formData.bio.length}/500 characters
          </p>
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="h-4 w-4 inline mr-1" />
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="City, Country"
        />
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="h-4 w-4 inline mr-1" />
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.website ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="https://your-website.com"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website}</p>
        )}
      </div>

      {/* Social Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Twitter Handle */}
        <div>
          <label htmlFor="twitter_handle" className="block text-sm font-medium text-gray-700 mb-2">
            <Twitter className="h-4 w-4 inline mr-1" />
            Twitter Handle
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">@</span>
            <input
              type="text"
              id="twitter_handle"
              name="twitter_handle"
              value={formData.twitter_handle.replace('@', '')}
              onChange={handleChange}
              className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.twitter_handle ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="username"
            />
          </div>
          {errors.twitter_handle && (
            <p className="mt-1 text-sm text-red-600">{errors.twitter_handle}</p>
          )}
        </div>

        {/* LinkedIn URL */}
        <div>
          <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-2">
            <Linkedin className="h-4 w-4 inline mr-1" />
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin_url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.linkedin_url ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://linkedin.com/in/username"
          />
          {errors.linkedin_url && (
            <p className="mt-1 text-sm text-red-600">{errors.linkedin_url}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <X className="h-4 w-4 mr-2 inline" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;