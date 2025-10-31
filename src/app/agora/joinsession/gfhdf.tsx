 <div className="min-h-screen bg-white text-white">
      {!joined ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Join Live Stream</h1>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Channel Name"
                value={channelName}
                onChange={e => setChannelName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Token"
                value={token}
                onChange={e => setToken(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="UID"
                value={uid ?? ''}
                onChange={e => setUid(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={joinChannel}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join Stream'}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
      
      )}
    </div>