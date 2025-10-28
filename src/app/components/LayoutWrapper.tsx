'use client'

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()?.toLowerCase()
  const [isChecking, setIsChecking] = useState(true)

  const publicPaths = ["/", "/authentication/signin", "/authentication/signup"]
  const isPublic = publicPaths.includes(pathname)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Override router.push once
    const originalPush = router.push
    router.push = (url: string, ...args: any[]) => {
      sessionStorage.setItem("cameFromApp", "true")
      originalPush(url, ...args)
    }

    const token = localStorage.getItem("token")
    const cameFromApp = sessionStorage.getItem("cameFromApp")
    const lastPage = sessionStorage.getItem("lastPage")

    // 1. Not logged in
    if (!isPublic && !token) {
      router.replace("/authentication/SignIn")
      return
    }

    // 2. Direct access (not refresh or in-app nav)
    if (!isPublic && token) {
      const isSamePageRefresh = lastPage === pathname
      if (!cameFromApp && !isSamePageRefresh) {
        router.replace("/authentication/SignIn")
        return
      }
    }

    // Passed validation
    sessionStorage.setItem("lastPage", pathname)
    sessionStorage.removeItem("cameFromApp")

    setIsChecking(false)
  }, [pathname, isPublic, router])

  const hideNavbar = pathname === "/" || pathname.startsWith("/authentication/")

  if (isChecking && !isPublic) return null

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  )
}
