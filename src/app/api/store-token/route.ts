import { firestore } from '@/lib/firebaseAdmin'
import admin from 'firebase-admin'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    
    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Token missing' }), 
        { status: 400 }
      )
    }

    const docRef = firestore.collection('fcmTokens').doc(token)
    await docRef.set({ 
      token, 
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })

    console.log('Token stored in Firestore:', token)
    
    return new Response(
      JSON.stringify({ message: 'Token stored successfully' }), 
      { status: 200 }
    )
  } catch (error) {
    console.error('Error storing token:', error)
    
    return new Response(
      JSON.stringify({ 
        message: 'Error storing token',
        error: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    )
  }
}