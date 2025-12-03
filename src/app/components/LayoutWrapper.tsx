"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()?.toLowerCase()
  const [isChecking, setIsChecking] = useState(true)

  const publicPaths = [
    "/",
    "/authentication/signin",
    "/authentication/signup",
    "/authentication/verificationcode",
    "/authentication/forgetpassword",
    "/authentication/setnewpassword",
    "/authentication/otpvarification",
    "/authentication/signup/setpassword",
    "/authentication/signup/otpvarification",

  ]

  const isPublic = publicPaths.includes(pathname)
  const hideNavbar = pathname === "/" || pathname.startsWith("/authentication/")

  const handleGoBack = () => {
    router.back()
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const token = localStorage.getItem("token")
    const lastPage = sessionStorage.getItem("lastPage")
    const navigationType = performance.getEntriesByType("navigation")[0]?.type
    const isManualAccess = navigationType === "navigate" && lastPage !== pathname

    sessionStorage.setItem("lastPage", pathname)

    if (!isPublic) {
      if (!token) {
        router.replace("/authentication/SignIn")
        return
      }

      if (token) {
        setIsChecking(false)
        return
      }
    }

    setIsChecking(false)
  }, [pathname, isPublic, router])

  if (isChecking && !isPublic) return null

  return (
    <>
      {!hideNavbar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar onGoBack={handleGoBack} />
        </div>
      )}

      <main className={!hideNavbar ? "pt-20" : ""}>
        {children}
      </main>
    </>
  )
}
