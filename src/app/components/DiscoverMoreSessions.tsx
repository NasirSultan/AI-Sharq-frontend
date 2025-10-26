export default function DiscoverMoreSessions() {
  return (
    <section className="bg-white rounded-lg shadow p-8 mx-4 md:mx-20 my-10 text-center border border-gray-200">
      <div className="mb-4 flex justify-center">
      <div className=" inline-block">
  <img 
    src="/images/div (6).png" 
    alt="Icon" 
    className="w-12 h-12 object-contain" 
  />
</div>

      </div>

      <h3 className="text-lg font-semibold mb-2 text-gray-900">Discover More Sessions</h3>
      <p className="text-sm text-gray-600 mb-6">
        Browse the full conference schedule to add more sessions to your agenda.
      </p>

      <button className="bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition">
        Browse All Sessions
      </button>
    </section>
  );
}
