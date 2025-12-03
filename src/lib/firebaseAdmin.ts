import admin from 'firebase-admin'

if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_ADMIN_KEY
    
    if (!serviceAccountKey) {
      throw new Error('FIREBASE_ADMIN_KEY is not set')
    }

    // Remove outer quotes if they exist
    const cleanKey = serviceAccountKey.replace(/^'|'$/g, '')
    const serviceAccount = JSON.parse(cleanKey)
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'alsharq-76f89', // Explicitly set your project ID
    })
    
    console.log('✅ Firebase Admin initialized successfully')
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error)
    throw error
  }
}

const firestore = admin.firestore()
export { firestore, admin }