import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="bg-[#9B2033] min-h-screen w-full flex flex-col justify-between items-center relative">
      {/* Center Content */}
      <div className="flex flex-col justify-center items-center flex-1 px-4 text-center">
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={638}
          height={224}
          className="w-[250px] md:w-[400px] lg:w-[500px] xl:w-[638px] h-auto"
        />

        {/* Buttons */}
        <div className="mt-12 flex flex-row gap-4 md:gap-6">
          <Link href="/authentication/SignUp">
            <button className="bg-white text-[#9B2033]  border border-white cursor-pointer px-6 py-2 hover:bg-[#9B2033]  hover:border-white hover:text-white rounded transition">
              Sign Up
            </button>
          </Link>
          <Link href="/authentication/SignIn">
            <button className="bg-transparent border border-white text-white cursor-pointer px-6 py-2 rounded hover:bg-white hover:text-[#9B2033] transition">
      Login
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Line Image */}
      <div className="w-full">
        <Image
          src="/images/line.png"
          alt="Line"
          width={1729}
          height={127}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
