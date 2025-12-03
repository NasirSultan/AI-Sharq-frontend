'use client';

import React, { useState } from 'react';
import { FaUser, FaEye, FaEyeSlash, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/config/api';

const SetUpYourProfile: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    Pic_url: '',
    email: '',
    phone: '',
    category: '',
    password: '',
    website: '',
    linkedin: '',
    twitter: '',
    youtube: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { ...formData };

    if (!profileImage && !formData.Pic_url) {
      payload.Pic_url = 'https://example.com/default-image.png';
    } else if (profileImage) {
      payload.Pic_url = URL.createObjectURL(profileImage);
    }

    try {
      const response = await api.post('/sponsors', payload);

      if (response.status === 200 || response.status === 201) {
        console.log('Success: Sponsor profile created', response.data);
        localStorage.setItem('sponsorId', response.data.id.toString());
        router.push('/sponsors/sponsorsproducts');
      } else {
        console.log('Rejected: Unexpected response', response.data);
      }
    } catch (err: any) {
      if (err.response) {
        console.log('Rejected: Server responded with error', err.response.data);
      } else if (err.request) {
        console.log('Rejected: No response from server', err.request);
      } else {
        console.log('Rejected: Error', err.message);
      }
    }
  };

  const handleSkip = () => {
    console.log('Skipped');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-lg">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-medium text-gray-900 text-center">
              Set Up Your Sponsor Profile
            </h1>
            <p className="text-base text-gray-900 text-center max-w-sm">
              Complete your profile to personalize your event experience and connect with others
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-red-100 border-4 border-white rounded-full shadow-md flex items-center justify-center">
                <FaUser className="text-4xl text-red-600" />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-11 h-11 bg-red-600 rounded-full shadow-md flex items-center justify-center"
                onClick={() => document.getElementById('profile-upload')?.click()}
              >
                <FaPlus className="text-white text-lg" />
              </button>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-base text-gray-900 text-center">Upload Logo</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-1">
              <label>Sponsor Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Sponsor Name"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Category*</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Website*</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Website"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="LinkedIn"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Twitter</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="Twitter"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>YouTube</label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                placeholder="YouTube"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1 relative">
              <label>Password*</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl pr-12"
                required
              />
              {formData.password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>


            <div className="flex flex-col gap-1">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                rows={4}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl resize-none"
              />
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button
                type="submit"
                className="py-4 bg-red-600 text-white rounded-xl"
              >
                Save & Continue
              </button>
              <button
                type="button"
                onClick={() => console.log('Skipped')}
                className="py-4 border border-gray-300 rounded-xl"
              >
                Skip for Now
              </button>
            </div>
          </form>
        </div>
      </div>
      <Image src="/images/line.png" alt="Line" width={1450} height={127} className="absolute top-[1850px]" />
    </div>
  );
};

export default SetUpYourProfile;
