import * as dotenv from 'dotenv'
import admin from 'firebase-admin'

dotenv.config({ path: '.env.local' })

async function test() {
  try {
    const key = process.env.FIREBASE_ADMIN_KEY?.replace(/^'|'$/g, '')
    if (!key) throw new Error('No key found')
    
    const serviceAccount = JSON.parse(key)
    console.log('Project ID:', serviceAccount.project_id)
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      })
    }

    const db = admin.firestore()
    
    // Test write
    await db.collection('_test').doc('test').set({ 
      test: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    
    console.log('✅ SUCCESS! Firestore is working')
    
    // Cleanup
    await db.collection('_test').doc('test').delete()
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ FAILED:', error.message)
    if (error.code === 5) {
      console.error('👉 You need to create Firestore database in Firebase Console!')
    }
    process.exit(1)
  }
}

test()