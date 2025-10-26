'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, UserPlus, Users, MessageSquare, Send, X, Settings, LogOut } from 'lucide-react'

let AgoraRTC: any
let AgoraRTM: any
if (typeof window !== 'undefined') {
  AgoraRTC = require('agora-rtc-sdk-ng')
}

const AgoraLiveStream = () => {
  const [token, setToken] = useState('')
  const [channelName, setChannelName] = useState('')
  const [uid, setUid] = useState<number | null>(null)
  const [userName, setUserName] = useState('')
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  
  const [showParticipants, setShowParticipants] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid')
  
  const [participants, setParticipants] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  
  const localVideoRef = useRef<HTMLDivElement>(null)
  const screenShareRef = useRef<HTMLDivElement>(null)
  const clientRef = useRef<any>(null)
  const localTracksRef = useRef<any[]>([])
  const remoteUsersRef = useRef<Map<number, any>>(new Map())
  const userNamesRef = useRef<Map<number, string>>(new Map())
  const rtmClientRef = useRef<any>(null)
  const rtmChannelRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      if (localTracksRef.current) {
        localTracksRef.current.forEach(track => {
          track.stop && track.stop()
          track.close && track.close()
        })
      }
    }
  }, [])

  const joinChannel = async () => {
    if (!token || !channelName || uid === null || !userName) {
      alert('Please provide token, channel name, UID, and your name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || 'your_app_id'
      
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
      clientRef.current = client

      userNamesRef.current.set(uid, userName)

      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      localTracksRef.current = [audioTrack]

      await client.join(APP_ID, channelName, token, uid)
      await client.publish([audioTrack])

      setParticipants([{ 
        uid, 
        name: userName, 
        isLocal: true, 
        audioEnabled: true, 
        videoEnabled: false 
      }])

      client.on('user-published', async (user: any, mediaType: 'audio' | 'video') => {
        await client.subscribe(user, mediaType)
        
        if (mediaType === 'video' && user.videoTrack) {
          const remoteUserContainer = document.querySelector(`[data-remote-uid="${user.uid}"]`)
          if (remoteUserContainer) {
            const videoContainer = remoteUserContainer.querySelector('.video-container')
            if (videoContainer) {
              videoContainer.innerHTML = ''
              user.videoTrack.play(videoContainer)
            }
          }
          remoteUsersRef.current.set(user.uid, { 
            ...remoteUsersRef.current.get(user.uid), 
            hasVideo: true 
          })
        }
        
        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play()
          remoteUsersRef.current.set(user.uid, { 
            ...remoteUsersRef.current.get(user.uid), 
            hasAudio: true 
          })
        }

        updateParticipantsList()
      })

      client.on('user-unpublished', (user: any, mediaType: 'audio' | 'video') => {
        if (mediaType === 'video') {
          const userData = remoteUsersRef.current.get(user.uid)
          if (userData) {
            remoteUsersRef.current.set(user.uid, { ...userData, hasVideo: false })
          }
        }
        if (mediaType === 'audio') {
          const userData = remoteUsersRef.current.get(user.uid)
          if (userData) {
            remoteUsersRef.current.set(user.uid, { ...userData, hasAudio: false })
          }
        }
        updateParticipantsList()
      })

      client.on('user-joined', (user: any) => {
        const defaultName = `User ${user.uid}`
        if (!userNamesRef.current.has(user.uid)) {
          userNamesRef.current.set(user.uid, defaultName)
        }
        
        remoteUsersRef.current.set(user.uid, { 
          ...user, 
          hasVideo: false, 
          hasAudio: false 
        })
        updateParticipantsList()
        
        const displayName = userNamesRef.current.get(user.uid) || defaultName
        addSystemMessage(`${displayName} joined the stream`)
        
        setTimeout(() => {
          sendUserInfo()
        }, 1000)
      })

      client.on('user-left', (user: any) => {
        const userName = userNamesRef.current.get(user.uid) || `User ${user.uid}`
        remoteUsersRef.current.delete(user.uid)
        userNamesRef.current.delete(user.uid)
        updateParticipantsList()
        addSystemMessage(`${userName} left the stream`)
      })

      client.on('stream-message', (uid: number, data: any) => {
        try {
          const decoder = new TextDecoder()
          const text = decoder.decode(data)
          const message = JSON.parse(text)
          
          if (message.type === 'user-info') {
            userNamesRef.current.set(message.uid, message.userName)
            updateParticipantsList()
          } else if (message.type === 'chat') {
            setMessages(prev => [...prev, {
              type: 'user',
              sender: message.senderName,
              text: message.message,
              time: new Date().toLocaleTimeString(),
              uid: message.uid
            }])
            // Increment unread count only if chat is closed
            setShowChat(prevShowChat => {
              if (!prevShowChat) {
                setUnreadCount(prev => prev + 1)
              }
              return prevShowChat
            })
          }
        } catch (err) {
          console.error('Failed to parse stream message:', err)
        }
      })

      await client.enableDualStream()

      setJoined(true)
      addSystemMessage('You joined the live stream')
      
      setTimeout(() => {
        sendUserInfo()
      }, 500)

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to join channel')
    } finally {
      setLoading(false)
    }
  }

  const sendUserInfo = async () => {
    if (!clientRef.current) return
    
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify({
        type: 'user-info',
        userName: userName,
        uid: uid
      }))
      
      await clientRef.current.sendStreamMessage(data)
    } catch (err) {
      console.error('Failed to send user info:', err)
    }
  }

  const sendChatMessage = async (message: string) => {
    if (!clientRef.current) return
    
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify({
        type: 'chat',
        message: message,
        senderName: userName,
        uid: uid
      }))
      
      await clientRef.current.sendStreamMessage(data)
    } catch (err) {
      console.error('Failed to send chat message:', err)
    }
  }

  const updateParticipantsList = () => {
    const remote = Array.from(remoteUsersRef.current.entries()).map(([uid, user]) => {
      const name = userNamesRef.current.get(uid) || `User ${uid}`
      return {
        uid,
        name,
        isLocal: false,
        audioEnabled: user.hasAudio || false,
        videoEnabled: user.hasVideo || false
      }
    })
    
    setParticipants(prev => {
      const local = prev.find(p => p.isLocal)
      return local ? [local, ...remote] : remote
    })
  }

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, { type: 'system', text, time: new Date().toLocaleTimeString() }])
  }

  const leaveChannel = async () => {
    if (localTracksRef.current) {
      localTracksRef.current.forEach(track => {
        track.stop && track.stop()
        track.close && track.close()
      })
      localTracksRef.current = []
    }
    if (clientRef.current) {
      await clientRef.current.leave()
    }
    setJoined(false)
    setParticipants([])
    remoteUsersRef.current.clear()
    userNamesRef.current.clear()
    setIsScreenSharing(false)
    setUnreadCount(0)
    
    if (localVideoRef.current) {
      localVideoRef.current.innerHTML = ''
    }
    if (screenShareRef.current) {
      screenShareRef.current.innerHTML = ''
    }
  }

  const toggleAudio = () => {
    if (localTracksRef.current.length > 0) {
      const audioTrack = localTracksRef.current[0]
      const newState = !audioTrack.enabled
      audioTrack.setEnabled(newState)
      setIsAudioEnabled(newState)
      
      setParticipants(prev => prev.map(p => 
        p.isLocal ? { ...p, audioEnabled: newState } : p
      ))
    }
  }

  const toggleVideo = async () => {
    if (isScreenSharing) {
      alert('Stop screen sharing first to enable camera')
      return
    }

    const newState = !isVideoEnabled
    
    if (newState) {
      try {
        const videoTrack = await AgoraRTC.createCameraVideoTrack()
        
        if (localTracksRef.current.length === 1) {
          localTracksRef.current.push(videoTrack)
        } else {
          if (localTracksRef.current[1]) {
            await clientRef.current.unpublish(localTracksRef.current[1])
            localTracksRef.current[1].close()
          }
          localTracksRef.current[1] = videoTrack
        }
        
        await clientRef.current.publish(videoTrack)
        
        if (localVideoRef.current) {
          localVideoRef.current.innerHTML = ''
          videoTrack.play(localVideoRef.current)
        }
        
        setIsVideoEnabled(true)
        
        setParticipants(prev => prev.map(p => 
          p.isLocal ? { ...p, videoEnabled: true } : p
        ))
        
      } catch (err) {
        console.error('Failed to enable video:', err)
        alert('Failed to enable camera')
      }
    } else {
      if (localTracksRef.current.length > 1 && localTracksRef.current[1]) {
        const videoTrack = localTracksRef.current[1]
        await clientRef.current.unpublish(videoTrack)
        videoTrack.close()
        localTracksRef.current = [localTracksRef.current[0]]
        
        if (localVideoRef.current) {
          localVideoRef.current.innerHTML = ''
        }
      }
      
      setIsVideoEnabled(false)
      
      setParticipants(prev => prev.map(p => 
        p.isLocal ? { ...p, videoEnabled: false } : p
      ))
    }
  }

  const startScreenShare = async () => {
    if (!clientRef.current) return
    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack({})
      
      // Stop and unpublish video track if exists
      if (localTracksRef.current.length > 1 && localTracksRef.current[1]) {
        await clientRef.current.unpublish(localTracksRef.current[1])
        localTracksRef.current[1].close()
        if (localVideoRef.current) {
          localVideoRef.current.innerHTML = ''
        }
      }
      
      await clientRef.current.publish(screenTrack)
      
      if (screenShareRef.current) {
        screenShareRef.current.innerHTML = ''
        screenTrack.play(screenShareRef.current)
      }
      
      if (localTracksRef.current.length === 1) {
        localTracksRef.current.push(screenTrack)
      } else {
        localTracksRef.current[1] = screenTrack
      }
      
      // Listen for screen share stop event
      screenTrack.on('track-ended', () => {
        stopScreenShare()
      })
      
      setIsScreenSharing(true)
      setIsVideoEnabled(false)
      
      setParticipants(prev => prev.map(p => 
        p.isLocal ? { ...p, videoEnabled: false } : p
      ))
      
      addSystemMessage('Screen sharing started')
    } catch (err: any) {
      console.error('Screen share failed:', err)
      if (err.code === 'PERMISSION_DENIED' || err.name === 'NotAllowedError') {
        alert('Screen sharing permission denied')
      } else {
        alert('Failed to start screen sharing')
      }
    }
  }

  const stopScreenShare = async () => {
    if (!clientRef.current) return
    try {
      if (localTracksRef.current.length > 1 && localTracksRef.current[1]) {
        await clientRef.current.unpublish(localTracksRef.current[1])
        localTracksRef.current[1].close()
        localTracksRef.current = [localTracksRef.current[0]]
        
        if (screenShareRef.current) {
          screenShareRef.current.innerHTML = ''
        }
      }
      
      setIsScreenSharing(false)
      
      addSystemMessage('Screen sharing stopped')
    } catch (err) {
      console.error('Failed to stop screen share:', err)
    }
  }

  const sendMessage = () => {
    if (!messageInput.trim()) return
    
    const newMessage = {
      type: 'user',
      sender: userName,
      text: messageInput,
      time: new Date().toLocaleTimeString(),
      uid: uid
    }
    
    setMessages(prev => [...prev, newMessage])
    
    sendChatMessage(messageInput)
    
    setMessageInput('')
  }

  const toggleChatPanel = () => {
    setShowChat(!showChat)
    // Reset unread count when opening chat
    if (!showChat) {
      setUnreadCount(0)
    }
  }

  const renderLocalVideoContainer = () => {
    return (
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        {isScreenSharing ? (
          <div 
            ref={screenShareRef}
            className="w-full h-full video-container"
          />
        ) : (
          <div 
            ref={localVideoRef}
            className="w-full h-full video-container"
          />
        )}
        
        <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-lg">
          <p className="font-semibold">{userName} (You)</p>
          {isScreenSharing && <p className="text-xs text-green-400">Screen Sharing</p>}
        </div>
        
        {!isAudioEnabled && (
          <div className="absolute top-4 right-4 bg-red-600 p-2 rounded-full">
            <MicOff size={16} />
          </div>
        )}
        
        {!isVideoEnabled && !isScreenSharing && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl">
              {userName[0]?.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderRemoteVideoContainer = (userId: number, user: any) => {
    const displayName = userNamesRef.current.get(userId) || `User ${userId}`
    
    return (
      <div 
        key={userId} 
        className="relative bg-black rounded-lg overflow-hidden aspect-video"
        data-remote-uid={userId}
      >
        <div className="w-full h-full video-container" id={`remote-video-${userId}`} />
        
        <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-lg">
          <p className="font-semibold">{displayName}</p>
        </div>
        
        {!user.hasAudio && (
          <div className="absolute top-4 right-4 bg-red-600 p-2 rounded-full">
            <MicOff size={16} />
          </div>
        )}
        
        {!user.hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-4xl">
              {displayName[0]?.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{channelName}</h2>
                <p className="text-sm text-gray-400">{participants.length} participant{participants.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'speaker' : 'grid')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                >
                  {viewMode === 'grid' ? 'Speaker View' : 'Grid View'}
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              <div className={`grid gap-4 h-full ${
                participants.length === 1 ? 'grid-cols-1' :
                participants.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                participants.length <= 4 ? 'grid-cols-2' :
                participants.length <= 9 ? 'grid-cols-3' :
                'grid-cols-4'
              }`}>
                {renderLocalVideoContainer()}

                {Array.from(remoteUsersRef.current.entries()).map(([userId, user]) => 
                  renderRemoteVideoContainer(userId, user)
                )}
              </div>
            </div>

            <div className="bg-gray-800 px-4 py-4">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleAudio}
                  className={`p-4 rounded-full ${isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full ${isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                </button>

                <button
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  className={`p-4 rounded-full ${isScreenSharing ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
                </button>

                <button
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <Users size={24} />
                </button>

                <button
                  onClick={toggleChatPanel}
                  className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 relative"
                >
                  <MessageSquare size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={leaveChannel}
                  className="p-4 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <LogOut size={24} />
                </button>
              </div>
            </div>
          </div>

          {showParticipants && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-lg">Participants ({participants.length})</h3>
                <button onClick={() => setShowParticipants(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-2">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      {p.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{p.name} {p.isLocal && '(You)'}</p>
                   
                    </div>
                    <div className="flex gap-1">
                      {p.audioEnabled ? <Mic size={16} /> : <MicOff size={16} className="text-red-500" />}
                      {p.videoEnabled ? <Video size={16} /> : <VideoOff size={16} className="text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showChat && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-lg">Chat</h3>
                <button onClick={() => setShowChat(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={msg.type === 'system' ? 'text-center' : ''}>
                    {msg.type === 'system' ? (
                      <p className="text-xs text-gray-400 italic">{msg.text}</p>
                    ) : (
                      <div className={`bg-gray-700 rounded-lg p-3 ${msg.uid === uid ? 'bg-blue-600/30' : ''}`}>
                        <p className="font-semibold text-sm">
                          {msg.sender} {msg.uid === uid && '(You)'}
                        </p>
                        <p className="text-sm mt-1">{msg.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AgoraLiveStream