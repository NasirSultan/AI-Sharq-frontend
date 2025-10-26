type SpeakerProps = {
  speaker: {
    image: string;
    name: string;
    title: string;
    organization: string;
    bio: string;
  };
};

export default function Speaker({ speaker }: SpeakerProps) {
  return (
    <section>
          <h2 className="text-lg font-semibold mb-4 ml-3 text-black">Speakers</h2> {/* Heading yeh hai */}

    <div className="bg-white rounded-lg p-6 flex items-center space-x-4 shadow-sm border border-gray-200 mb-6">
      
      <img
        src={speaker.image}
        alt={speaker.name}
        className="w-20 h-20 rounded-full object-cover"
      />
      <div className="flex-1 text-xs text-gray-800">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="font-semibold text-base">{speaker.name}</h3>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{speaker.title}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{speaker.organization}</span>
          <button className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-xl">
            Keynote Speaker
          </button>
        </div><br></br>
        <p className="text-gray-700 leading-relaxed">{speaker.bio}</p>
      </div>
    </div>
    </section>
  );
}
