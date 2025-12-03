'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageComponent from '../../components/Images';
import Link from 'next/link';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });


  return (
    <div className="flex gap-20  mt-10">
      {/* Need help? Contact Support */}
      <span className="absolute w-[191px] h-[11px] left-[calc(50%-191px/2+0.5px)] top-[916px] font-['SF_Pro_Display'] font-normal text-[16px] leading-[30px] text-center text-[#282828]">
        Need help? <strong className='text-red-700'>Contact Support</strong>
      </span>
      {/* Left side - Image */}
      <ImageComponent />

      {/* Right side - Form Container */}
      <div className="absolute w-[525px] h-[667px] left-[800px] top-[calc(50%-567px/2+0.5px)] bg-white border border-[#D4D4D4] shadow-[0px_4px_110.3px_rgba(68,68,68,0.25)] rounded-[20px] flex flex-col items-center p-[42px_60px] gap-[42px] box-border">
        {/* Frame 1000004789 */}
        <div className="flex flex-col items-center gap-[30px] w-[358px] h-[94px]">
          {/* al sharq guidelines-3 copy */}
          <Image
            src="/images/logo2.png"
            alt="Al Sharq Logo"
            width={157}
            height={47}
            className="w-[157px] h-[47px]"
          />
          {/* Enter Verification Code */}
          <h1 className="w-[248px] h-[17px] font-['IBM_Plex_Sans'] font-medium text-[24px] leading-[24px] text-center text-[#282828]">
           <b> Enter Verification Code</b>
          </h1>
        </div>

        {/* We've sent a 4-digit verification code... */}
        <p className="w-[381px] h-[59px] font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[150%] text-center text-[#282828]">
          We've sent a 4-digit verification code to your email address. Please enter the code below to continue. Code sent to: <b>user@example.com</b>
        </p>

        {/* Input */}
        <div className="flex flex-col justify-center items-center gap-[24px] w-[405px] h-[246px]">
          {/* Frame 31 */}
          <div className="flex flex-row items-center gap-[7.14px] w-[405px] h-[93px]">
            {/* Frame 28 */}
            <div className="flex flex-col justify-center items-center p-[20.2331px_22.6135px] gap-[11.9px] w-[95.89px] h-[93px] border border-[#9B2033] rounded-[24px] flex-1">
              <input
                type="text"
                maxLength={1}
                className="w-[26px] h-[29px] font-['IBM_Plex_Sans'] font-medium text-[42px] leading-[55px] text-center text-[#262626] border-none outline-none bg-transparent"
                defaultValue="9"
              />
            </div>
            {/* Frame 27 */}
            <div className="flex flex-row justify-center items-center gap-[4.76px] w-[95.89px] h-[93px] bg-[rgba(213,243,241,0.1)] shadow-[0px_0px_0px_4px_rgba(1,65,34,0.25)] rounded-[24px] flex-1">
              <div className="flex flex-col justify-center items-center p-[20.2331px_22.6135px] gap-[11.9px] w-[95.89px] h-[93px] bg-[#FFE8E8] border-2 border-[#9B2033] rounded-[24px]">
                <input
                  type="text"
                  maxLength={1}
                  className="w-[26px] h-[29px] font-['IBM_Plex_Sans'] font-medium text-[42px] leading-[55px] text-center text-[#9B2033] border-none outline-none bg-transparent"
                  defaultValue="1"
                />
              </div>
            </div>
            {/* Frame 5 */}
            <div className="flex flex-col justify-center items-center p-[20.2331px_22.6135px] gap-[11.9px] w-[95.89px] h-[93px] border border-[#DEDEDE] rounded-[24px] flex-1">
              <input
                type="text"
                maxLength={1}
                className="w-[26px] h-[29px] font-['IBM_Plex_Sans'] font-medium text-[42px] leading-[55px] text-center text-[#C5C5C5] border-none outline-none bg-transparent"
                placeholder="0"
              />
            </div>
            {/* Frame 26 */}
            <div className="flex flex-col justify-center items-center p-[20.2331px_22.6135px] gap-[11.9px] w-[95.89px] h-[93px] border border-[#DEDEDE] rounded-[24px] flex-1">
              <input
                type="text"
                maxLength={1}
                className="w-[26px] h-[29px] font-['IBM_Plex_Sans'] font-medium text-[42px] leading-[55px] text-center text-[#C5C5C5] border-none outline-none bg-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Frame 32 */}
          <div className="flex flex-row items-center gap-[16px] w-[405px] h-[11px]">
            <span className="w-[291px] h-[11px] font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[150%] text-[#757575]">
              Didn't receive the code?
            </span>
            <span className="w-[98px] h-[11px] font-['IBM_Plex_Sans'] font-bold text-[16px] leading-[150%] text-center underline text-[#9B2033] cursor-pointer">
              Resend Code
            </span>
          </div>
        </div>

        {/* Frame 34 */}
        <div className="flex flex-row items-center gap-[10px] w-[405px] h-[59px]">
          {/* Frame 8 */}
          <button className="flex flex-row justify-center items-center p-[40px_10px] gap-[10px] w-[405px] h-[59px] bg-[#9B2033] rounded-[12px] flex-1 border-none outline-none">
            
            
            <Link href="/authentication/SetNewPassword">
            <span className="w-[83px] h-[11px] font-['IBM_Plex_Sans'] font-medium text-[16px] leading-[21px] text-center text-white">
              Verify Code
            </span>
            </Link>
          </button>
        </div>

        {/* Try a different email address */}
        <span className="w-[205px] h-[11px] font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[30px] text-center underline text-[#9B2033] cursor-pointer">
          Try a different email address
        </span>
      </div>
      
      <Image src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute top-[1010px]" />
    </div>
  );
}
