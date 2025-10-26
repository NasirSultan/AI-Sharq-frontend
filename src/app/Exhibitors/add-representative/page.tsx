'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface StatusPageProps {
  message: string;
}

const StatusPage: React.FC<StatusPageProps> = ({ message }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Status</h1>
        <p className="text-gray-700 text-lg">{message}</p>
        <button
          onClick={() => router.back()}
          className="mt-6 py-3 px-6 rounded-xl border border-gray-300 hover:bg-gray-100"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default StatusPage;
