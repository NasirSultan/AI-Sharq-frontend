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

    if (!(router.push as any)._patched) {
      const originalPush = router.push
      ;(router.push as any) = (url: string, ...args: any[]) => {
        sessionStorage.setItem("cameFromApp", "true")
        originalPush(url, ...args)
      }
      ;(router.push as any)._patched = true

      document.addEventListener("click", (e) => {
        const link = (e.target as HTMLElement).closest("a")
        if (link && link.href && link.origin === window.location.origin) {
          sessionStorage.setItem("cameFromApp", "true")
        }
      })
    }

    const lastPage = sessionStorage.getItem("lastPage")
    const navigationType = performance.getEntriesByType("navigation")[0]?.type
    const isRefresh = navigationType === "reload"
    const isBackForward = navigationType === "back_forward"

    setTimeout(() => {
      const cameFromApp = sessionStorage.getItem("cameFromApp")

      if (!isPublic && !token) {
        router.replace("/authentication/SignIn")
        return
      }

      if (!isPublic && token) {
        const isSamePageRefresh = lastPage === pathname
        const isManualAccess =
          !cameFromApp && !isRefresh && !isBackForward && !isSamePageRefresh

        // Allow browser back/forward navigation
        if (isManualAccess && !isBackForward) {
          router.replace("/authentication/SignIn")
          return
        }
      }

      sessionStorage.setItem("lastPage", pathname)
      sessionStorage.removeItem("cameFromApp")
      setIsChecking(false)
    }, 0)
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
