'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, UserPlus, Users, MessageSquare, Send, X, Settings, LogOut, RefreshCw, ArrowLeft } from 'lucide-react'

let AgoraRTC: any
if (typeof window !== 'undefined') {
  AgoraRTC = require('agora-rtc-sdk-ng')
}

const AgoraLiveStream = () => {
  const router = useRouter()
  
  // Load initial state from localStorage
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('agoraToken') || ''
    }
    return ''
  })
  const [channelName, setChannelName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionName') || ''
    }
    return ''
  })
  const [uid, setUid] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUid = localStorage.getItem('agoraId')
      return storedUid ? Number(storedUid) : null
    }
    return null
  })
  const [userName, setUserName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionUserName') || ''
    }
    return ''
  })
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showErrorButtons, setShowErrorButtons] = useState(false)

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
  const userStatesRef = useRef<Map<number, { hasAudio: boolean; hasVideo: boolean; isOnline: boolean }>>(new Map())
  const autoJoinAttempted = useRef(false)
  const cleanupCompleted = useRef(false)

  // Save to localStorage whenever form fields change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agoraToken', token)
    }
  }, [token])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionName', channelName)
    }
  }, [channelName])

  useEffect(() => {
    if (typeof window !== 'undefined' && uid !== null) {
      localStorage.setItem('agoraId', uid.toString())
    }
  }, [uid])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionUserName', userName)
    }
  }, [userName])

  // Load messages from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('agora_messages')
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages))
        } catch (err) {
          console.error('Failed to parse saved messages:', err)
        }
      }
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agora_messages', JSON.stringify(messages))
    }
  }, [messages])

  // Load participants view mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem('agora_viewMode') as 'grid' | 'speaker'
      if (savedViewMode) {
        setViewMode(savedViewMode)
      }
    }
  }, [])

  // Save view mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agora_viewMode', viewMode)
    }
  }, [viewMode])

  // Load panel states from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedShowParticipants = localStorage.getItem('agora_showParticipants')
      const savedShowChat = localStorage.getItem('agora_showChat')
      
      if (savedShowParticipants) {
        setShowParticipants(JSON.parse(savedShowParticipants))
      }
      if (savedShowChat) {
        setShowChat(JSON.parse(savedShowChat))
      }
    }
  }, [])

  // Save panel states to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agora_showParticipants', JSON.stringify(showParticipants))
    }
  }, [showParticipants])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agora_showChat', JSON.stringify(showChat))
    }
  }, [showChat])

  // Cleanup function for component unmount
  const cleanup = async () => {
    if (cleanupCompleted.current) return
    
    cleanupCompleted.current = true
    console.log('Cleaning up Agora resources...')
    
    try {
      // Unpublish and close local tracks
      if (localTracksRef.current.length > 0) {
        for (const track of localTracksRef.current) {
          try {
            if (clientRef.current) {
              await clientRef.current.unpublish(track).catch(console.error)
            }
            track.stop && track.stop()
            track.close && track.close()
          } catch (err) {
            console.error('Error cleaning up track:', err)
          }
        }
        localTracksRef.current = []
      }

      // Leave channel
      if (clientRef.current) {
        await clientRef.current.leave().catch(console.error)
        clientRef.current = null
      }

      // Clear remote users
      remoteUsersRef.current.clear()
      userNamesRef.current.clear()
      userStatesRef.current.clear()
      
      // Clear DOM elements
      if (localVideoRef.current) {
        localVideoRef.current.innerHTML = ''
      }
      if (screenShareRef.current) {
        screenShareRef.current.innerHTML = ''
      }
    } catch (err) {
      console.error('Error during cleanup:', err)
    }
  }

  // Clear user data for current channel
  const clearChannelData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agoraId')
      localStorage.removeItem('sessionUserName')
      setUid(null)
      setUserName('')
    }
  }

  // Enhanced event listeners setup
  const setupEventListeners = (client: any) => {
    // Remove existing listeners first to avoid duplicates
    client.removeAllListeners()

    client.on('user-published', async (user: any, mediaType: 'audio' | 'video') => {
      console.log(`User ${user.uid} published ${mediaType}`)
      try {
        await client.subscribe(user, mediaType)
        console.log(`Subscribed to ${user.uid}'s ${mediaType}`)

        if (mediaType === 'video' && user.videoTrack) {
          setTimeout(() => {
            const remoteUserContainer = document.querySelector(`[data-remote-uid="${user.uid}"]`)
            if (remoteUserContainer) {
              const videoContainer = remoteUserContainer.querySelector('.video-container')
              if (videoContainer) {
                videoContainer.innerHTML = ''
                user.videoTrack.play(videoContainer)
              }
            }
          }, 100)
        }

        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play()
        }

        // Update user state
        const currentState = userStatesRef.current.get(user.uid) || { hasAudio: false, hasVideo: false, isOnline: true }
        userStatesRef.current.set(user.uid, {
          ...currentState,
          hasAudio: mediaType === 'audio' ? true : currentState.hasAudio,
          hasVideo: mediaType === 'video' ? true : currentState.hasVideo,
          isOnline: true
        })

        updateParticipantsList()
      } catch (err) {
        console.error('Error handling user-published:', err)
      }
    })

    client.on('user-unpublished', (user: any, mediaType: 'audio' | 'video') => {
      console.log(`User ${user.uid} unpublished ${mediaType}`)
      
      const currentState = userStatesRef.current.get(user.uid) || { hasAudio: false, hasVideo: false, isOnline: true }
      userStatesRef.current.set(user.uid, {
        ...currentState,
        hasAudio: mediaType === 'audio' ? false : currentState.hasAudio,
        hasVideo: mediaType === 'video' ? false : currentState.hasVideo
      })

      updateParticipantsList()
    })

    client.on('user-joined', (user: any) => {
      console.log('User joined:', user.uid)
      
      // Initialize user state
      userStatesRef.current.set(user.uid, { hasAudio: false, hasVideo: false, isOnline: true })
      
      // Set default name
      const defaultName = `User ${user.uid}`
      if (!userNamesRef.current.has(user.uid)) {
        userNamesRef.current.set(user.uid, defaultName)
      }

      // Add to remote users
      remoteUsersRef.current.set(user.uid, user)

      updateParticipantsList()

      const displayName = userNamesRef.current.get(user.uid) || defaultName
      addSystemMessage(`${displayName} joined the stream`)

      // Request user info
      setTimeout(() => {
        sendUserInfo()
      }, 1000)
    })

    client.on('user-left', (user: any) => {
      console.log('User left:', user.uid)
      
      const userName = userNamesRef.current.get(user.uid) || `User ${user.uid}`
      
      // Remove user from all refs
      remoteUsersRef.current.delete(user.uid)
      userNamesRef.current.delete(user.uid)
      userStatesRef.current.delete(user.uid)
      
      // Remove video element
      const videoElement = document.getElementById(`remote-video-${user.uid}`)
      if (videoElement) {
        videoElement.innerHTML = ''
      }

      updateParticipantsList()
      addSystemMessage(`${userName} left the stream`)
    })

    client.on('stream-message', (uid: number, data: any) => {
      try {
        const decoder = new TextDecoder()
        const text = decoder.decode(data)
        const message = JSON.parse(text)

        if (message.type === 'user-info') {
          console.log(`Received user info: ${message.userName} (${message.uid})`)
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
          if (!showChat && message.uid !== uid) {
            setUnreadCount(prev => prev + 1)
          }
        } else if (message.type === 'user-state') {
          // Handle user state updates (audio/video changes)
          userStatesRef.current.set(message.uid, {
            hasAudio: message.hasAudio,
            hasVideo: message.hasVideo,
            isOnline: true
          })
          updateParticipantsList()
        }
      } catch (err) {
        console.error('Failed to parse stream message:', err)
      }
    })

    // Handle connection state changes
    client.on('connection-state-change', (curState: string, prevState: string) => {
      console.log(`Connection state changed from ${prevState} to ${curState}`)
    })
  }

  // Auto-join on component mount if we have required data and AgoraRTC is loaded
  useEffect(() => {
    // Only attempt auto-join once
    if (autoJoinAttempted.current) return
    autoJoinAttempted.current = true

    const autoJoin = async () => {
      // Check if we have all required data
      if (token && channelName && uid !== null && userName) {
        // Wait for AgoraRTC to be available
        if (!AgoraRTC) {
          console.log('Waiting for AgoraRTC to load...')
          // Try again after a short delay
          setTimeout(() => {
            if (AgoraRTC) {
              joinChannel()
            } else {
              console.error('AgoraRTC not available')
              setLoading(false)
              setError('Agora SDK failed to load')
            }
          }, 1000)
          return
        }
        
        // Add a small delay to ensure any previous instances are cleaned up
        await new Promise(resolve => setTimeout(resolve, 500))
        await joinChannel()
      } else {
        console.log('Missing required data for auto-join:', { token, channelName, uid, userName })
        setLoading(false)
        // Redirect to join session if data is missing
        router.push('/agora/joinsession')
      }
    }

    autoJoin()

    // Cleanup on component unmount
    return () => {
      cleanup()
    }
  }, []) // Empty dependency array to run only on mount

  const joinChannel = async () => {
    if (!token || !channelName || uid === null || !userName) {
      console.error('Missing required data for joining channel')
      setError('Missing required data for joining channel')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    setShowErrorButtons(false)

    try {
      const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || 'your_app_id'
      
      if (!APP_ID || APP_ID === 'your_app_id') {
        throw new Error('Agora App ID not configured. Please check your environment variables.')
      }

      // Clean up any previous state first
      await cleanup()
      cleanupCompleted.current = false

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
      clientRef.current = client

      // Initialize user data
      userNamesRef.current.set(uid, userName)
      userStatesRef.current.set(uid, { hasAudio: true, hasVideo: false, isOnline: true })

      // Create audio track first
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      localTracksRef.current = [audioTrack]

      // Join channel - if UID conflict occurs, show error instead of generating random UID
      try {
        await client.join(APP_ID, channelName, token, uid)
      } catch (joinError: any) {
        if (joinError.code === 'UID_CONFLICT') {
          console.error('UID conflict detected:', joinError)
          // Clear the conflicting user data
          clearChannelData()
          setError('User ID is already in use in this channel. Please use a different User ID.')
          setShowErrorButtons(true)
          setLoading(false)
          return
        } else {
          throw joinError
        }
      }
      
      // Publish audio track
      await client.publish([audioTrack])

      // Set joined state immediately after successful join
      setJoined(true)

      // Set up event listeners
      setupEventListeners(client)

      await client.enableDualStream()

      // Initialize participants list
      updateParticipantsList()

      addSystemMessage('You joined the live stream')

      // Broadcast user info and state
      setTimeout(() => {
        sendUserInfo()
        sendUserState()
      }, 500)

    } catch (err: any) {
      console.error('Join channel error:', err)
      setError(err.message || 'Failed to join channel')
      
      // Clean up on error
      await cleanup()
    } finally {
      setLoading(false)
    }
  }

  // Send user state (audio/video status)
  const sendUserState = async () => {
    if (!clientRef.current) return

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify({
        type: 'user-state',
        uid: uid,
        hasAudio: isAudioEnabled,
        hasVideo: isVideoEnabled || isScreenSharing
      }))

      await clientRef.current.sendStreamMessage(data)
    } catch (err) {
      console.error('Failed to send user state:', err)
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

  // Enhanced participants list update
  const updateParticipantsList = () => {
    const localParticipant = {
      uid: uid!,
      name: userName,
      isLocal: true,
      audioEnabled: isAudioEnabled,
      videoEnabled: isVideoEnabled || isScreenSharing
    }

    const remoteParticipants = Array.from(remoteUsersRef.current.entries()).map(([userId, user]) => {
      const userState = userStatesRef.current.get(userId) || { hasAudio: false, hasVideo: false, isOnline: false }
      const name = userNamesRef.current.get(userId) || `User ${userId}`
      
      return {
        uid: userId,
        name,
        isLocal: false,
        audioEnabled: userState.hasAudio,
        videoEnabled: userState.hasVideo,
        isOnline: userState.isOnline
      }
    })

    setParticipants([localParticipant, ...remoteParticipants])
  }

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, { type: 'system', text, time: new Date().toLocaleTimeString() }])
  }

  const leaveChannel = async () => {
    await cleanup()
    setJoined(false)
    setParticipants([])
    remoteUsersRef.current.clear()
    userNamesRef.current.clear()
    userStatesRef.current.clear()
    setIsScreenSharing(false)
    setUnreadCount(0)
    
    // Clear user data when leaving channel
    clearChannelData()
    
    // Direct redirect to join session
    router.push('/agora/joinsession')
  }

  // Enhanced toggle functions that broadcast state changes
  const toggleAudio = async () => {
    if (localTracksRef.current.length > 0) {
      const audioTrack = localTracksRef.current[0]
      const newState = !audioTrack.enabled
      
      try {
        await audioTrack.setEnabled(newState)
        setIsAudioEnabled(newState)

        // Update local state
        userStatesRef.current.set(uid!, { 
          ...userStatesRef.current.get(uid!)!, 
          hasAudio: newState 
        })

        updateParticipantsList()
        sendUserState() // Broadcast state change
      } catch (err) {
        console.error('Failed to toggle audio:', err)
      }
    }
  }

  const toggleVideo = async () => {
    if (isScreenSharing) {
      alert('Stop screen sharing first to enable camera')
      return
    }

    const newState = !isVideoEnabled

    try {
      if (newState) {
        // Enable video
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
      } else {
        // Disable video
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
      }

      // Update state and broadcast
      userStatesRef.current.set(uid!, { 
        ...userStatesRef.current.get(uid!)!, 
        hasVideo: newState 
      })

      updateParticipantsList()
      sendUserState()

    } catch (err) {
      console.error('Failed to toggle video:', err)
      alert('Failed to toggle camera')
    }
  }

  const startScreenShare = async () => {
    if (!clientRef.current) return
    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack({}, 'auto')

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

      // Update state and broadcast
      userStatesRef.current.set(uid!, { 
        ...userStatesRef.current.get(uid!)!, 
        hasVideo: true // Screen share counts as video
      })

      updateParticipantsList()
      sendUserState()

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

      // Update state and broadcast
      userStatesRef.current.set(uid!, { 
        ...userStatesRef.current.get(uid!)!, 
        hasVideo: isVideoEnabled // Revert to camera state
      })

      updateParticipantsList()
      sendUserState()

      addSystemMessage('Screen sharing stopped')
    } catch (err) {
      console.error('Failed to stop screen share:', err)
    }
  }

  // FIXED: Renamed function to avoid conflict
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

    sendChatMessageToStream(messageInput)

    setMessageInput('')
  }

  const sendChatMessageToStream = async (message: string) => {
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

  const toggleChatPanel = () => {
    setShowChat(!showChat)
    // Reset unread count when opening chat
    if (!showChat) {
      setUnreadCount(0)
    }
  }

  const enterFullscreen = (element: HTMLElement) => {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen()
    } else if ((element as any).mozRequestFullScreen) {
      (element as any).mozRequestFullScreen()
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen()
    }
  }

  const refreshPage = () => {
    window.location.reload()
  }

  const goBackToJoin = () => {
    router.push('/agora/joinsession')
  }

  const renderLocalVideoContainer = () => {
    return (
      <div
        className="relative bg-green-100 rounded-lg overflow-hidden aspect-video cursor-pointer hover:ring-2 hover:ring-red-700 transition"
        onClick={(e) => enterFullscreen(e.currentTarget)}
      >
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

        <div className="absolute bottom-4 left-4  px-3 py-2 rounded-lg">
          <p className="font-semibold text-white">{userName} (You)</p>
          {isScreenSharing && <p className="text-xs text-green-400">Screen Sharing</p>}
        </div>

        {!isAudioEnabled && (
          <div className="absolute top-4 right-4 bg-red-600 p-2 rounded-full">
            <MicOff size={16} className="text-white" />
          </div>
        )}

        {!isVideoEnabled && !isScreenSharing && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-100">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl text-white">
              {userName[0]?.toUpperCase() || 'Y'}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderRemoteVideoContainer = (userId: number) => {
    const userState = userStatesRef.current.get(userId) || { hasAudio: false, hasVideo: false, isOnline: false }
    const displayName = userNamesRef.current.get(userId) || `User ${userId}`

    return (
      <div
        key={userId}
        className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video cursor-pointer hover:ring-2 hover:ring-red-700 transition"
        data-remote-uid={userId}
        onClick={(e) => enterFullscreen(e.currentTarget)}
      >
        <div 
          className="w-full h-full video-container" 
          id={`remote-video-${userId}`}
        />

        <div className="absolute bottom-4 left-4 px-3 py-2 rounded-lg">
          <p className="font-semibold text-white">{displayName}</p>
        </div>

        {!userState.hasAudio && (
          <div className="absolute top-4 right-4 bg-red-600 p-2 rounded-full">
            <MicOff size={16} className="text-white" />
          </div>
        )}

        {!userState.hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-200">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-4xl text-white">
              {displayName[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Show loading screen while auto-joining
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-red-700 text-lg">Joining session...</p>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    )
  }

  // Show error state if auto-join failed but we're not redirecting
  if (!joined && !loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Failed to join session</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          
          {/* Show buttons only for ID conflict */}
          {showErrorButtons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goBackToJoin}
                className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Join Session
              </button>
              
              <button
                onClick={refreshPage}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <RefreshCw size={20} />
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Only show the main interface if joined successfully
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {joined ? (
        <div className="flex flex-col md:flex-row h-screen">
          <div className="flex-1 flex flex-col bg-white min-h-screen">
            <div className="bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200">
              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold text-red-700">Session {channelName}</h1>
                <h3 className="text-sm text-green-500">
                  Now Live • {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 mt-2 sm:mt-0">
                <div className="flex items-center gap-1 bg-red-700 text-white px-3 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-semibold">Live</span>
                </div>
              </div>
            </div>

            {/* Scrollable video area */}
            <div className="flex-1 p-2 sm:p-4 overflow-auto">
              <div
                className={`grid gap-4 h-full w-full ${
                  participants.length === 1
                    ? 'grid-cols-1'
                    : participants.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : participants.length <= 4
                    ? 'grid-cols-2 sm:grid-cols-2'
                    : participants.length <= 9
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-3 sm:grid-cols-4'
                }`}
              >
                <div className="min-w-0 aspect-video rounded-lg overflow-hidden bg-black">
                  {renderLocalVideoContainer()}
                </div>

                {Array.from(remoteUsersRef.current.keys()).map(userId => (
                  <div
                    key={userId}
                    className="min-w-0 aspect-video rounded-lg overflow-hidden bg-black"
                  >
                    {renderRemoteVideoContainer(userId)}
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 left-0 w-full bg-white py-4 shadow-md z-50 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={toggleAudio}
                  className={`p-4 rounded-full ${
                    isAudioEnabled
                      ? 'bg-white border-red-700 border text-red-700 hover:bg-red-100'
                      : 'bg-red-700 hover:bg-red-800 text-white'
                  }`}
                >
                  {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full ${
                    isVideoEnabled
                      ? 'bg-white border-red-700 border text-red-700 hover:bg-red-100'
                      : 'bg-red-700 hover:bg-red-800 text-white'
                  }`}
                >
                  {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                </button>

                <button
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  className={`p-4 rounded-full ${
                    isScreenSharing
                      ? 'bg-white border-red-700 border text-red-700 hover:bg-red-100'
                      : 'bg-red-700 hover:bg-red-800 text-white'
                  }`}
                >
                  {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
                </button>

                <button
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="p-4 rounded-full bg-red-700 hover:bg-red-800 text-white"
                >
                  <Users size={24} />
                </button>

                <button
                  onClick={toggleChatPanel}
                  className="p-4 rounded-full bg-red-700 hover:bg-red-800 text-white relative"
                >
                  <MessageSquare size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-red-700 text-xs w-5 h-5 rounded-full flex items-center justify-center border border-red-700">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={leaveChannel}
                  className="p-4 rounded-full bg-red-700 hover:bg-red-800 text-white"
                >
                  <LogOut size={24} />
                </button>
              </div>
            </div>
          </div>

          {showParticipants && (
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-red-200 flex flex-col bg-white">
              <div className="p-4 flex justify-between items-center bg-red-700 text-white">
                <h3 className="font-bold text-lg">Participants ({participants.length})</h3>
                <button onClick={() => setShowParticipants(false)} className="text-white hover:text-red-200">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-2">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="w-10 h-10 bg-red-700 text-white rounded-full flex items-center justify-center font-bold">
                      {p.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{p.name} {p.isLocal && '(You)'}</p>
                      <p className="text-xs text-gray-500">
                        {p.audioEnabled ? 'Audio on' : 'Audio off'} • {p.videoEnabled ? 'Video on' : 'Video off'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {p.audioEnabled ? (
                        <Mic size={16} className="text-green-600" />
                      ) : (
                        <MicOff size={16} className="text-red-600" />
                      )}
                      {p.videoEnabled ? (
                        <Video size={16} className="text-green-600" />
                      ) : (
                        <VideoOff size={16} className="text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showChat && (
            <div className="w-full md:w-80 h-screen bg-white border-t md:border-t-0 md:border-l border-red-700 flex flex-col">
                     <div className="p-4 border-b border-red-700 flex justify-between items-center bg-red-700 text-white">
                       <h3 className="font-bold text-lg">Chat</h3>
                       <button onClick={() => setShowChat(false)} className="hover:text-red-200 transition-colors">
                         <X size={20} />
                       </button>
                     </div>
           
                     <div className="flex-1 overflow-y-auto p-4 space-y-3">
                       {messages.map((msg, i) => (
                         <div
                           key={i}
                           className={`flex ${
                             msg.type === 'system'
                               ? 'justify-center'
                               : msg.uid === uid
                               ? 'justify-end'
                               : 'justify-start'
                           }`}
                         >
                           {msg.type === 'system' ? (
                             <p className="text-xs text-red-500 italic">{msg.text}</p>
                           ) : (
                             <div
                               className={`max-w-[80%] rounded-lg p-2 shadow ${
                                 msg.uid === uid
                                   ? 'bg-transparent text-white rounded-tr-none border-y-2 border-red-700'
                                   : 'bg-white rounded-tl-none border-y-2 border-red-700'
                               }`}
                             >
                               {msg.uid !== uid && (
                                 <p className="font-semibold text-sm text-red-700">{msg.sender}</p>
                               )}
                               <p className="text-sm mt-1 text-black">{msg.text}</p>
                               <p className="text-xs mt-1 text-red-700">{msg.time}</p>
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
           
                     <div className="p-4 bg-red-50 border-t border-red-300 sticky bottom-0">
                       <div className="flex gap-2">
                         <input
                           type="text"
                           value={messageInput}
                           onChange={e => setMessageInput(e.target.value)}
                           onKeyPress={e => e.key === 'Enter' && sendMessage()}
                           placeholder="Type a message..."
                           className="flex-1 px-2 py-1 border border-red-300 text-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                         />
                         <button
                           onClick={sendMessage}
                           className="p-2 bg-red-700 hover:bg-red-800 rounded-lg text-white"
                         >
                           <Send size={20} />
                         </button>
                       </div>
                     </div>
                   </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default AgoraLiveStream