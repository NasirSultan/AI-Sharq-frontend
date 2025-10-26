import Link from 'next/link'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'

export default function SessionForums() {
  return (
    <div>  {/* Header Section */}
        <div className="box-border flex flex-col items-start p-6 gap-6 w-[1280px] h-24 bg-[#FFEEEE] border border-[#D4D4D4] shadow-sm rounded-3xl">
          <div className="flex flex-col items-start p-0 gap-4 w-[1216px] h-12">
            <div className="flex flex-row items-center p-0 gap-4 w-[1216px] h-12">
              <div className="flex flex-col items-start p-0 gap-4 w-[1169px] h-12">
                <div className="flex flex-row items-center p-0 gap-3 w-[1169px] h-12">
                  <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
                    <FaMessage className="text-[#9B2033] text-xl" />
                  </div>
                  <div className="flex flex-col items-start p-0 gap-4 w-[1107px] h-8">
                    <h2 className="text-lg font-semibold text-[#9B2033]">Chats List</h2>
                  </div>
                
<Link href="/participants/Masseges">
  <FaArrowRight className="text-[#9B2033] text-2xl ml-auto" />
</Link>
                </div>
              </div>
            </div>
          </div>
        </div> <br></br>
                  </div>
  )
}
