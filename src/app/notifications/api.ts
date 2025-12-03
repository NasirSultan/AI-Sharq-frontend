import admin from "@/lib/firebaseAdmin"

export async function storeToken(userId: string, role: string, token: string) {
  const db = admin.firestore()
  const tokensRef = db.collection("deviceTokens")
  
  await tokensRef.doc(token).set({
    token,
    userId,
    role,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true })

  return { message: "Token stored successfully" }
}
