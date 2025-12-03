type SessionDetailsProps = {
  details: {
    keyTopics: string[];
    targetAudience: string;
    language: string;
  };
};

export default function SessionDetails({ details }: SessionDetailsProps) {
  return (
    <>
          <h2 className="text-base font-semibold mb-4 text-gray-900">Session Details</h2>

    <section className="bg-white mx-auto p-6 rounded-xl shadow-sm border border-gray-200">

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Key Topics</h3>
        <div className="flex flex-wrap gap-2">
          {details.keyTopics.map((topic, idx) => (
            <span
              key={idx}
              className="bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-xs font-medium"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1 text-gray-900">Target Audience</h3>
        <p className="text-xs text-gray-700">{details.targetAudience}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-1 text-gray-900">Language</h3>
        <p className="text-xs text-gray-700">{details.language}</p>
      </div>
    </section>
    </>
  );
}
