'use client'

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()?.toLowerCase()

  const hideNavbarPaths = ["/authentication/signup", "/authentication/signin"]
  
  const hideNavbar = hideNavbarPaths.some(path => pathname?.startsWith(path)) || pathname === "/"

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  )
}
