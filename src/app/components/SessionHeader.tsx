// Define the type for the session prop
interface Session {
  title: string;
  time: string;
  hall: string;
  duration: string;
  capacity: string;
  description: string;
}

interface SessionHeaderProps {
  session: Session;
}

export function SessionHeader({ session }: SessionHeaderProps) {
  return (
    <div className="mb-6 p-4 max-w-8xl py-8 border border-gray-200 rounded-xl bg-white">

      <div className="flex justify-between text-xs text-red-700 font-semibold mb-1 ml-2">
        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-xl">Workshop</span>
        <div>{session.time}</div>
      </div>
      <h1 className="text-lg font-bold mb-1 text-black ml-2">{session.title}</h1>
      <div className="flex items-center text-xs text-gray-500 mb-2 space-x-4 ml-2">
      <div className="flex items-center space-x-2">
  <img src="/images/Vector.png" alt="Hall Icon" className="w-4 h-4" />
  <strong>{session.hall}</strong>
</div>

<div className="flex items-center space-x-2">
  <img src="/images/Vector (1).png" alt="Duration Icon" className="w-4 h-4" />
 <span>{session.duration}</span>
</div>

<div className="flex items-center space-x-2">
  <img src="/images/Vector (2).png" alt="Capacity Icon" className="w-4 h-4" />
   <span>{session.capacity}</span>
</div>

      </div>
      <p className="text-xs text-gray-600 ml-2">{session.description}</p>
    </div>
  );
}
