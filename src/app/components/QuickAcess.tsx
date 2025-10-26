import Link from 'next/link'
import { HiOutlineMap } from 'react-icons/hi'

const quickAccessItems = [
  {
    label: 'Schedule',
    desc: 'Full program',
    img: '/images/div.png',
    Link: '/participants/Schedule',
  },
  {
    label: 'My Agenda',
    desc: 'Personal schedule',
    img: '/images/div (1).png',
    Link: '/participants/MyAgenda',
  },
  {
    label: 'Speakers',
    desc: 'Expert profiles',
    img: '/images/div (2).png',
    Link: '/participants/Speakers',
  },
  {
    label: 'Sponsors',
    desc: 'Partners & exhibits',
    img: '/images/div (3).png',
    Link: '/participants/Sponsors&Exhibitors',
  },
  {
    label: 'Networking',
    desc: 'Connect & chat',
    img: '/images/div (4).png',
    Link: '/participants/Networking',
  },
  {
    label: 'Venue Maps',
    desc: 'Find your way',
    icon: <HiOutlineMap className="w-10 h-10 text-red-500 mb-3" />,
    Link: '/participants/vanue',
  },
]

export default function QuickAccess() {
  return (
    <section className="bg-white p-6 md:p-10 rounded-2xl shadow-md w-full border border-gray-200">
      <h2 className="text-lg md:text-xl font-semibold mb-6 text-[#282828]">Quick Access</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {quickAccessItems.map((item) => {
          const content = (
            <div className="flex flex-col items-center text-center bg-[#F9FAFB] hover:bg-white border border-gray-200 hover:border-red-400 rounded-xl p-6 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
              {item.icon ? (
                item.icon
              ) : (
                <img src={item.img} alt={item.label} className="w-12 h-12 mb-3 object-contain" />
              )}
              <p className="font-semibold text-[#1F2937]">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          )

          return item.Link ? (
            <Link href={item.Link} key={item.label} className="block">
              {content}
            </Link>
          ) : (
            <div key={item.label}>{content}</div>
          )
        })}
      </div>
    </section>
  )
}
