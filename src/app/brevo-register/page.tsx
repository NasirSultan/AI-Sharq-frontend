'use client'

import Image from 'next/image'

export default function EmailPreview() {
  const email = {
    subject: 'Welcome to Al Sharq Forum',
    content: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #b91c1c;">Welcome, Nasir</h2>
        <p style="color: #333;">We are happy to have you with us.</p>
        <p style="color: #333;">Click below to start exploring.</p>
        <a href="https://yourapp.com"
           style="display: inline-block; padding: 10px 20px; background: #b91c1c; color: white; border-radius: 8px; text-decoration: none;">
           Visit Dashboard
        </a>
        <p style="margin-top: 20px; color: gray;">Thanks,<br/>Al Sharq Forum Team</p>
      </div>
    `
  }

  return (
    <div className="relative min-h-screen bg-red-50 flex flex-col items-center p-8 overflow-hidden">
      {/* Top Logo */}
      <div className="mb-4">
        <Image
          src="/images/logo1.png"
          alt="Logo"
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      {/* Email Preview Card */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 border border-red-200 relative z-10">
        <h1 className="text-xl font-semibold mb-4 text-red-700">
          Email Preview
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Subject: {email.subject}
        </p>
        <div
          className="border border-gray-200 rounded-lg p-4"
          dangerouslySetInnerHTML={{ __html: email.content }}
        />
      </div>

      {/* Bottom Line */}
      <img
        src="/images/line.png"
        alt="Line"
        className="absolute bottom-0 w-full"
      />
    </div>
  )
}




