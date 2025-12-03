import Link from "next/link";
import React from "react";

type ActionButtonsProps = {
  onSetReminder?: () => void;
  onAddToCalendar?: () => void;
  onAttend?: () => void;
};

export default function ActionButtons({
  onSetReminder,
  onAddToCalendar,
}: ActionButtonsProps) {
  return (
    <div className="flex space-x-4 mt-6 justify-end">
      <button
        onClick={onSetReminder}
        className="flex items-center space-x-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
      >
     <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.9994 0C6.44628 0 5.9994 0.446875 5.9994 1V1.6C3.71815 2.0625 1.9994 4.08125 1.9994 6.5V7.0875C1.9994 8.55625 1.45878 9.975 0.483777 11.075L0.252527 11.3344C-0.00997317 11.6281 -0.0724732 12.05 0.0869018 12.4094C0.246277 12.7688 0.605652 13 0.999402 13H12.9994C13.3932 13 13.7494 12.7688 13.9119 12.4094C14.0744 12.05 14.0088 11.6281 13.7463 11.3344L13.515 11.075C12.54 9.975 11.9994 8.55937 11.9994 7.0875V6.5C11.9994 4.08125 10.2807 2.0625 7.9994 1.6V1C7.9994 0.446875 7.55253 0 6.9994 0ZM8.41503 15.4156C8.79003 15.0406 8.9994 14.5312 8.9994 14H6.9994H4.9994C4.9994 14.5312 5.20878 15.0406 5.58378 15.4156C5.95878 15.7906 6.46815 16 6.9994 16C7.53065 16 8.04003 15.7906 8.41503 15.4156Z" fill="#9B2033"/>
</svg>

        <span>Set Reminder</span>
      </button>

      <button
        onClick={onAddToCalendar}
        className="flex items-center space-x-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
      >
       <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 1V2H1.5C0.671875 2 0 2.67188 0 3.5V5H14V3.5C14 2.67188 13.3281 2 12.5 2H11V1C11 0.446875 10.5531 0 10 0C9.44687 0 9 0.446875 9 1V2H5V1C5 0.446875 4.55312 0 4 0C3.44688 0 3 0.446875 3 1ZM14 6H0V14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V6ZM7 7.75C7.41563 7.75 7.75 8.08438 7.75 8.5V10.25H9.5C9.91562 10.25 10.25 10.5844 10.25 11C10.25 11.4156 9.91562 11.75 9.5 11.75H7.75V13.5C7.75 13.9156 7.41563 14.25 7 14.25C6.58437 14.25 6.25 13.9156 6.25 13.5V11.75H4.5C4.08437 11.75 3.75 11.4156 3.75 11C3.75 10.5844 4.08437 10.25 4.5 10.25H6.25V8.5C6.25 8.08438 6.58437 7.75 7 7.75Z" fill="#9B2033"/>
</svg>

        <span>Add to Calendar</span>
      </button>
    <Link href="/LiveSession">
  <div className="bg-red-900 text-white px-10 py-1 rounded-lg text-sm hover:bg-red-800 transition text-center cursor-pointer">
    I’m Attending
  </div>
</Link>
    </div>
  );
}
