'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageComponent from '../../components/Images';
import { FaEnvelope,  } from 'react-icons/fa';
import Link from 'next/link';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="flex gap-20 mt-10">
      {/* Need help? Contact Support */}
      <span className="absolute w-[191px] h-[11px] left-[calc(50%-191px/2+0.5px)] top-[916px] font-['SF_Pro_Display'] font-normal text-[16px] leading-[30px] text-center text-[#282828]">
        Need help? <strong className='text-red-700'>Contact Support</strong>
      </span>
      {/* Left side - Image */}
      <ImageComponent />

      {/* Right side - Form Container */}
      <div className="absolute w-[525px] h-[480px] left-[800px] top-[calc(50%-300px/2)] bg-white border border-[#D4D4D4] shadow-[0px_4px_110.3px_rgba(68,68,68,0.25)] rounded-[20px] flex flex-col items-center p-[32px_48px] gap-[24px] box-border">
        {/* Frame 1000004789 */}
        <div className="flex flex-col items-center gap-[20px] w-[358px] h-[94px]">
          {/* al sharq guidelines-3 copy */}
          <Image
            src="/images/logo1.png"
            alt="Al Sharq Logo"
            width={157}
            height={47}
            className='mb-[20px]'
          />
          {/* Forgot Password */}
          <h1 className="w-[180px] h-[17px] font-['IBM_Plex_Sans'] font-medium text-[24px] leading-[24px] text-center text-[#282828] tracking-[-0.01em] ">
           <b>Forgot Password</b>
          </h1>
        </div>

        {/* We've sent a 4-digit verification code... */}
        <p className="w-[381px] h-[59px] mt-4 font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[150%] text-center text-[#282828]">
          We've sent a 4-digit verification code to your email address. Please enter the code below to continue. Code sent to: <b>user@example.com</b> 
        </p>

        {/* Input */}
        <div className="flex flex-col justify-center items-center gap-[16px] w-[405px] h-[120px]">
          {/* Frame 33834 */}
          <div className="flex flex-col items-start gap-[8px] w-[405px] h-[76px]">
            {/* Email Address* */}
            <label className="w-[405px] h-[11px] font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[21px] text-[#262626]">
              Email Address*
            </label>
            {/* Frame 38 */}
            <div className="flex flex-row items-start gap-[6px] w-[405px] h-[53px] mt-2">
              {/* Frame 5 */}
              <div className="flex flex-col justify-center items-start p-[14px_16px] gap-[8px] w-[405px] h-[53px] border border-[#DEDEDE] rounded-[10px]">
                {/* Frame 2 */}
                <div className="flex flex-row items-center gap-[10px] w-[367px] h-[20px]">
                  {/* Frame 33829 */}
                  <div className="flex flex-col items-start gap-[8px] w-[335px] h-[11px]">
                    {/* Enter Your Email Address */}
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Your Email Address"
                      className="w-[190px] h-[11px] font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[21px] text-[#616161] border-none outline-none bg-transparent"
                    />
                  </div>
                  {/* Mail Icon */}
                  <FaEnvelope size={20} color="#9C9C9C" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frame 34 */}
        <div className="flex flex-row items-center gap-[10px] w-[405px] h-[59px]">
          {/* Frame 8 */}
          <button className="flex flex-row justify-center items-center p-[16px] gap-[10px] w-[405px] h-[59px] bg-[#9B2033] rounded-[12px] border-none outline-none">
            {/* Send Code */}
            <Link href="/authentication/Code">
            <span className="w-[78px] h-[11px] font-['IBM_Plex_Sans'] font-medium text-[16px] leading-[11px] text-center text-white tracking-[-0.01em]">
              Send Code
            </span>
            </Link>

          </button>
        </div>
      </div>
      
      <Image src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute top-[1010px]" />
    </div>
  );
}



