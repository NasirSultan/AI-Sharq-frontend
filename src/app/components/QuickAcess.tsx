import Link from 'next/link'
import EventLocationMap from './EventLocationMap'

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
    label: 'Partners',
    desc: 'Sponsors & exhibits',
    img: '/images/div (3).png',
    Link: '/participants/Sponsors&Exhibitors',
  },
]

export default function QuickAccess() {
  return (
   <section className="w-full bg-white p-4 md:p-6 lg:p-8 rounded-2xl">
  <div className="flex flex-col md:flex-row gap-6 w-full">

    <div className="w-full md:w-1/2">
      <EventLocationMap />
    </div>

    <div className="w-full md:w-1/2">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 w-full">
        {quickAccessItems.map((item) => (
          <Link href={item.Link} key={item.label} className="block w-full">
            <div className="flex flex-col items-center justify-center text-center bg-[#F9FAFB] hover:bg-white border border-gray-200 hover:border-red-900 rounded-xl p-6 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer h-full">
              <img
                src={item.img}
                alt={item.label}
                className="w-12 h-12 mb-3 object-contain"
              />
              <p className="font-semibold text-[#1F2937]">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>

  </div>
</section>


  )
}
