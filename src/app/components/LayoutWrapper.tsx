"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()?.toLowerCase()
  const [isChecking, setIsChecking] = useState(true)

  const publicPaths = ["/", "/authentication/signin", "/authentication/signup"]
  const isPublic = publicPaths.includes(pathname)

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

    // If visiting a private route
    if (!isPublic) {
      // If not logged in
      if (!token) {
        router.replace("/authentication/SignIn")
        return
      }

      // If logged in, allow full navigation
      if (token) {
        setIsChecking(false)
        return
      }
    }

    // If public route, no restriction
    setIsChecking(false)
  }, [pathname, isPublic, router])

  const hideNavbar = pathname === "/" || pathname.startsWith("/authentication/")

  if (isChecking && !isPublic) return null

  return (
    <>
      {!hideNavbar && <Navbar onGoBack={handleGoBack} />}
      {children}
    </>
  )
}