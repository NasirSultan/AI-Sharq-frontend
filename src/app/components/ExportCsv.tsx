import React from 'react';

interface ExportCsvProps {
  className?: string;
}

const ExportCsv: React.FC<ExportCsvProps> = ({ className = '' }) => {
  const handleExport = (format: string) => {
    // Handle export logic here
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      <button
        onClick={() => handleExport('PDF')}
        className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 font-medium transition-colors"
      >
        Export PDF
      </button>
      <button
        onClick={() => handleExport('Excel')}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
      >
        Export Excel
      </button>
      <button
        onClick={() => handleExport('CSV')}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
      >
        Export CSV
      </button>
    </div>
  );
};

export default ExportCsv;
