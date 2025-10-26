import React from 'react';

interface ChartStatisticsProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  badgeChange: string;
  valueChange: string;
  changeColor: string;
  iconBgColor?: string;
}

const ChartStatistics: React.FC<ChartStatisticsProps> = ({
  icon,
  title,
  value,
  badgeChange,
  valueChange,
  changeColor,
  iconBgColor = 'bg-blue-100',
}) => {
  return (
    <div className="flex flex-col align-start p-6 gap-8 bg-white border border-gray-300 shadow-sm rounded-2xl w-[410.67px] h-[220px]">
      <div className="flex flex-row items-start p-0 gap-6 w-[356.67px] h-[48px]">
        <div className="flex flex-row items-center p-0 gap-[250px] w-[374.59px] h-[48px]">
          <div className={`${iconBgColor} rounded-lg w-[48px] h-[48px] flex items-center justify-center`}>
            {icon}
          </div>
          <div className="bg-green-100 px-2.5 py-2.5 rounded-lg border border-green-200 w-[58.08px] h-[24.35px] flex items-center justify-center">
            <span className={`text-xs font-normal ${changeColor}`}>{badgeChange}</span>
            <svg width="10.7" height="10.7" viewBox="0 0 10.7 10.7" fill="none" className="inline ml-1">
              <path d="M5.35 0L10.7 10.7H0L5.35 0Z" fill="#14CA74"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-end p-0 gap-3 w-[162px] h-[34px]">
        <span className="text-gray-700 font-semibold text-5xl leading-7 font-ibm-plex-sans text-[48px]" style={{ lineHeight: '140%' }}>
          {value}
        </span>
        <span className={`font-medium text-base leading-6 font-ibm-plex-sans text-[16px] ${changeColor}`} style={{ lineHeight: '140%' }}>
          {valueChange}
        </span>
      </div>
      <span className="text-gray-600 font-normal text-xl leading-6 font-ibm-plex-sans text-[18px]" style={{ lineHeight: '140%' }}>
        {title}
      </span>
    </div>
  );
};

export default ChartStatistics;
