"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide Navbar on auth pages
  const hideNavbarOn = ["/authentication/SignIn", "/authentication/SignUp","/authentication/SetUpYourProfile","/authentication/SetNewPassword","/authentication/Loginpage","/authentication/ForgetPassword","/authentication/Code","/","/speakers/SetUpYourProfile","/sponsors/SignIn","/speakers/SignIn","/sponsors/SetUpYourProfile"];
  const shouldShowNavbar = !hideNavbarOn.includes(pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
}
