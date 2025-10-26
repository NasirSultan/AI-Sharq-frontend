'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageComponent from '../../components/Images';
import Link from 'next/link';
import {  FaEyeSlash, FaExclamationCircle, } from 'react-icons/fa';

export default function SetNewPassword() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear errors on change
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = { newPassword: '', confirmPassword: '' };
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return !newErrors.newPassword && !newErrors.confirmPassword;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission here
      console.log('Form submitted:', formData);
      // You can add API call or navigation here
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-20 p-3 bg-gray-50 relative">
      {/* Need help? Contact Support */}
      <span className="absolute w-[191px] h-[11px] left-[calc(50%-191px/2+0.5px)] top-[916px] font-['SF_Pro_Display'] font-normal text-[16px] leading-[30px] text-center text-[#282828]">
        Need help? <strong className='text-red-700'>Contact Support</strong>
      </span>
      {/* Left side - Image */}
      <div className="hidden md:block flex-shrink-0 mt-[100px]">
        <ImageComponent />
      </div>

      {/* Right side - Form Container */}
      <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-8 max-w-md w-full">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/images/logo1.png"
            alt="Al Sharq Logo"
            width={157}
            height={47}
            className="object-contain mb-[30px]"
          />
          <h1 className="mt-2 text-2xl font-semibold text-gray-800 text-center">
            Setup New Password
          </h1>
        </div>

        {/* Description */}
        <p className="mb-6 text-center text-gray-700 text-base leading-relaxed">
          Choose a strong password to secure your account. Make sure it's something you'll remember.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
              New Password*
            </label>
            <div className="relative">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 ${
                  errors.newPassword ? 'border-red-600' : 'border-gray-300'
                }`}
              />
              <FaEyeSlash className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
                <FaExclamationCircle /> {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm New Password*
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 ${
                  errors.confirmPassword ? 'border-red-600' : 'border-gray-300'
                }`}
              />
              <FaEyeSlash className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
                <FaExclamationCircle /> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password requirements */}
          <div className="flex items-start gap-2 text-gray-500 text-sm mb-6">
            <FaExclamationCircle className="mt-1 text-red-700" size={20} />
            <p>
              Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
            </p>
          </div>

          {/* Save Change Button */}
          <Link href="/participants/SetUpYourProfile">
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Save Change
          </button>
          </Link>
        </form>
      </div>
      <Image src="/images/line.png" alt="Line" width={1729} height={127} className="absolute top-[1010px]" />
    </div>
  );
}

